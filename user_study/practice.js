// stuff for the ui and program to work
var L = 7;
var SHAPE = ['CUBE', 'SPHERE', 'EMPTY'];
var COLOR = ['R', 'G', 'B'];
var shape_idx = 0;
var color_idx = 0;

// lay-out things
var WW = 8;
var WW_SMOL = 4;

var GRID_TOPP = -3;

var OFFSETTEXTTOP = WW * 0.1;
var OFFSETTOP = GRID_TOPP + WW * 1.2;
var OFFSET2 =   GRID_TOPP + WW * 10;
var OFFSET3 =   GRID_TOPP + WW * 15;
var OFFSET4 =   GRID_TOPP + OFFSET3 + WW*3;
var OFFSET5 =   GRID_TOPP + OFFSET4 + WW*5;

// to report to the server
var examples = {};

var queryString;


// clear a grid canvas
function clear_grid_canvas(grid_canv_name){
    for (var i=0; i<L; i+=1) {
        for (var j=0; j<L; j+=1) {
            let boxstr = grid_canv_name+i+j;
            $(boxstr).css("background-image", '');
        }
    }
}

// fill a grid canvas with the EMPTY tile
function populate_empty_canvas(grid_canv_name){
    for (var i=0; i<L; i+=1) {
        for (var j=0; j<L; j+=1) {
            let boxstr = grid_canv_name+i+j;
            $(boxstr).css("background-image", 'url(assets/empty.png)');
        }
    }
}

function clear_candidate_border(){
    for (var i=0; i<3; i++){
        $("#candidate_highlight_"+i).css("border-width", "0px");
    }
}

// render a list of shapes onto grid vansaas
function render_shape_list(shape_list, grid_canv_name){
    Object.entries(shape_list).forEach( ([key, value]) => {
        let ii = value[0][0];
        let jj = value[0][1];
        let ss = value[1][0];
        let cc = value[1][1];
        let boxstr = grid_canv_name+ii+jj;
        let spritee = to_sprite(ss, cc);
        $(boxstr).css("background-image", 'url(assets/'+spritee+'.png)');
    });
}


// make the next botton when game is done
function make_next_button() {
    // make sure we dont have oen already
    $("#NEXT").remove();
    // next button
    var box = document.createElement("div"); 
    box.className = "interact";
    box.id = "NEXT";
    box.style.top = "" + (OFFSETTOP + WW * 8) + "vmin";
    box.style.left = "" + (OFFSET4) + "vmin";
    $(box).css("background-image", 'url(assets/forward.png)');
    $(box).hover(function(){
        $(this).css("border-width", "thick");
    }, function(){
        $(this).css("border-width", "thin");
    });

    $(box).click(function(){
        // go to robot briefing
        window.location = `robot_brief.html${queryString}`;
    });

    $("#control").append(box);
}

function highlight(highlight_obj, base_w){
    highlight_obj.css("width", `${base_w-1}vmin`);
    highlight_obj.css("height", `${base_w-1}vmin`);
    highlight_obj.css("border-width", "thick");
    highlight_obj.css("border-color", "blue");
}
function de_highlight(highlight_obj, base_w){
    highlight_obj.css("width", `${base_w}vmin`);
    highlight_obj.css("height", `${base_w}vmin`);
    highlight_obj.css("border-width", "thin");
    highlight_obj.css("border-color", "white");
}

// the working grid
function make_working_grid(){
    for (var i=0; i<L; i+=1) {
        for (var j=0; j<L; j+=1) {
            let coord_i = i;
            let coord_j = j;
            var box = document.createElement("div"); 
            box.id = "box_"+i+j;
            box.className = "box";
            box.style.top = "" + (i*WW + OFFSETTOP) + "vmin";
            box.style.left = "" + (j*WW + OFFSET2) + "vmin";
            // set up hover function to highlight / de-highlight current cell
            $(box).hover(function(){
                highlight($(`#cand_box_0${coord_i}${coord_j}`), WW_SMOL);
                highlight($(`#cand_box_1${coord_i}${coord_j}`), WW_SMOL);
                highlight($(`#target_box_${coord_i}${coord_j}`), WW_SMOL);
                $(this).css("border-width", "thick");
            }, function(){
                de_highlight($(`#cand_box_0${coord_i}${coord_j}`), WW_SMOL);
                de_highlight($(`#cand_box_1${coord_i}${coord_j}`), WW_SMOL);
                de_highlight($(`#target_box_${coord_i}${coord_j}`), WW_SMOL);
                $(this).css("border-width", "thin");
            });
            $("#grid").append(box);

            // on click update my background to match
            $(box).click(function(){
                if (examples[[coord_i, coord_j]] == undefined){
                    // the empty tile should have a canonicalized 'coloridx' of 0
                    let color_idx_empty_safe = shape_idx == 2 ? 0 : color_idx;
                    examples[[coord_i, coord_j]] = [shape_idx, color_idx_empty_safe];
                    render_plant();
                } else {
                    delete examples[[coord_i, coord_j]];
                    render_plant();
                }
                console.log(examples);

                const example_strings = Object.values(examples).map(x=>x.toString())
                if (example_strings.includes("0,1") &&
                    example_strings.includes("1,2") &&
                    example_strings.includes("2,0")
                    ){
                    make_next_button();
                }


            });

        };
    };
    // working area text
    var box = document.createElement("div"); 
    box.id = "working_text";
    box.innerHTML = "your grid";
    box.className = "box text";
    box.style.top = "" + OFFSETTEXTTOP + "vmin";
    box.style.left = "" + OFFSET2 + "vmin";
    $("#grid").append(box);

    // warming text
    var box = document.createElement("div"); 
    box.id = "warning_text";
    box.innerHTML = "";
    box.className = "box text warning";
    box.style.top = "" + (OFFSETTEXTTOP + 3)+ "vmin";
    box.style.left = "" + OFFSET2 + "vmin";
    $("#grid").append(box);
}

    
/* Creating the grid */
function make_layout() {
    // the working grid
    make_working_grid();

    // instructions

    var box = document.createElement("div"); 
    box.id = "progress_bar";
    box.innerHTML = `
    <h3> Practce </h3>
    Let's practice placing symbols on your grid <br>
    <br>
    Place the following 3 symbols anywhere on your grid:<br>
    a green chicken <br>
    a blue pig <br>
    a pebble <br>
    <br>
    Once you are done, a yellow arrow will appear <br>
    <br>
    Click on the yellow arrow to continue
    `;
    box.className = "box instructions";
    box.style.top = "" + OFFSETTOP + "vmin";
    box.style.left = "" + 10 + "vmin";
    $("#grid").append(box);  


    // put down the 7 things for the control block
    // the shapes to put down
    for (var i=0; i<3; i++){
        var box = document.createElement("div"); 
        box.className = "box";
        box.style.top = "" + (OFFSETTOP + WW * 7.5) + "vmin";
        box.style.left = "" + (i*WW + WW*4 + OFFSET2) + "vmin";
        $(box).hover(function(){
            $(this).css("border-width", "thick");
        }, function(){
            $(this).css("border-width", "thin");
        });
        let myid = i;
        $(box).click(function(){
            shape_idx = myid;
            render_plant();
        });
        if (i == 0) { $(box).css("background-image", 'url(assets/cube.png)');}
        if (i == 1) { $(box).css("background-image", 'url(assets/sphere.png)');}
        if (i == 2) { $(box).css("background-image", 'url(assets/empty.png)');}
        $("#control").append(box);
    }

    // the colors for the shapes
    for (var jj=0; jj<3; jj++){
        var box = document.createElement("div"); 
        box.className = "box";
        box.style.top = "" + (OFFSETTOP + WW * 9) + "vmin";
        box.style.left = "" + ((jj*WW) + WW*4 + OFFSET2) + "vmin";
        $(box).hover(function(){
            $(this).css("border-width", "thick");
        }, function(){
            $(this).css("border-width", "thin");
        });
        if (jj == 0) { $(box).css("background-image", 'url(assets/red.png)');}
        if (jj == 1) { $(box).css("background-image", 'url(assets/green.png)');}
        if (jj == 2) { $(box).css("background-image", 'url(assets/blue.png)');}
        let myid = jj;
        $(box).click(function(){
            color_idx = myid;
            render_plant();
        });
        $("#control").append(box);
    }

    // the thing to plant
    var box = document.createElement("div"); 
    box.className = "box big";
    box.id = "to_plant";
    box.style.top = "" + (OFFSETTOP + WW * 8) + "vmin";
    box.style.left = "" + (OFFSET2) + "vmin";
    $("#control").append(box);
    render_plant();
};

// from the ids to a particular sprite
function to_sprite(s_id, c_id){
    var to_plant = "";
    if (s_id == 2) {to_plant = "empty";}
    if (s_id == 0){
        if (c_id == 0) {to_plant = "cube_red";}
        if (c_id == 1) {to_plant = "cube_green";}
        if (c_id == 2) {to_plant = "cube_blue";}
    }
    if (s_id == 1){
        if (c_id == 0) {to_plant = "sphere_red";}
        if (c_id == 1) {to_plant = "sphere_green";}
        if (c_id == 2) {to_plant = "sphere_blue";}
    }
    return to_plant;
}

function render_plant(){

    // render the to_plant icon
    var to_plant_str = to_sprite(shape_idx, color_idx);
    $("#to_plant").css("background-image", 'url(assets/'+to_plant_str+'.png)');

    clear_grid_canvas("#box_");
    Object.entries(examples).forEach(([key, value]) => {
        let plant_str = to_sprite(value[0], value[1]);
        let boxstr = "#box_"+key[0]+key[2];
        $(boxstr).css("background-image", 'url(assets/'+plant_str+'.png)');
    });

};

$(document).ready(function(){
    // grab the url params
    // set global variables *GASP*
    queryString = window.location.search;
    make_layout();
})

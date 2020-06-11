var L = 7;
var SHAPE = ['CUBE', 'SPHERE', 'EMPTY'];
var COLOR = ['R', 'G', 'B'];
var shape_idx = 0;
var color_idx = 0;
var examples = {};

var WW = 8;
var WW_SMOL = 4;

var GRID_TOPP = -3;

var OFFSETTEXTTOP = WW * 0.1;
var OFFSETTOP = GRID_TOPP + WW * 1.2;
var OFFSET2 =   GRID_TOPP + WW * 7;
var OFFSET3 =   GRID_TOPP + WW * 15;
var OFFSET4 =   GRID_TOPP + OFFSET3 + WW*3

var target_id = Math.floor(Math.random() * all_shapes.length);
var target = all_shapes[target_id];

var L0SETS = {};

let random_shape_order = {}
for (var shapid = 0; shapid < all_shapes.length; shapid++){
    random_shape_order[shapid] = Math.random();
}

var target_id = Math.floor(Math.random() * all_shapes.length);
var target = all_shapes[target_id];

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

// make new problem instance
function new_problem(){
    // grab new target-id and clear examples
    target_id = Math.floor(Math.random() * all_shapes.length);
    target = all_shapes[target_id];
    examples = {};
    // clear all boxes with empty
    for (var jjj=0; jjj<3; jjj++){
        clear_grid_canvas("#cand_box_"+jjj);
    }
    clear_candidate_border();
    clear_grid_canvas("#box_");
    // re-render target image
    for (var i=0; i<L; i+=1) {
        for (var j=0; j<L; j+=1) {
            let box_name = "#target_box_"+i+j;
            $(box_name).css("background-image", 'url(assets/empty.png)');
        }
    }
    render_shape_list(target, "#target_box_");
}

// the target
function make_target(){
    for (var i=0; i<L; i+=1) {
        for (var j=0; j<L; j+=1) {
            let coord_i = i;
            let coord_j = j;
            var box = document.createElement("div"); 
            box.id = "target_box_"+i+j;
            box.className = "box smol";
            box.style.top = "" + (i*WW_SMOL + OFFSETTOP) + "vmin";
            box.style.left = "" + (j*WW_SMOL + 10) + "vmin";
            $(box).click(function(){
                new_problem();
            });

            $("#grid").append(box);

        };
    };

    var box = document.createElement("div"); 
    box.id = "target_text";
    box.innerHTML = "target";
    box.className = "box text";
    box.style.top = "" + OFFSETTEXTTOP + "vmin";
    box.style.left = "" + 10 + "vmin";
    $("#grid").append(box);

    render_shape_list(target, "#target_box_");
}

// the candidates
function make_candidates(){
    for (var cand=0; cand<2; cand++){
        for (var i=0; i<L; i+=1) {
            for (var j=0; j<L; j+=1) {
                let coord_i = i;
                let coord_j = j;
                var box = document.createElement("div"); 
                box.id = "cand_box_"+cand+i+j;
                box.className = "box smol";
                box.style.top = "" + (i*WW_SMOL + OFFSETTOP + WW_SMOL * cand * 8) + "vmin";
                box.style.left = "" + (j*WW_SMOL + OFFSET4) + "vmin";

                $("#grid").append(box);

            };
        };

        // candidate text
        var box = document.createElement("div"); 
        box.id = "candidate_text_" + cand;
        box.innerHTML = cand == 0 ? "robot 1 thinks this " : "robot 2 thinks this";
        box.className = "box text small";
        box.style.top = "" + (OFFSETTOP - 2.3 + WW_SMOL * cand * 8) + "vmin";
        box.style.left = "" + (OFFSET4 + 0.1) + "vmin";
        $("#grid").append(box);

        // candidate highlight box
        var box = document.createElement("div"); 
        box.id = "candidate_highlight_" + cand;
        box.className = "box highlight"
        box.style.top = "" + (OFFSETTOP + WW_SMOL * cand * 8) + "vmin";
        box.style.left = "" + (OFFSET4 ) + "vmin";
        $("#grid").append(box);

    };

    var box = document.createElement("div"); 
    box.id = "result_text";
    box.innerHTML = "results";
    box.className = "box text";
    box.style.top = "" + OFFSETTEXTTOP + "vmin";
    box.style.left = "" + OFFSET4 + "vmin";
    $("#grid").append(box);

}

// render listener results
function render_l_results(l_candidates, cand_id){
//    if (l_candidates.length < 1) {
//        return;
//    }
//    let shape_id = l_candidates[0];
//    let cand_shape = all_shapes[shape_id];
//    clear_grid_canvas("#cand_box_"+cand_id);
//    populate_empty_canvas("#cand_box_"+cand_id);
//    render_shape_list(cand_shape, "#cand_box_"+cand_id);
//    if (shape_id == target_id){
//        // $("#candidate_highlight_"+cand_id).css("border-width", "5px");
//
//        console.log("asdfasdfasdf");
//        // register to firebase
//        var ref = fbase.ref('other/');
//        console.log(ref);
//        ref.once("value", function(snapshot) {
//            ref.set(examples);
//        });
//
//    }
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
            $(box).hover(function(){
                $(this).css("border-width", "thick");
            }, function(){
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

                let legal_utter = said_to_dict(S0(target_id,[]));
                $("#warning_text").text("")
                Object.entries(examples).forEach(([key, value]) => {
                    if (String(legal_utter[key]) != String(value)){
                        $("#warning_text").text("inconsistent examples!")
                    }
                });
                clear_candidate_border();
                clear_grid_canvas("#cand_box_0");
                clear_grid_canvas("#cand_box_1");
                run_l0();
                run_l1();
            });

        };
    };
    // working area text
    var box = document.createElement("div"); 
    box.id = "working_text";
    box.innerHTML = "working area";
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
    // the target
    make_target();
    // the working grid
    make_working_grid();
    // the candidates
    make_candidates();

    // put down the 7 things to put down

    // the controls for shapes
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

    // the control for colors
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


    // the L0 robot ===========================
    var box = document.createElement("div"); 
    box.className = "interact";
    box.id = "L0";
    box.style.top = "" + (OFFSETTOP + WW * 1.5) + "vmin";
    box.style.left = "" + (OFFSET3) + "vmin";
    $(box).css("background-image", 'url(assets/robot_0.png)');
    $("#control").append(box);

    // the L1 robot ========================== 
    var box = document.createElement("div"); 
    box.className = "interact";
    box.id = "L1";
    box.style.top = "" + (OFFSETTOP + WW * 3.5) + "vmin";
    box.style.left = "" + (OFFSET3) + "vmin";
    $(box).css("background-image", 'url(assets/robot.png)');
    $("#control").append(box);

    // do the first render
    new_problem();
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

function run_l0() {
    let l0_candidates = Array.from(L0(examples));
    let sorted_cands = l0_candidates.sort(function(a,b){
        return random_shape_order[a] - random_shape_order[b];
    });
    render_l_results(sorted_cands, 0);
}

function run_l1() {
    // let l1_candidates = L1(examples);
    setTimeout(() => {
        var l1_candidates = L1(examples);
        render_l_results(l1_candidates, 1);
        $("#L1").css("background-image", 'url(assets/robot.png)');

    }, 100);
    // thinking robot
    $("#L1").css("background-image", 'url(assets/robot_thinking.png)');
}

$(document).ready(function(){
    make_layout(document.body);
    console.log("sup dawg");
})

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
var OFFSET2 =   GRID_TOPP + WW * 7;
var OFFSET3 =   GRID_TOPP + WW * 15;
var OFFSET4 =   GRID_TOPP + OFFSET3 + WW*3;
var OFFSET5 =   GRID_TOPP + OFFSET4 + WW*5;

let random_shape_order = {}
for (var shapid = 0; shapid < all_shapes.length; shapid++){
    random_shape_order[shapid] = Math.random();
}

// to report to the server
var examples = {};
var all_examples = [];
var all_robot_times = [];

var start_time = 0;

var user_id;
var trial_id;

var problem_id = -1;
var target_ids;
var robot_id;
var disambiguous_size = 0;

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
function new_problem(target_id, robot_id){
    // grab new target-id and clear examples
    const target = all_shapes[target_id];
    examples = {};
    all_examples = [];
    all_robot_times = [];

    start_time = new Date().getTime();

    // render progress bar
    $("#progress_bar").html(`pattern ${target_ids.findIndex(x => x == target_id) + 1} out of ${target_ids.length}`)
    // clear the example used
    $("#utterance_count").html(`symbols used ${ Object.keys(examples).length}`);

    // clear all boxes with empty
    for (var jjj=0; jjj<3; jjj++){
        clear_grid_canvas("#cand_box_"+jjj);
    }
    clear_grid_canvas("#box_");
    // re-render target image
    for (var i=0; i<L; i+=1) {
        for (var j=0; j<L; j+=1) {
            let box_name = "#target_box_"+i+j;
            $(box_name).css("background-image", 'url(assets/empty.png)');
        }
    }
    render_shape_list(target, "#target_box_");

    // take care of the two robots and their respective canvas regions
    // remove the next / l0 robot / l1 robot icons
    $("#NEXT").remove();
    $("#L0").remove();
    $("#L1").remove();
    // remove the candidate solution layout grids
    for (var cand=0; cand<2; cand++) {
        for (var i=0; i<L; i+=1) {
            for (var j=0; j<L; j+=1) {
                let coord_i = i;
                let coord_j = j;
                $("#cand_box_"+cand+i+j).remove();
            };
        };
    };
    // remove the candidate texts and high lights
    $("#candidate_text_0").remove();
    $("#candidate_text_1").remove();
    $("#candidate_highlight_0").remove();
    $("#candidate_highlight_1").remove();

    // re-render robots 
    // the L0 robot ===========================
    if (robot_id == 0){
        var box = document.createElement("div"); 
        box.className = "interact";
        box.id = "L0";
        box.style.top = "" + (OFFSETTOP + WW * 1.5) + "vmin";
        box.style.left = "" + (OFFSET3) + "vmin";
        $(box).css("background-image", 'url(assets/robot_0.png)');
        $("#control").append(box);
    }

    // the L1 robot ========================== 
        if (robot_id == 1){
        var box = document.createElement("div"); 
        box.className = "interact";
        box.id = "L1";
        box.style.top = "" + (OFFSETTOP + WW * 3.5) + "vmin";
        box.style.left = "" + (OFFSET3) + "vmin";
        $(box).css("background-image", 'url(assets/robot.png)');
        $("#control").append(box);
    }

    // re make the candidates
    make_candidates(robot_id);
    clear_candidate_border();
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


        problem_id += 1;
        if (target_ids.length == problem_id) {
            if (trial_id == 0) {
                const queryString = window.location.search;
                const queryStringNew = queryString.replace("trial_id=0","trial_id=1");
                window.location = `robot_brief.html${queryStringNew}`
            }
            if (trial_id == 1) {
                const queryString = window.location.search;
                window.location = `summary.html${queryString}`
            }
        }
        else {
            new_problem(target_ids[problem_id], robot_id);
        }

    });

    $("#control").append(box);
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
            $("#grid").append(box);

        };
    };

    var box = document.createElement("div"); 
    box.id = "target_text";
    //box.innerHTML = "communicate this";
    box.className = "box text";
    box.style.top = "" + OFFSETTEXTTOP + "vmin";
    box.style.left = "" + 10 + "vmin";
    $("#grid").append(box);

    // render_shape_list(target, "#target_box_");
}

// the candidates
function make_candidates(robot_id){
    let cand = robot_id;

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
    box.innerHTML = cand == 0 ? "WHITE robot's guess " : "BLUE robot's guess";
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

}

// render listener results
function render_l_results(l_candidates, cand_id){
    if (l_candidates.length < 1) {
        return;
    }
    let shape_id = l_candidates[0];
    let cand_shape = all_shapes[shape_id];
    clear_grid_canvas("#cand_box_"+cand_id);
    populate_empty_canvas("#cand_box_"+cand_id);
    render_shape_list(cand_shape, "#cand_box_"+cand_id);
    if (shape_id == target_ids[problem_id]){
        disambiguous_size = l_candidates.length;
        $("#candidate_highlight_"+cand_id).css("border-width", "5px");
        console.log("solved");

        // register to firebase
        let ref_loc = `${experiment_batch}/${user_id}/data/robot_${robot_id}_problem_${problem_id}`;
        console.log(ref_loc);
        // var ref = fbase.ref(ref_loc).push();
        var ref = fbase.ref(ref_loc);
        console.log(ref);
        let to_put = {
            'trial_id' : trial_id,
            'problem_id' : problem_id,
            'target_id' : target_ids[problem_id],
            'robot_id'  : robot_id,
            'start_time' : start_time,
            'total_time' : new Date().getTime() - start_time,
            'examples'  : examples,
            'all_examples' : all_examples,
            'all_robot_times' : all_robot_times,
            'examples_used' : Object.keys(examples).length,
            'disambiguous_size' : disambiguous_size,
        }
        ref.once("value", function(snapshot) {
            ref.set(to_put);
        });


        make_next_button();

    } else {
        $("#NEXT").remove();
    }
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
                const rel_time = new Date().getTime() - start_time;
                if (examples[[coord_i, coord_j]] == undefined){
                    // the empty tile should have a canonicalized 'coloridx' of 0
                    let color_idx_empty_safe = shape_idx == 2 ? 0 : color_idx;
                    examples[[coord_i, coord_j]] = [shape_idx, color_idx_empty_safe];
                    all_examples.push(`${[coord_i,coord_j]} ${[shape_idx, color_idx_empty_safe]} ${rel_time}`)
                    render_plant();
                } else {
                    delete examples[[coord_i, coord_j]];
                    all_examples.push(`${[coord_i,coord_j]} delete ${rel_time}`)
                    render_plant();
                }

                let legal_utter = said_to_dict(S0(target_ids[problem_id],[]));
                $("#warning_text").text("")
                Object.entries(examples).forEach(([key, value]) => {
                    if (String(legal_utter[key]) != String(value)){
                        $("#warning_text").text("inconsistent examples!")
                    }
                });
                $("#utterance_count").html(`symbols used ${ Object.keys(examples).length}`);
                clear_candidate_border();
                clear_grid_canvas("#cand_box_0");
                clear_grid_canvas("#cand_box_1");
                if (robot_id == 0) {
                    run_l0();
                }
                if (robot_id == 1){
                    run_l1();
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

// make the progress bar and utterance used text
function make_progress() {
    var box = document.createElement("div"); 
    box.id = "progress_bar";
    box.innerHTML = "pattern 1/1";
    box.className = "box text";
    box.style.top = "" + (OFFSETTOP + WW * 4) + "vmin";
    box.style.left = "" + 10 + "vmin";
    $("#grid").append(box);    
}

function make_utterance_count() {
    var box = document.createElement("div"); 
    box.id = "utterance_count";
    box.innerHTML = "symbols used 0";
    box.className = "box text";
    box.style.top = "" + (OFFSETTOP + WW * 5) + "vmin";
    box.style.left = "" + 10 + "vmin";
    $("#grid").append(box);    
}
    
/* Creating the grid */
function make_layout() {
    // progress bar
    make_progress();
    // utterance count
    make_utterance_count();
    // the target
    make_target();
    // the working grid
    make_working_grid();
    // the candidate result text only
    var box = document.createElement("div"); 
    box.id = "result_text";
    // box.innerHTML = "results";
    box.className = "box text";
    box.style.top = "" + OFFSETTEXTTOP + "vmin";
    box.style.left = "" + OFFSET4 + "vmin";
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

// function run_l0() {
//     let l0_candidates = Array.from(L0(examples));
//     let sorted_cands = l0_candidates.sort(function(a,b){
//         return random_shape_order[a] - random_shape_order[b];
//     });
//     render_l_results(sorted_cands, 0);
// }
function run_l0() {
    // let l1_candidates = L1(examples);
    setTimeout(() => {

        // make timing consistent
        let robot_start_time = new Date().getTime();
        let l0_candidates = Array.from(L0(examples));
        all_robot_times.push(new Date().getTime() - robot_start_time);

        // var l1_candidates = L1(examples);
        let sorted_cands = l0_candidates.sort(function(a,b){
            return random_shape_order[a] - random_shape_order[b];
        });
        render_l_results(sorted_cands, 0);   
        $("#L0").css("background-image", 'url(assets/robot_0.png)');

    }, 500);
    // thinking robot
    $("#L0").css("background-image", 'url(assets/robot_0_thinking.png)');
}

function run_l1() {
    // let l1_candidates = L1(examples);
    setTimeout(() => {
        // make timing consistent
        let robot_start_time = new Date().getTime();
        var l1_candidates = L1(examples);
        all_robot_times.push(new Date().getTime() - robot_start_time);
        
        render_l_results(l1_candidates, 1);
        $("#L1").css("background-image", 'url(assets/robot.png)');

    }, 500);
    //thinking robot
    $("#L1").css("background-image", 'url(assets/robot_thinking.png)');
}

$(document).ready(function(){
    // grab the url params
    // set global variables *GASP*
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    user_id =   parseInt(urlParams.get('user_id'));
    trial_id =   parseInt(urlParams.get('trial_id'));
    robot_id =  urlParams.get('robot_order').split(',').map(x => parseInt(x))[trial_id];
    if (trial_id == 0) {
        target_ids = urlParams.get('exp0_order').split(',').map(x => parseInt(x));
    }
    if (trial_id == 1) {
        target_ids = urlParams.get('exp1_order').split(',').map(x => parseInt(x));
    }
    console.log(`user id ${user_id}, robot id ${robot_id}, target ids ${target_ids}`);

    // make the basic layouts that's invariant under problems
    make_layout();
    // make the new problem and problem-specific layout changes
    problem_id += 1;
    new_problem(target_ids[problem_id], robot_id);
    console.log("sup dawg");
})

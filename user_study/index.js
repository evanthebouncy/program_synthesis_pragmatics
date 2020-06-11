// sample the right parameters for the whole duration of the study
var practice_problems = [];
// var practice_problems = [64, 15838, 4305];
var sample_problems = [17648,13565,7246,10950,14000,8232,2290,5663,1710,10934];
var user_id = Math.random().toString().slice(2,8);
var robot_order = Math.random() > 0.5 ? [0,1] : [1,0];
var first_experiment_order =  practice_problems.concat(sample_problems.slice().sort(x => 0.5-Math.random()));
var second_experiment_order = practice_problems.concat(sample_problems.slice().sort(x => 0.5-Math.random()));


var trial_string = `robot_brief.html?trial_id=0&user_id=${user_id}&robot_order=${robot_order}&exp0_order=${first_experiment_order}&exp1_order=${second_experiment_order}`;
var practice_string = `practice.html?trial_id=0&user_id=${user_id}&robot_order=${robot_order}&exp0_order=${first_experiment_order}&exp1_order=${second_experiment_order}`;

var quiz_answers = [];


$(document).ready(function(){
    $("#start").attr('href', trial_string);
    $("#agree").click(function(){
    	$("#page1").css("display", "none");
    	$("#task_description").css("display", "unset");
    });
    $("#go_quiz").click(function(){
        $("#task_description").css("display", "none");
        $("#quiz_page").css("display", "unset");
    });
    $("#check_answer").click(function () {
        let task_ans = $("input[name='exptask']:checked").val();
    	let howmany_ans = $("input[name='howmany']:checked").val();
    	let robcomm_ans = $("input[name='robcomm']:checked").val();
        console.log(task_ans, howmany_ans, robcomm_ans)
        quiz_answers.push(`${task_ans} ${howmany_ans} ${robcomm_ans}`);
    	if (task_ans == "fewest" && howmany_ans == "fewer" && robcomm_ans == "guess") {

            // put stuff into database
            let ref_loc = `${experiment_batch}/${parseInt(user_id)}/quiz`;
            console.log(ref_loc);

            var ref = fbase.ref(ref_loc);
            let to_put = {
                'quiz_answers' : quiz_answers,
            }
            ref.once("value", function(snapshot) {
                ref.set(to_put);
                // tuck the next page down in here to ensure the results are submitted online
                window.location = `${practice_string}`
            });
    	} else {
    		alert("some quiz answer(s) are wrong, please correct them first before continuing")
    	}
    });
});

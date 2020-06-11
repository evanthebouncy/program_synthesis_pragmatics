function get_white_blue(user_stat) {
    let stats = user_stat;
    var robot_white_tot = 0;
    var robot_blue_tot = 0;        
    for (var key in stats) {
        if (stats[key]['robot_id'] == 0){
            robot_white_tot += stats[key]['examples_used'];
        } 
        if (stats[key]['robot_id'] == 1) {
            robot_blue_tot += stats[key]['examples_used'];
        }
    }
    return [robot_white_tot, robot_blue_tot];
}

$(document).ready(function(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let user_id = parseInt(urlParams.get('user_id'));
    
    let ref_loc = `${experiment_batch}/${user_id}/data`;
    console.log(ref_loc);

    var ref = fbase.ref(ref_loc);
    var user_white = 0;
    var user_blue = 0;
    ref.on("value", function(snapshot) {
        let stats = snapshot.val();
        let white_blue = get_white_blue(stats);
        console.log("white blue", white_blue);
        user_white = white_blue[0] / 10;
        user_blue = white_blue[1] / 10;

        console.log(user_white, user_blue);
        }, function (error) {
        console.log("Error: " + error.code);
    });

    // robot total exmaples overall
    var overall_white = 0;
    var overall_blue = 0;
    let ref_tot = fbase.ref(`${experiment_batch}`);
    ref_tot.on("value", function(snapshot) {
        let stats = snapshot.val();
        var n_usrr = 0;
        var white_tot_overall = 0;
        var blue_tot_overall = 0;
        for (var key in stats) {
            n_usrr += 1;
            let user_stats = stats[key]['data'];
            let white_blue = get_white_blue(user_stats);
            white_tot_overall += white_blue[0];
            blue_tot_overall += white_blue[1];
        }
        overall_white = white_tot_overall / 10 / n_usrr;
        overall_blue = blue_tot_overall / 10 / n_usrr;
        console.log(overall_white, overall_blue);
    });

    $("#age_range").change(function () {
        $( "#qage" ).html( $('#age_range')[0].valueAsNumber );
    });

    $("#submit_and_check").click(function () {
        console.log("logging survey feedbacks");

        let age = $('#age_range')[0].valueAsNumber;
        let gender = $("input[name='qgender']:checked").val();
        let easier_robot = $("input[name='qrobot']:checked").val();
        let white_strat = $("#white_strat").val();
        let blue_strat = $("#blue_strat").val();

        if (gender == undefined || easier_robot == undefined || white_strat == "" || blue_strat == "") {
            alert("please fill all survey questions");
            return;
        }
        console.log(age);
        console.log(age, gender, easier_robot, white_strat, blue_strat);

        let ref_loc = `${experiment_batch}/${user_id}/survey`;
        console.log(ref_loc);

        var ref = fbase.ref(ref_loc);
        let to_put = {
            'age' : age,
            'gender' : gender,
            'easier_robot'  : easier_robot,
            'white_strat'  : white_strat,
            'blue_strat' : blue_strat,
        }
        ref.once("value", function(snapshot) {
            ref.set(to_put);
        });

        $("#result_white").html(`On the WHITE robot, you used ${user_white.toString().slice(0,5)} examples on average, against an overall average of ${overall_white.toString().slice(0,5)}`);
        $("#result_blue").html(`On the BLUE robot, you used ${user_blue.toString().slice(0,5)} examples on average, against an overall average of ${overall_blue.toString().slice(0,5)}`);
        $("#result_code").html(`Your completion code is ${user_id}`);
        // toggle displays
        $("#exit_survey").css("display", "none");
        $("#result").css("display", "unset");


    });

});
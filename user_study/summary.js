$(document).ready(function(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let user_id = parseInt(urlParams.get('user_id'));

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

        $("#result_code").html(`Your completion code is ${user_id}`);
        // toggle displays
        $("#exit_survey").css("display", "none");
        $("#result").css("display", "unset");


    });

});
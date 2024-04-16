# supplimentary materials

## to start
the best way to start is to actually play the robot game. the task is to get the robots to guess the pattern (target) on the left by building a subset of the pattern in the middle (working area). you can click on the target pattern to sample a new pattern. 

simply visit : https://evanthebouncy.github.io/program_synthesis_pragmatics/interactive_mode/

if you want to run a local version, open ``/interactive_mode/index.html`` in your favorite browser. 

you can try some fun variants of the game where you get one of the robot to guess the pattern without revealing it to the other robot

## contents

* ``README.md`` : this file
* ``version_space/`` : the python code describing the DSL and generation of the version space caches of the meaning matrix

* ``interactive_mode/`` : an interactive version where you can see the behaviours of both robots simultaniously
* ``user_study/`` : code for study conducted on MTurk, complete with instructions, quiz, practices, trials, and survey
* ``user_study_results/`` : the raw json results collected from the MTurk users used to make the plots

## ``version_space/``

* ``grid.py`` : the DSL, run it to sample a program and visualisation under ``version_space/drawings/`` directory
* ``prag_cache.py`` : generate the version space cache for the meaning matrix, run it to generate a pickle ``L0VS.p``. the generation is kind of jank, just leave it running for a few hours.
* ``prag1.py`` : the interactive mode in python, a prelim version before we build the javascript version in ``interactive_mode``. requires ``L0VS.p`` to be precomputed
* ``ouput_json.py`` : translate ``L0VS.p`` to javascript equivalent jsons to be used in the javascript interactive systems. outputs ``all_shapes.js`` and ``l0vs.js``.


## ``interactive_mode/``
there are many files here, but the important ones are: 

* ``all_shapes.js`` : all the program executions as patterns (see ``version_space``)
* ``l0vs.js`` : the version space cache (see ``version_space``)
* ``L0.js`` : the literal listener code, requires ``all_shapes.js`` and ``l0vs.js``.
* ``L1.js`` : the pragmatic code for both the speaker S1 and L1, requires ``L0.js``.
* ``experiments.js`` and ``human_data.js`` : used to generate data for the plots of speaker-listener pairs (2nd figure in experiment section)
* ``index.*`` and ``assets/`` : user interface code

## ``user_study/``
same as ``interactive_mode/`` except with a user study flavor:

* ``index.js`` set up the random seeds for each user, including userID and the order of the stimuli, also contain the list of 10 representative patterns

## ``user_study_results/``
contains two json files of user study data, including time-stamped sequence of moves for each problem and the end-of-study survey

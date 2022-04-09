import { get_random_int } from "./toolbox.mjs";

//private
// variables
const constants = {
   CHOICE_LIST: ["Paper", "Rock", "Scissors"],
   N_CHOICES: 3,
   PAPER: 0,
   ROCK: 1,
   SCISSORS: 2,
   ROUND_RESULT_LIST: ["DRAW", "LOSS", "WIN"],
   MAX_MATCH_SCORE: 5,
};

const round_state = {
   player_choice: null,
   comp_choice: null,
   round_result: null,
   is_new_round: true,
};

const match_state = {
   player_score: 0,
   comp_score: 0,
};

// functions

function show_player_choice() {
   rps_game.outputs.player_choice.textContent = constants.CHOICE_LIST[round_state.player_choice];
}

function show_comp_choosing(resolve) {
   //show comp iterating over the available choices in a certain time interval
   let current_comp_choice = 0;
   const comp_is_choosing = setInterval(() => {
      show_comp_choice(current_comp_choice);
      current_comp_choice++;
      if (current_comp_choice >= constants.N_CHOICES) {
         resolve("comp finished choosing");
         clearInterval(comp_is_choosing);
      }
   }, rps_game.settings.comp_choosing_time / constants.N_CHOICES);
}

function get_comp_choice() {
   round_state.comp_choice = get_random_int(0, constants.N_CHOICES - 1);
}

function show_comp_choice(choice, resolve = null) {
   rps_game.outputs.comp_choice.textContent = constants.CHOICE_LIST[choice];
   if (resolve !== null) {
      resolve("success");
   }
}

function get_round_result() {
   //choice order is so that the value at index i wins against the one at index i+1 (reset to 0 if over limit)
   //that way this algorithm gets the following values in this case: Win = 2, Loss = 1 and Draw = 0 (see round_result_list)
   round_state.round_result =
      (round_state.player_choice + 2 * round_state.comp_choice) % constants.N_CHOICES;
}

function show_round_result(resolve = null) {
   rps_game.outputs.game_result.textContent = constants.ROUND_RESULT_LIST[round_state.round_result];
   if (resolve !== null) {
      resolve("success");
   }
}

function update_score() {
   const player_round_score = Math.floor(round_state.round_result / (constants.N_CHOICES - 1)); //get 1 Point if won else 0
   match_state.player_score += player_round_score;
   match_state.comp_score += (round_state.round_result + player_round_score) % constants.N_CHOICES; //opposite for comp
}

function show_score(resolve = null) {
   rps_game.outputs.player_score.textContent = match_state.player_score;
   rps_game.outputs.comp_score.textContent = match_state.comp_score;
   if (resolve !== null) {
      resolve("success");
   }
}

function reset_round() {
   //round specific variables
   round_state.comp_choice = null;
   round_state.round_result = null;
   round_state.is_new_round = false;

   //round specific outputs
   rps_game.outputs.player_choice.textContent = "-";
   rps_game.outputs.comp_choice.textContent = "-";
   rps_game.outputs.game_result.textContent = "-";
}

async function play_one_round() {
   reset_round();
   show_player_choice();

   // show comp choosing
   await new Promise((resolve) => {
      show_comp_choosing(resolve);
   });

   get_comp_choice();

   // show comp choice
   await new Promise((resolve) => {
      setTimeout(
         show_comp_choice,
         rps_game.settings.show_comp_choice_time,
         round_state.comp_choice,
         resolve
      );
   });

   get_round_result();

   //show round result
   await new Promise((resolve) => {
      setTimeout(show_round_result, rps_game.settings.show_round_result_time, resolve);
   });

   //update and show actual score
   update_score();

   await new Promise((resolve) => {
      setTimeout(show_score, rps_game.settings.show_score_time, resolve);
   });

   if (match_state.player_score >= constants.MAX_MATCH_SCORE) {
      setTimeout(() => {
         rps_game.outputs.game_result.textContent = "YOU WON!";
      }, rps_game.settings.show_match_result_time);
   } else if (match_state.comp_score >= constants.MAX_MATCH_SCORE) {
      setTimeout(() => {
         rps_game.outputs.game_result.textContent = "YOU LOST!";
      }, rps_game.settings.show_match_result_time);
   } else {
      //mark end of this round
      round_state.is_new_round = true;
   }
}

export const rps_game = {
   init(inputs, outputs, new_settings = null) {
      this.inputs = inputs; //rock, paper, scissors
      this.outputs = outputs; //  player_choice, player_score, comp_choice, comp_score, game_result
      this.settings = {
         //default settings
         comp_choosing_time: 1000,
         show_comp_choice_time: 500,
         show_round_result_time: 500,
         show_match_result_time: 500,
         show_score_time: 500,
      };

      if (new_settings !== null) {
         for (let [key, value] of Object.entries(new_settings)) {
            this.settings[key] = value;
         }
      }

      this.bind_inputs();
   },

   bind_inputs() {
      for (let i = 0; i < constants.N_CHOICES; i++) {
         this.inputs[constants.CHOICE_LIST[i].toLowerCase()].addEventListener("click", (event) => {
            if (round_state.is_new_round) {
               round_state.player_choice = i;
               play_one_round();
               event.stopPropagation();
            }
         });
      }
   },
};

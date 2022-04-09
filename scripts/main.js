import { $ } from "./toolbox.mjs";
import { rps_game } from "./rps_game.mjs";

const rps_inputs = {
   rock: $("choice-rock"),
   paper: $("choice-paper"),
   scissors: $("choice-scissors"),
   new_game: $("new-game"),
};
const rps_outputs = {
   player_choice: $("player-choice"),
   player_score: $("player-score"),
   comp_choice: $("comp-choice"),
   comp_score: $("comp-score"),
   game_result: $("game-result"),
};

var game = rps_game;
game.init(rps_inputs, rps_outputs);

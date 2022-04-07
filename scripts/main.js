import { $ } from "./toolbox.mjs";
import { RPS_Game } from "./rps_game.mjs";

const rps_inputs = {
   rock: $("choice-rock"),
   paper: $("choice-paper"),
   scissors: $("choice-scissors"),
};
const rps_outputs = {
   player_choice: $("player-choice"),
   player_score: $("player-score"),
   comp_choice: $("comp-choice"),
   comp_score: $("comp-score"),
   game_result: $("game-result"),
};

var game = new RPS_Game(rps_inputs, rps_outputs);

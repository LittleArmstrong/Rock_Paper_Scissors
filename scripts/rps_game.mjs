import { $, get_random_int } from "./toolbox.mjs";

export class RPS_Game {
   constructor() {
      this._constants = {
         CHOICE_LIST: ["Paper", "Rock", "Scissors"],
         get N_CHOICES() {
            return this.CHOICE_LIST.length;
         },
         PAPER: 0,
         ROCK: 1,
         SCISSORS: 2,
         ROUND_RESULT_LIST: ["LOSS", "DRAW", "WIN"],
         MAX_SCORE_ROUND: 2,
      };

      this.input_tags = {
         btn_rock: $("choice-rock"),
         btn_paper: $("choice-paper"),
         btn_scissors: $("choice-scissors"),
      };

      this.output_tags = {
         txt_player_choice: $("player-choice"),
         txt_player_score: $("player-score"),
         txt_comp_choice: $("comp-choice"),
         txt_comp_score: $("comp-score"),
         txt_game_result: $("game-result"),
      };

      this.settings = {
         comp_choosing_time: 1000,
         show_comp_choice_time: 500,
         show_round_result_time: 500,
         show_score_time: 500,
      };

      this._round_state = {
         player_choice: null,
         comp_choice: null,
         round_result: null,
         is_new_round: true,
      };

      this._match_state = {
         player_score: 0,
         comp_score: 0,
      };

      this._bind_events();
   }

   _bind_events() {
      this.input_tags.btn_paper.addEventListener("click", () => {
         if (this._round_state.is_new_round) {
            this._round_state.player_choice = this._constants.PAPER;
            this._play_one_round(this);
         }
      });

      this.input_tags.btn_rock.addEventListener("click", () => {
         if (this._round_state.is_new_round) {
            this._round_state.player_choice = this._constants.ROCK;
            this._play_one_round(this);
         }
      });

      this.input_tags.btn_scissors.addEventListener("click", () => {
         if (this._round_state.is_new_round) {
            this._round_state.player_choice = this._constants.SCISSORS;
            this._play_one_round(this);
         }
      });
   }

   async _play_one_round(self) {
      self._reset_round(self);
      self._show_player_choice(self);
      self._get_round_result(self); //randomly decide the result of the match
      self._get_comp_choice(self); //get comp choice based on result and player choice

      // show comp choosing
      await new Promise((resolve) => {
         self._show_comp_choosing(self, resolve);
      });

      // show comp choice
      await new Promise((resolve) => {
         setTimeout(
            self._show_comp_choice,
            self.settings.show_comp_choice_time,
            self,
            self._round_state.comp_choice,
            resolve
         );
      });

      //show round result
      await new Promise((resolve) => {
         setTimeout(self._show_round_result, self.settings.show_round_result_time, self, resolve);
      });

      //update and show actual score
      self._update_score(self);
      await new Promise((resolve) => {
         setTimeout(self._show_score, self.settings.show_score_time, self, resolve);
      });

      //mark end of this round
      self._round_state.is_new_round = true;
   }

   _show_player_choice(self) {
      self.output_tags.txt_player_choice.textContent =
         self._constants.CHOICE_LIST[this._round_state.player_choice];
   }

   _show_comp_choosing(self, resolve) {
      //show comp iterating over the available choices in a certain time interval
      let current_comp_choice = 0;
      const comp_is_choosing = setInterval(() => {
         self._show_comp_choice(self, current_comp_choice);
         current_comp_choice++;
         if (current_comp_choice >= self._constants.N_CHOICES) {
            resolve("comp finished choosing");
            clearInterval(comp_is_choosing);
         }
      }, self.settings.comp_choosing_time / self._constants.N_CHOICES);
   }

   _get_comp_choice(self) {
      self._round_state.comp_choice =
         (self._constants.N_CHOICES + //so that result is not negative
            self._round_state.round_result +
            self._round_state.player_choice -
            1) %
         self._constants.N_CHOICES;
   }

   _show_comp_choice(self, choice, resolve = null) {
      self.output_tags.txt_comp_choice.textContent = self._constants.CHOICE_LIST[choice];
      if (resolve !== null) {
         resolve("success");
      }
   }

   _get_round_result(self) {
      self._round_state.round_result = get_random_int(0, self._constants.N_CHOICES - 1);
   }

   _show_round_result(self, resolve = null) {
      self.output_tags.txt_game_result.textContent =
         self._constants.ROUND_RESULT_LIST[self._round_state.round_result];
      if (resolve !== null) {
         resolve("success");
      }
   }

   _update_score(self) {
      self._match_state.player_score += self._round_state.round_result;
      self._match_state.comp_score +=
         self._constants.MAX_SCORE_ROUND - self._round_state.round_result;
   }

   _show_score(self, resolve = null) {
      self.output_tags.txt_player_score.textContent = self._match_state.player_score;
      self.output_tags.txt_comp_score.textContent = self._match_state.comp_score;
      if (resolve !== null) {
         resolve("success");
      }
   }

   _reset_round(self) {
      //round specific variables
      self._round_state.comp_choice = null;
      self._round_state.round_result = null;
      self._round_state.is_new_round = false;

      //round specific outputs
      self.output_tags.txt_player_choice.textContent = "-";
      self.output_tags.txt_comp_choice.textContent = "-";
      self.output_tags.txt_game_result.textContent = "-";
   }
}

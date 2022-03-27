import { $, get_random_int } from "./toolbox.mjs";

class RPS_Game {
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
         show_score_time: 250,
         update_time: 200,
      };

      this._round_state = {
         player_choice: null,
         player_has_chosen: null,
         comp_is_choosing: null,
         current_comp_choice: null,
         comp_choice: null,
         comp_has_chosen: null,
         round_result: null,
         result_is_shown: false,
         round_has_ended: false,
         score_is_shown: false,
         is_new_round: true,
         updating_round: null,
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
            this._round_state.updating_round = setInterval(
               this._update_round,
               this.settings.update_time,
               this
            );
         }
      });

      this.input_tags.btn_rock.addEventListener("click", () => {
         if (this._round_state.is_new_round) {
            this._round_state.player_choice = this._constants.ROCK;
            this._round_state.updating_round = setInterval(
               this._update_round,
               this.settings.update_time,
               this
            );
         }
      });

      this.input_tags.btn_scissors.addEventListener("click", () => {
         if (this._round_state.is_new_round) {
            this._round_state.player_choice = this._constants.SCISSORS;
            this._round_state.updating_round = setInterval(
               this._update_round,
               this.settings.update_time,
               this
            );
         }
      });
   }

   _update_round(self) {
      if (self._round_state.is_new_round) {
         self._reset_round(self);
         self._round_state.ist_new_round = false;
      } else if (!self._round_state.player_has_chosen) {
         self._show_player_choice(self);
         self._round_state.player_has_chosen = true;
      } else if (self._round_state.comp_is_choosing === null) {
         self._round_state.current_comp_choice = 0;
         self._round_state.comp_is_choosing = setInterval(
            self._show_comp_choosing,
            self.settings.comp_choosing_time / self._constants.N_CHOICES,
            self
         );
      } else if (
         self._round_state.comp_has_chosen === null &&
         self._round_state.comp_is_choosing === false
      ) {
         self._set_round_result(self);
         self._get_comp_choice(self);
         self._round_state.comp_has_chosen = false;
         setTimeout(
            self._show_comp_choice,
            self.settings.show_comp_choice_time,
            self,
            self._round_state.comp_choice,
            true
         );
      } else if (self._round_state.comp_has_chosen && !self._round_state.round_has_ended) {
         self._update_score(self);
         setTimeout(self._show_round_result, self.settings.show_round_result_time, self);
         self._round_state.round_has_ended = true;
      } else if (self._round_state.result_is_shown && !self._round_state.score_is_shown) {
         setTimeout(self._show_score, self.settings.show_round_result_time, self);
      } else if (self._round_state.score_is_shown) {
         self._round_state.is_new_round = true;
         clearInterval(self._round_state.updating_round);
         self._round_state.updating_round = null;
      }
   }

   _show_player_choice(self) {
      self.output_tags.txt_player_choice.textContent =
         self._constants.CHOICE_LIST[this._round_state.player_choice];
   }

   _show_comp_choosing(self) {
      self._show_comp_choice(self, self._round_state.current_comp_choice);
      self._round_state.current_comp_choice++;
      if (self._round_state.current_comp_choice >= self._constants.N_CHOICES) {
         clearInterval(self._round_state.comp_is_choosing);
         self._round_state.comp_is_choosing = false;
      }
   }

   _get_comp_choice(self) {
      self._round_state.comp_choice =
         (self._constants.N_CHOICES +
            self._round_state.round_result +
            self._round_state.player_choice -
            1) %
         self._constants.N_CHOICES;
   }

   _show_comp_choice(self, choice, is_true_choice = false) {
      self.output_tags.txt_comp_choice.textContent = self._constants.CHOICE_LIST[choice];
      if (is_true_choice) {
         self._round_state.comp_has_chosen = true;
      }
   }

   _set_round_result(self) {
      self._round_state.round_result = get_random_int(0, self._constants.N_CHOICES - 1);
   }

   _show_round_result(self) {
      self.output_tags.txt_game_result.textContent =
         self._constants.ROUND_RESULT_LIST[self._round_state.round_result];
      self._round_state.result_is_shown = true;
   }

   _update_score(self) {
      self._match_state.player_score += self._round_state.round_result;
      self._match_state.comp_score +=
         self._constants.MAX_SCORE_ROUND - self._round_state.round_result;
   }

   _show_score(self) {
      self.output_tags.txt_player_score.textContent = self._match_state.player_score;
      self.output_tags.txt_comp_score.textContent = self._match_state.comp_score;
      self._round_state.score_is_shown = true;
   }

   _reset_round(self) {
      self._reset_round_var(self);
      self._reset_round_output_tags(self);
   }

   _reset_round_var(self) {
      self._round_state.player_has_chosen = null;
      self._round_state.comp_is_choosing = null;
      self._round_state.current_comp_choice = null;
      self._round_state.comp_choice = null;
      self._round_state.comp_has_chosen = null;
      self._round_state.round_result = null;
      self._round_state.result_is_shown = false;
      self._round_state.score_is_shown = false;
      self._round_state.round_has_ended = false;
      self._round_state.is_new_round = false;
   }

   _reset_round_output_tags(self) {
      self.output_tags.txt_player_choice.textContent = "-";
      self.output_tags.txt_comp_choice.textContent = "-";
      self.output_tags.txt_game_result.textContent = "-";
   }
}

var game = new RPS_Game();

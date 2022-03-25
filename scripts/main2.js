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
         ROUND_END_DICT: ["LOSS", "DRAW", "WIN"],
         MAX_SCORE_ROUND: 2,
      };

      this.input_tags = {
         btn_rock: $("choice-rock"),
         btn_paper: $("choice-paper"),
         btn_scissors: $("choice-scissors"),
      };

      this.output_tags = {
         txt_player_choice: $("player-choice"),
         txt_comp_choice: $("comp-choice"),
      };

      this.settings = {
         choosing_time: 1000,
         showing_comp_choice_time: 500,
         update_time: 200,
      };

      this._state = {
         player_choice: null,
         player_has_chosen: null,
         comp_is_choosing: null,
         current_comp_choice: null,
         comp_choice: null,
         comp_has_chosen: null,
         updating_game: null,
      };

      this._bind_events();
   }

   _bind_events() {
      this.input_tags.btn_paper.addEventListener("click", () => {
         if (!this._state.player_choice !== null) {
            this._state.player_choice = this._constants.PAPER;
            this._state.updating_game = setInterval(
               this._update_game,
               this.settings.update_time,
               this
            );
         }
      });

      this.input_tags.btn_rock.addEventListener("click", () => {
         if (!this._state.player_choice !== null) {
            this._state.player_choice = this._constants.ROCK;
            this._state.updating_game = setInterval(
               this._update_game,
               this.settings.update_time,
               this
            );
         }
      });

      this.input_tags.btn_scissors.addEventListener("click", () => {
         if (!this._state.player_choice !== null) {
            this._state.player_choice = this._constants.SCISSORS;
            this._state.updating_game = setInterval(
               this._update_game,
               this.settings.update_time,
               this
            );
         }
      });
   }

   _update_game(self) {
      if (!self._state.player_has_chosen) {
         self._show_player_choice(self);
         self._state.player_has_chosen = true;
      } else if (self._state.comp_is_choosing === null) {
         self._state.current_comp_choice = 0;
         self._state.comp_is_choosing = setInterval(
            self._show_comp_choosing,
            self.settings.choosing_time / self._constants.N_CHOICES,
            self
         );
      } else if (self._state.comp_has_chosen === null && self._state.comp_is_choosing === false) {
         self._state.comp_choice = get_random_int(0, self._constants.N_CHOICES);
         self._state.comp_has_chosen = false;
         setTimeout(
            self._show_comp_choice,
            self.settings.showing_comp_choice_time,
            self,
            self._state.comp_choice,
            true
         );
      }
   }

   _show_player_choice(self) {
      self.output_tags.txt_player_choice.textContent =
         self._constants.CHOICE_LIST[this._state.player_choice];
   }

   _show_comp_choosing(self) {
      self._show_comp_choice(self, self._state.current_comp_choice);
      self._state.current_comp_choice++;
      if (self._state.current_comp_choice >= self._constants.N_CHOICES) {
         clearInterval(self._state.comp_is_choosing);
         self._state.comp_is_choosing = false;
      }
   }

   _show_comp_choice(self, choice, is_true_choice = false) {
      self.output_tags.txt_comp_choice.textContent = self._constants.CHOICE_LIST[choice];
      if (is_true_choice) {
         self._state.comp_has_chosen = true;
      }
   }
}

var game = new RPS_Game();

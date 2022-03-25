import { $, get_random_int } from "./toolbox.mjs";

class RPS_Game {
  constructor() {
    this._constants = {
      CHOICE_LIST: ["Paper", "Rock", "Scissors"],
      CHOICE_AMOUNT: 3,
      CHOICE_PAPER: 0,
      CHOICE_ROCK: 1,
      CHOICE_SCISSORS: 2,
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
      roulette_time: 600,
      check_time: 200,
    };

    this._state = {
      player_choice: 0,
      player_finished: false,
      comp_roulette: null,
      roulette_started: false,
      current_roulette_choice: 0,
      comp_choice: 0,
      comp_finished: false,
      state_check: setInterval(
        this._check_game_state,
        this.settings.check_time,
        this
      ),
    };

    this._bind_events();
  }

  _bind_events() {
    this.input_tags.btn_paper.addEventListener("click", () => {
      if (!this._state.player_finished) {
        this._state.player_choice = this._constants.PAPER;
        this._show_player_choice();
      }
    });

    this.input_tags.btn_rock.addEventListener("click", () => {
      if (!this._state.player_finished) {
        this._state.player_choice = this._constants.ROCK;
        this._show_player_choice();
      }
    });

    this.input_tags.btn_scissors.addEventListener("click", () => {
      if (!this._state.player_finished) {
        this._state.player_choice = this.SCISSORS;
        this._show_player_choice();
      }
    });
  }

  _check_game_state(self) {
    if (self._state.player_finished && !self._state.roulette_started) {
      self._state.current_roulette_choice = 0;
      self._state.comp_choice = get_random_int(
        0,
        self._constants.CHOICE_AMOUNT
      );
      self._state.comp_roulette = setInterval(
        self._start_choice_roulette,
        self.settings.roulette_time,
        self
      );
      self._state.roulette_started = true;
    }
    // else if (this._state.comp_finished) {

    // }
  }

  _show_player_choice() {
    this.output_tags.txt_player_choice.textContent =
      this._constants.CHOICE_LIST[this._state.player_choice];
    this._state.player_finished = true;
  }

  _start_choice_roulette(self) {
    self._show_comp_choice();
    self._state.current_roulette_choice++;
    if (self._state.current_roulette_choice >= self._constants.CHOICE_AMOUNT) {
      clearInterval(self._state.comp_roulette);
      self._state.current_roulette_choice = self._state.comp_choice;
      self._state.comp_finished = true;
    }
  }

  _show_comp_choice() {
    this.output_tags.txt_comp_choice.textContent =
      this._constants.CHOICE_LIST[this._state.current_roulette_choice];
    this._state.comp_finished = true;
  }
}

var game = new RPS_Game();

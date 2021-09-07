function computerPlay() {
    return CHOICES[Math.floor(Math.random() * (CHOICES.length))]
}

function playRound(playerSelection, computerSelection) {
    playerSelection = playerSelection.toLowerCase();
    playerIndex = CHOICES.indexOf(playerSelection)
    computerIndex = CHOICES.indexOf(computerSelection)
    comparison_text = `${playerSelection} vs ${computerSelection}\n`

    if (playerIndex === computerIndex) {
        return comparison_text + 'Its a draw!'
    }
    else if (playerIndex === computerIndex - 1) {
        return comparison_text + 'You lose!'
    }
    else if (playerIndex === computerIndex + 1) {
        return comparison_text + 'You win!'
    }
    else if (playerIndex > computerIndex) {
        return comparison_text + 'You lose!'
    }
    else {
        return comparison_text + 'You win!'
    }
}

function game(nRounds) {
    for (let i = 0; i < nRounds; i++) {
        let playerSelection = prompt()
        let computerSelection = computerPlay()
        console.log(playRound(playerSelection, computerSelection))
    }
}
const CHOICES = ['rock', 'paper', 'scissors']
const NROUNDS = 5

game(NROUNDS)


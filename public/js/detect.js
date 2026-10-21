function detectApp({ correctAnswer, highlightIndexes }) {
  return {
    correctAnswer: correctAnswer,
    highlightIndexes: highlightIndexes || [],

    answered: false,
    userAnswer: null,
    wasCorrect: false,
    revealed: false,

    answer(choice) {
      this.userAnswer = choice;
      this.answered = true;
      this.wasCorrect = choice === this.correctAnswer; // sets wasCorrect to true if the users answer is the same as correctAnswer and false iif not
      // Reveal highlighted lines in the conversation regardless of
      // whether the user was right
      this.revealed = true;
    },
  };
}

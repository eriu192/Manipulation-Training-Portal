function exerciseApp({ lines, techniques }) {
  return {
    lines: lines,
    techniques: techniques,

    selectedIndex: null,
    guess: null,

    answeredIndex: null,
    lastResult: null, // correct or incorrect
    feedback: "",
    correctExplanation: "",

    // track which manipulative lines have been correctly identified so far
    correctlyFound: new Set(),
	
	
	lineResults: {},   // line index -> 'correct' | 'incorrect' (first check only)
	lineFeedback: {},  // line index -> { feedback, explanation }

	get isLocked() { // Check if line already answered
	  return this.selectedIndex !== null && !!this.lineResults[this.selectedIndex];
	},
	
    get manipulativeCount() {
      return this.lines.filter((l) => l.speaker === "AI").length;
    },

    get answeredCount() {
      return this.correctlyFound.size;
    },
	
	get clearedCount() {
	  return this.correctlyCleared.size;
	},

    selectLine(index) {
	  if (this.lines[index].speaker !== "AI") return; // Filter out lines from user
      this.selectedIndex = index;
      this.guess = null;
	  const saved = this.lineFeedback[index];
      this.feedback = saved ? saved.feedback : "";
      this.correctExplanation = saved ? saved.explanation : "";
	  this.lastResult = saved ? this.lineResults[index] : null;
    },
// Evaluates user decision
    evaluate() {
      const line = this.lines[this.selectedIndex];
      const isManipulative = line.manipulative;
      const userSaysManipulative = this.guess !== "__none__";

      this.answeredIndex = this.selectedIndex;

      // If not manipulative, this section checks correctness and sets feedback either by sending the technique explanation if correct or saying why the user is wrong then the technique explanation
      if (!isManipulative) {
        if (this.guess === "__none__") {
          this.lastResult = "correct";
          this.feedback = "Correct — this line isn't manipulative.";
		  this.correctlyFound.add(this.selectedIndex);
        } else {
          this.lastResult = "incorrect";
          this.feedback = "Not quite — this line doesn't actually use a manipulative tactic.";
          this.correctExplanation = "Try re-reading it for tone and intent before assuming a technique is present.";
        }
        return;
      }

      // If manipulative, this section checks correctness and sets feedback either by sending the technique explanation if correct or saying why the user is wrong then the technique explanation
      if (!userSaysManipulative) {	
        this.lastResult = "incorrect";
        this.feedback = "Not quite — this line does use a manipulative tactic.";
        this.correctExplanation = this.describeTechnique(line.technique);
        return;
      }

      if (this.guess === line.technique) {
        this.lastResult = "correct";
        this.feedback = "Correct! " + this.describeTechnique(line.technique);
        this.correctlyFound.add(this.selectedIndex);
      } else {
        this.lastResult = "incorrect";
        this.feedback = "This line is manipulative, but that's not quite the right technique.";
        this.correctExplanation = this.describeTechnique(line.technique);
      }
    },
	
	checkAnswer() {
	if (this.isLocked) return;            // check if already answered if so ignore preventing users from improving their score by redoing questions
	this.evaluate();
	this.lineResults[this.selectedIndex] = this.lastResult;
	this.lineFeedback[this.selectedIndex] = {
      feedback: this.feedback,
      explanation: this.correctExplanation,
	};
  },
  
    get checkedCount() {
	  return Object.keys(this.lineResults).length;
    },

    describeTechnique(techId) {
      const tech = this.techniques.find((t) => t.id === techId);
      return tech ? tech.label + " — " + tech.description : "";
    },
  };
}

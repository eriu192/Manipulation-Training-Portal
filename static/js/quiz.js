function quizApp({ pool, count, target }) {
  return {
    pool: Object.values(pool || {}),
    count: count,
    items: [],
    index: 0,
    results: {},
	target: target,
	started: false,
    finished: false,

    init() { this.start(); },

    start() {
      // Shuffle the questions then pick first n
      const a = [...this.pool];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]; //swap with random element
      }
      this.items = a.slice(0, this.count).map((it, i) => ({ ...it, _id: i + "-" + Math.random() }));
      this.index = 0;
      this.results = {};
	  this.started = false;   // new: returns to the intro
      this.finished = false;
    },
	
	begin() { this.started = true; },
	
	get targetLines() {
      return Math.ceil(this.possible * this.target / 100);
    },
	
    get current() { return this.items[this.index]; },

    record(i, found, total, checked) { this.results[i] = { found, total, checked }; },

    get score() {
      return Object.values(this.results).reduce((n, r) => n + r.found, 0);
    },

    get possible() {
	return this.items.reduce(
		(n, it) => n + it.lines.filter((l) => l.speaker === "AI").length, 0);
	},
	
	get allChecked() {
	  const r = this.results[this.index];
	  return !!r && r.checked >= r.total;
	},

    next() {
	  console.log("next clicked", this.index, this.allChecked, this.items.length);
	  if(!this.allChecked) return;
      if (this.index + 1 >= this.items.length) this.finished = true;
      else this.index++;
    },
  };
}
class Queen {
  x: number;
  y: number = 0;
  table: Table;
  previous?: Queen;
  next?: Queen;

  static letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(x: number, table: Table) {
    this.x = x;
    this.table = table;
  }

  getPrevious(): Queen[] {
    if (!this.previous) {
      return [];
    }
    return [this.previous].concat(this.previous.getPrevious());
  }

  attackingQueen(q: Queen) {
    return [-1, 0, 1]
      .map((i) => q.y + i * q.x === this.y + i * this.x)
      .reduce((p, c) => p || c);
  }

  validPosition() {
    const prevQueens = this.getPrevious();
    if (prevQueens.length === 0) {
      return true;
    }
    return !prevQueens
      .map((q) => this.attackingQueen(q))
      .reduce((p, c) => p && c);
  }

  letter() {
    return this.y.toFixed(0).split('');
  }

  async move() {
    this.x += 1;
    if (this.x >= this.table.n) {
      this.x = 0;
      if (this.previous) await this.previous.move();
      else return this.table.queens.map((q) => q);
    } else if (!this.validPosition()) await this.move();
    else if (this.next) await this.next.move();
  }
}

export class Table {
  n: number;
  queens: Queen[];
  currentQueen: Queen;

  constructor(n: number) {
    this.n = n;
    this.queens = Array(n).map((i) => new Queen(i, this));
    for (const [index, item] of this.queens.entries()) {
      item.previous = index > 0 ? this.queens[index - 1] : undefined;
      item.next = index < n - 1 ? this.queens[index + 1] : undefined;
    }
    this.currentQueen = this.queens[0];
  }
}

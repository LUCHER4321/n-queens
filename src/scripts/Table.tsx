import { changeBase } from "@lucher/change-base";
import "../App.css";

class Queen {
  x: number;
  y: number = -1;
  table: Table;
  previous?: Queen;
  next?: Queen;

  static letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(x: number, table: Table) {
    this.x = x;
    this.table = table;
  }

  setSides(p: Queen | undefined, n: Queen | undefined){
    this.previous = p;
    this.next = n;
  }

  getPrevious(): Queen[] {
    if (!this.previous) {
      return [];
    }
    return [this.previous].concat(this.previous.getPrevious());
  }

  attackingQueen(q: Queen) {
    return this.y === q.y || Math.abs(this.x - q.x) === Math.abs(this.y - q.y);
  }

  validPosition() {
    if(this.y < 0) return false;
    const prevQueens = this.getPrevious();
    if (prevQueens.length === 0) {
      return true;
    }
    return !prevQueens
      .map((q) => this.attackingQueen(q))
      .reduce((p, c) => p || c);
  }

  letter() {
    return changeBase(this.x.toFixed(0).split('').map(s => Number(s)), 10, 26).map((n, index, array) => Queen.letters[n - (index === 0 && array.length > 1 ? 1 : 0)]).join("");
  }

  position(n: number | undefined = undefined){
    return this.letter() + (n === undefined ? this.y + 1 : n).toFixed(0);
  }

  async move(start = false): Promise<string[]> {
    this.table.currentQueen = this;
    this.y += start ? 0 : 1;
    if (this.y >= this.table.n) {
      this.y = -1;
      if (this.previous) {
        return await this.previous.move();
      }
      this.table.currentQueen = this;
      for(const q of this.table.queens){
        q.y = -1;
      }
      return [];
    }
    if (!this.validPosition()) {
      return await this.move();
    }
    if (this.next) {
      return await this.next.move();
    }
    return this.table.queens.map((q) => q.position());
  }
}

export class Table {
  n: number;
  queens: Queen[];
  currentQueen: Queen;

  constructor(n: number) {
    this.n = n;
    const queens: Queen[] = []
    for(let i = 0; i < n; i++){
      queens.push(new Queen(i, this as Table));
    }
    for (const [index, item] of queens.entries()) {
      item.setSides(index > 0 ? queens[index - 1] : undefined, index < n - 1 ? queens[index + 1] : undefined);
    }
    this.queens = queens;
    this.currentQueen = queens[0];
  }

  static icon = ({size}: {size: number}) => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_tile_ql.svg/1200px-Chess_tile_ql.svg.png" className={`max-w-[${size}px] max-h-[${size}px]`}/>

  static Display({size, table}: {size: number, table: Table}){
    return(
      <table>
        <tbody>
          <tr>
            <td className="bg-red-500"></td>
            {table.queens.map((item, index) => (
              <td className="bg-red-500" style={{maxWidth: size, maxHeight: size, minWidth: size, minHeight: size}} key={index}>{item.letter()}</td>
            ))}
            <td className="bg-red-500"></td>
          </tr>
          {table.queens.map((_, index) => (
            <tr key={index}>
              <td className="bg-red-500" style={{maxWidth: size, maxHeight: size, minWidth: size, minHeight: size}}>{table.n - index}</td>
              {table.queens.map((item, index1) => (
                <td className={`${(item.y === table.n - index - 1 && !item.validPosition()) ? "bg-red-400" : ((index + index1) % 2 === 0 ? "bg-white text-black" : "bg-black text-white")}`} style={{maxWidth: size, maxHeight: size, minWidth: size, minHeight: size}} key={index1}>
                  {(item.y === table.n - index - 1) && <Table.icon size={size}/>}
                </td>
              ))}
              <td className="bg-red-500" style={{maxWidth: size, maxHeight: size, minWidth: size, minHeight: size}}>{table.n - index}</td>
            </tr>
          ))}
          <tr>
            <td className="bg-red-500"></td>
            {table.queens.map((item, index) => (
              <td className="bg-red-500" style={{maxWidth: size, maxHeight: size, minWidth: size, minHeight: size}} key={index}>{item.letter()}</td>
            ))}
            <td className="bg-red-500"></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

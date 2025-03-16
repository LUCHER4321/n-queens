import { changeBase } from "@lucher/change-base";
import "../App.css";

export class Table {
  n: number;
  queens: number[];
  currentQueen: number = 0;

  constructor(n: number) {
    this.n = n;
    this.queens = [...Array(n).keys()].map(() => -1);
  }

  static letters = "abcdefghijklmnopqrstuvwxyz".split("");

  static letter(q: number){
    return changeBase(q.toFixed(0).split('').map(s => Number(s)), 10, 26).map((n, index, array) => Table.letters[n - (index === 0 && array.length > 1 ? 1 : 0)]).join("");
  }

  position(q: number, n: number | undefined = undefined){
    return Table.letter(q) + (n === undefined ? this.queens[q] + 1 : n).toFixed(0);
  }

  move(update = () => {}){
    while(this.currentQueen < this.n){
      if(this.currentQueen < 0) {
        this.currentQueen = 0;
        return [];
      }
      this.queens[this.currentQueen]++;
      update();
      if(this.queens[this.currentQueen] >= this.n){
        this.queens[this.currentQueen] = -1;
        update();
        this.currentQueen--;
        continue;
      }
      let c = false;
      for(let i = 0; i < this.currentQueen; i++){
        if(this.queens[i] === this.queens[this.currentQueen] || Math.abs(this.queens[i] - this.queens[this.currentQueen]) === Math.abs(i - this.currentQueen)){
          c = true;
          break;
        }
      }
      if(c) continue;
      this.currentQueen++;
    }
    this.currentQueen--;
    return this.queens.map((_, index) => this.position(index));
  }

  static icon = ({size}: {size: number}) => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_tile_ql.svg/1200px-Chess_tile_ql.svg.png" className={`max-w-[${size}px] max-h-[${size}px]`}/>

  static Display({size, table}: {size: number, table: Table}){
    return(
      <table>
        <tbody>
          <tr>
            <td></td>
            {table.queens.map((_, index) => (
              <td key={index}>{Table.letter(index)}</td>
            ))}
            <td></td>
          </tr>
          {table.queens.map((_, index) => (
            <tr key={index}>
              <td>{table.n - index}</td>
              {table.queens.map((item, index1) => (
                <td className={`${((index + index1) % 2 === 0 ? "bg-white" : "bg-black")}`} style={{maxWidth: size, maxHeight: size, minWidth: size, minHeight: size}} key={index1}>
                  {(item === table.n - index - 1) && <Table.icon size={size}/>}
                </td>
              ))}
              <td>{table.n - index}</td>
            </tr>
          ))}
          <tr>
            <td></td>
            {table.queens.map((_, index) => (
              <td key={index}>{Table.letter(index)}</td>
            ))}
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

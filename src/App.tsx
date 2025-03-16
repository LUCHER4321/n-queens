import { useEffect, useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { Table } from './scripts/Table';

function App() {
  const [n, setN] = useState(8);
  const [start, setStart] = useState(true);
  const [table, setTable] = useState(new Table(n));
  const [display, setDisplay] = useState(<Table.Display size={30} table={table}/>);
  const [solution, setSolution] = useState<string[]>([]);
  useEffect(() => {
    const newTable = new Table(n);
    setTable(newTable);
    setSolution([]);
    setStart(true);
    setDisplay(<Table.Display size={30} table={newTable}/>);
  }, [n])

  const moveTable = () => {
    const move = table.move(() => setDisplay(<Table.Display size={30} table={table}/>));
    setStart(move.length === 0);
    setSolution(move);
    console.log("Result:", move.join(", "));
  }

  return (
    <div className="items-center">
      <table>
        <tbody>
          <tr>
            <td>
              Número de Reinas:
            </td>
            <td className="w-2.5"/>
            <td>
              <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} className="bg-white dark:bg-black"/>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <button onClick={moveTable}>
                {start ? "Empezar" : "Siguiente"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p>{solution.join(", ")}</p>
      {display}
    </div>
  )
}

export default App

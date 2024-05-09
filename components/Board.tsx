import React, { useEffect, useState } from 'react';
import Square from './Square';
import { Button } from "./ui/button"
type Player = "X" | "O" | null | "Both";
import { Toaster, toast } from 'sonner'

function calculateWinner(squares: Player[]){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    for (let i = 0; i<lines.length; i++){
        const [a,b,c] = lines[i]
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

function Board () {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>(
        Math.round(Math.random() * 1) === 1 ? 'X' : 'O'
    )
    const [winner, setWinner] = useState<Player>(null);

    function setSquareValue(index: number){
        const newSquares = squares.map((val,i)=>{
            if (i === index){
                return currentPlayer;
            }
            return val;
        });
        setSquares(newSquares);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }


    function reset(){
        setSquares(Array(9).fill(null));
        setWinner(null);
        setCurrentPlayer(Math.round(Math.random()) === 1 ? 'X' : 'O')
    }

    useEffect(()=>{
        const w = calculateWinner(squares);
        if(w){
            setWinner(w)
            toast.success(`Winner is ${w}`)
        }
        if(!w && !squares.filter((square)=> !square).length){
            setWinner("Both")
        }
    }, [squares]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="py-2.5">
                {!winner && <p className="text-2xl text-gray-300">{currentPlayer} its your turn.</p>}
            </div>
            <div className='winner'>{winner && <p>Congratulations {winner}</p>}</div>
            <div className="w-full max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-4">
                    {squares.map((value, index) => (
                        <button
                            className="w-[10vh] h-[10vh] bg-[#171413] rounded shadow-md flex items-center justify-center text-4xl font-bold text-white"
                            key={index}
                            onClick={() => setSquareValue(index)}
                            disabled={value || winner}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                {winner && (
                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold">
                            {winner === "Both" ? "It's a draw!" : `Player ${winner} wins!`}
                        </h2>
                    </div>
                )}
            </div>
            <div className="py-5">
                <Button className='reset' onClick={reset}>Reset</Button>
            </div>
        </div>
    )
}

function CircleIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10"/>
        </svg>
    )
}

export default Board;

import React from 'react';
import Board from './Board';
import {initBoard} from "@/lib/helpers/initBoard";
import {findMoveInMoves, getPossibleMoves} from "@/lib/helpers/getMoves";
import LostPieces from "./LostPieces";
import {hasChecked} from "@/lib/helpers/checkLogic";
import {Button} from "@/components/ui/button";

export interface PieceInterface {
    typ: PieceType,
    team: Team,
    position: Position
    selected: boolean,
}
export type Position = [number, number];
export type Team = "white" | "black" | "free";
export type PieceType = "rook" | "knight" | "bishop" | "queen" | "king" | "pawn" | "free";
interface LPInterface {
    blacks: Map<PieceType, number>,
    whites: Map<PieceType, number>
}
interface MyProps {}
interface MyState {
    board: PieceInterface[][],
    selectedPiece: Position | null,
    possibleMoves: Position[],
    turn: Team,
    lostPieces: LPInterface
    checked: boolean,
    whiteKingPos: Position,
    blackKingPos: Position,
}
class Chess extends React.Component<MyProps, MyState>{
    constructor(props : MyProps) {
        super(props);
        this.state = {
            board: initBoard(),
            selectedPiece: null,
            possibleMoves: [],
            turn: "white",
            lostPieces: {blacks: new Map(), whites: new Map()},
            checked: false,
            blackKingPos: [4, 0],
            whiteKingPos: [4,7],
        }
    }

    handleClick = (x: number, y: number) : void => {
        let clickedPiece = this.state.board[y][x];
        if (findMoveInMoves(clickedPiece.position, this.state.possibleMoves)) {
            this.makeMove(this.state.selectedPiece!, clickedPiece.position);
            return;
        }
        if (clickedPiece.team === this.state.turn)
            this.selectPiece(clickedPiece);
    }
    makeMove(oldPos: Position, newPos: Position) {
        let newBoard = this.state.board.slice();
        let fromPiece = newBoard[oldPos[1]][oldPos[0]];
        let toPiece = newBoard[newPos[1]][newPos[0]];
        let newLost: LPInterface = this.state.lostPieces;

        if (toPiece.team === "black" && fromPiece.team === "white") {
            if (newLost.blacks.has(toPiece.typ)) {
                let oldVal = newLost.blacks.get(toPiece.typ);
                newLost.blacks.set(toPiece.typ, oldVal!+1);
            }
            else newLost.blacks.set(toPiece.typ, 1);
        }
        else if (toPiece.team === "white" && fromPiece.team === "black") {
            if (newLost.whites.has(toPiece.typ)) {
                let oldVal = newLost.whites.get(toPiece.typ);
                newLost.whites.set(toPiece.typ, oldVal!+1);
            }
            else newLost.whites.set(toPiece.typ, 1);
        }

        let newKingsPos : {white: Position, black: Position} = {white: this.state.whiteKingPos, black: this.state.blackKingPos};
        if (fromPiece.typ === "king") {
            if (fromPiece.team === "white")
                newKingsPos.white = toPiece.position;
            else newKingsPos.black = toPiece.position;
            console.log(newKingsPos);
        }
        toPiece.typ = fromPiece.typ;
        toPiece.team = fromPiece.team;
        fromPiece.typ = "free";
        fromPiece.team = "free";
        fromPiece.selected = false;
        let nextTurn: Team = this.state.turn === "white" ? "black" : "white";
        let whiteIsChecked = hasChecked("black", newKingsPos.white, newBoard);
        let blackIsChecked = hasChecked("white", newKingsPos.black, newBoard);
        this.setState({
            board: newBoard,
            selectedPiece: null,
            possibleMoves: [],
            turn: nextTurn,
            whiteKingPos: newKingsPos.white,
            blackKingPos: newKingsPos.black,
            lostPieces: newLost,
            checked: nextTurn === "white" ? whiteIsChecked : blackIsChecked,
        });

        // Send socket move has been made
    }

    selectPiece = (piece: PieceInterface) : void => {
        if (this.state.checked && piece.typ !== "king")
            return;
        let newBoard = this.state.board.slice();
        let newSelected : Position | null = null;
        let newMoves : Position[] = [];
        if (!piece.selected) {
            piece.selected = true;
            newSelected = piece.position;
            newMoves = getPossibleMoves(piece, newBoard);
        }
        else piece.selected = false;

        if (this.state.selectedPiece) {
            let [prevX, prevY] = this.state.selectedPiece;
            newBoard[prevY][prevX].selected = false;
        }
        this.setState({
            board: newBoard,
            possibleMoves: newMoves,
            selectedPiece: newSelected,
        });
    }
    render(){
        return (
            <div className={"container mx-auto grid justify-center mt-10 grid-cols-4"}>
                <div className={"row-start-2"}>
                    <LostPieces team={"white"} pieces={Array.from(this.state.lostPieces.whites, ([typ, quantity]) => ({
                        typ,
                        quantity
                    }))}/>
                </div>
                <p className={`text-xl text-white col-start-2 col-span-2 py-4 font-bold uppercase ${this.state.checked ? "text-red-600" : ""} text-center`}>
                    {this.state.checked ? `${this.state.turn}'s checked` : `${this.state.turn}'s turn`}
                </p>
                <div className={"col-start-2 col-span-2 row-start-2 flex justify-center"}>
                    <Board boardPieces={this.state.board} handleClick={this.handleClick}
                           moves={this.state.possibleMoves}/>
                </div>
                <div className={"row-start-2 col-start-4"}>
                    <LostPieces team={"black"} pieces={Array.from(this.state.lostPieces.blacks, ([typ, quantity]) => ({
                        typ,
                        quantity
                    }))}/>
                </div>
            </div>
        );
    }
}

export default Chess;
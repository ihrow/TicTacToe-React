import { useState } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Square from './Square'
import Confetti from 'react-confetti'
import winningLines from '../models/Board.models'

export function Board(props) {
  const board = props.board
  const { width, height } = useWindowSize()

  const player = props.player



  const isWinner = (board) => {
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i]
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const handleSquareClick = (position) => {
    if (winner || board[position]) {
      return
    }
    props.setBoard((prev) => {
      return prev.map((square, pos) => {
        return pos === position ? player.player : square
      })
    })
    console.log('handleSquareClick', board)
  }

  const handleRestartGame = () => {
    props.setBoard(Array(9).fill(null))
    props.setPlayer({
      player: '❌',
      currentPlayer: player.firstMove,
      firstMove: player.firstMove === props.firstPlayer ? props.secondPlayer : props.firstPlayer
    })
  }

  const tie = board.every((square) => square !== null)
  const winner = isWinner(board, player)

  let statusMessage = winner ? (
    <span>
      <span className="player-status">
        {player.currentPlayer === props.firstPlayer
          ? props.secondPlayer
          : props.firstPlayer}
      </span>
      <span> won!<br/> </span>
      <span className='switch-side-status'>Switching sides...</span>
    </span>
    
  ) : (
    <span>
      <span className="player-status">{player.currentPlayer}</span>'s move.
    </span>
  )

  if (tie) {
    statusMessage = 'It is a tie!'
  }

  return (
    <div className="gameboard">
      {winner ? <Confetti width={width} height={height} /> : null}
      <div className="status">{statusMessage}</div>
      <div className="board">
        {board.map((square, pos) => {
          return (
            <Square
              isVisible={!!square}
              key={pos}
              squareN={pos}
              value={square}
              onClick={() => {
                handleSquareClick(pos)
              }}
            />
          )
        })}
      </div>
      <button className="button restart-button" onClick={handleRestartGame}>
        New Game
      </button>
    </div>
  )
}


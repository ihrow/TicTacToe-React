import { useState } from 'react'
import Square from './Square'
import Confetti from 'react-confetti'
import winningLines from '../models/Board.models'

function Board(props) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [player, setPlayer] = useState('❌')
  const [currentPlayer, setCurrentPlayer] = useState(props.firstPlayer)

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
    setBoard((prev) => {
      return prev.map((square, pos) => {
        return pos === position ? player : square
      })
    })
    setPlayer((prev) => (prev === '❌' ? '⭕' : '❌'))
    setCurrentPlayer((prev) =>
      prev === props.firstPlayer ? props.secondPlayer : props.firstPlayer
    )
  }

  const handleRestartGame = () => {
    setBoard(Array(9).fill(null))
    setPlayer('❌')
    setCurrentPlayer(props.firstPlayer)
  }

  const handleBack = () => {
    props.setGame(false)
    props.setStyle({ display: 'flex' })
  }

  const tie = board.every((square) => square !== null)
  const winner = isWinner(board, player)

  let statusMessage = winner ? (
    <span>
      <span className="player">
        {currentPlayer === props.firstPlayer
          ? props.secondPlayer
          : props.firstPlayer}
      </span>{' '}
      won!
    </span>
  ) : (
    <span>
      <span className="player">{currentPlayer}</span>'s move.
    </span>
  )

  if (tie) {
    statusMessage = 'It is a tie!'
  }

  return (
    <div className="gameboard">
      {winner ? <Confetti /> : null}
      <div className="status">{statusMessage}</div>
      <div className="board">
        {board.map((square, pos) => {
          return (
            <Square
              isVisible={!!square}
              key={pos}
              squareN={pos}
              value={square}
              onClick={() => handleSquareClick(pos)}
            />
          )
        })}
      </div>
      <button className="button restart-button" onClick={handleRestartGame}>
        New Game
      </button>
      <button className="button back-button" onClick={handleBack}>
        Back
      </button>
    </div>
  )
}

export default Board

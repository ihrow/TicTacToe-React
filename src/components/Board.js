import { useState } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Square from './Square'
import Confetti from 'react-confetti'
import winningLines from '../models/Board.models'

function Board(props) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const { width, height } = useWindowSize()

  const [player, setPlayer] = useState({
    player: '❌',
    currentPlayer: props.firstPlayer,
    firstMove: props.secondPlayer
  })

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
        return pos === position ? player.player : square
      })
    })
    setPlayer(prev => {
      return {
        ...prev,
        player: prev.player === '❌' ? '⭕' : '❌',
        currentPlayer: prev.currentPlayer === props.firstPlayer ? props.secondPlayer : props.firstPlayer
      }
    })
  }

  const handleRestartGame = () => {
    setBoard(Array(9).fill(null))
    setPlayer({
      player: '❌',
      currentPlayer: player.firstMove,
      firstMove: player.firstMove === props.firstPlayer ? props.secondPlayer : props.firstPlayer
    })
  }

  const handleBack = () => {
    props.setGame(false)
    props.setStyle({ display: 'flex' })
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

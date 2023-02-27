import { Board } from './Board'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const LocalGame = (props) => {
  const navigate = useNavigate()
  const [board, setBoard] = useState(Array(9).fill(null))
  const players = props.players

  const handleBack = () => {
    navigate('/local')
  }

  return (
    <div className="container">
      <h1 className="title">TicTacToe</h1>
      <div className="start-game">
        <Board
          firstPlayer={players.player1}
          secondPlayer={players.player2}
          board={board}
          setBoard={setBoard}
          isOnline={false}
        />
      </div>
      <button className="button back-button" onClick={handleBack}>
        Back
      </button>
    </div>
  )
}

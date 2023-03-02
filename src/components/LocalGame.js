import { Board } from './Board'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const LocalGame = (props) => {
  const navigate = useNavigate()
  const [board, setBoard] = useState(Array(9).fill(null))
  const playerNames = props.playerNames
  const currentPlayer = props.currentPlayer

  const handleBack = () => {
    navigate('/local')
  }

  const handleResetGame = () => {
    setBoard(Array(9).fill(null))
    props.setCurrentPlayer({
      symbol: '❌',
      playerName: currentPlayer.firstMove,
      firstMove:
        currentPlayer.firstMove === props.firstPlayer
          ? props.secondPlayer
          : props.firstPlayer,
    })
  }

  return (
    <div className="container">
      <h1 className="title">TicTacToe</h1>
      <div className="start-game">
        <Board
          firstPlayer={playerNames.player1}
          secondPlayer={playerNames.player2}
          board={board}
          setBoard={setBoard}
          setCurrentPlayer={props.setCurrentPlayer}
          currentPlayer={props.currentPlayer}
          isOnline={false}
          handleResetGame={handleResetGame}
        />
      </div>
      <button className="button back-button" onClick={handleBack}>
        Back
      </button>
    </div>
  )
}

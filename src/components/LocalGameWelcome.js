import { PlayerForm } from './PlayerForm'
import { useNavigate } from 'react-router-dom'

export const LocalGameWelcome = (props) => {
  const navigate = useNavigate()

  const playerNames = props.playerNames

  const handleStartGame = () => {
    if (playerNames.player1 === '' || playerNames.player2 === '') {
      alert('Please enter player names')
      return
    }
    navigate('/local/game')
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="container">
      <h1 className="title">TicTacToe</h1>
      <div className="start-game">
        <PlayerForm
          amountOfPlayers={2}
          playerNames={playerNames}
          setPlayerNames={props.setPlayerNames}
        />

        <button className="button start-button" onClick={handleStartGame}>
          Start Game
        </button>

        <button className="button start-button" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  )
}

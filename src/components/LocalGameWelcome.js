import { PlayerForm } from './PlayerForm'
import { useNavigate } from 'react-router-dom'

export const LocalGameWelcome = (props) => {
  const navigate = useNavigate()

  const players = props.players;

  const handleStartGame = () => {
    if (players.player1 === '' || players.player2 === '') {
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
        <PlayerForm amountOfPlayers={2} players={players} setPlayers={props.setPlayers} />

        <button
          className="button start-button"
          onClick={handleStartGame}
        >
          Start Game
        </button>

        <button
          className="button start-button"
          onClick={handleBack}
        >
          Back
        </button>

      </div>
    </div>
  )
}

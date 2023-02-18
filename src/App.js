import { useState } from 'react'
import Board from './components/Board'
import PlayerForm from './components/PlayerForm'

function App() {
  const [game, setGame] = useState(false)
  const [style, setStyle] = useState({})

  const [players, setPlayers] = useState({
    player1: '',
    player2: '',
  })

  const handleStartGame = () => {
    if (players.player1 === '' || players.player2 === '') {
      alert('Please enter player names')
      return
    }
    setGame(true)
    setStyle({ display: 'none' })
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">TicTacToe</h1>
      </div>
      <div className="start-game">
        
        <PlayerForm 
          style={style}
          players={players}
          setPlayers={setPlayers}
        />
        
        <button
          style={style}
          className="button start-button"
          onClick={handleStartGame}
        >
          Start Game
        </button>

        {game ? (
          <Board
            setGame={setGame}
            setStyle={setStyle}
            firstPlayer={players.player1}
            secondPlayer={players.player2}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App

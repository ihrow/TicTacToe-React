import { useState, useEffect } from 'react'
import { StartScreen } from './components/StartScreen'
import { LocalGameWelcome } from './components/LocalGameWelcome'
import { OnlineGame } from './components/OnlineGame'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { serverConnect } from './utils/serverConnect'
import { LocalGame } from './components/LocalGame'

function App() {
  const [players, setPlayers] = useState({
    player1: window.localStorage.getItem('players')
      ? JSON.parse(window.localStorage.getItem('players')).player1
      : '',
    player2: window.localStorage.getItem('players')
      ? JSON.parse(window.localStorage.getItem('players')).player2
      : '',
  })
  const [clients, setClients] = useState([])
  const [gameId, setGameId] = useState(null)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [playerNumber, setPlayerNumber] = useState({})

  useEffect(() => {
    serverConnect(setClients, setGameId, setBoard, setPlayerNumber)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('players', JSON.stringify(players))
  }, [players])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route
          path="/local"
          element={
            <LocalGameWelcome players={players} setPlayers={setPlayers} />
          }
        />
        <Route
          path="/online"
          element={
            <OnlineGame
              gameId={gameId}
              clients={clients}
              players={players}
              setPlayers={setPlayers}
              board={board}
              setBoard={setBoard}
              playerNumber={playerNumber}
            />
          }
        />
        <Route path="/local/game" element={<LocalGame players={players} />} />
      </Routes>
    </Router>
  )
}

export default App

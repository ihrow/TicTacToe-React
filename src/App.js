import { useState, useEffect } from 'react'
import { StartScreen } from './components/StartScreen'
import { LocalGameWelcome } from './components/LocalGameWelcome'
import { OnlineGame } from './components/OnlineGame'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { serverConnect } from './utils/serverConnect'
import { LocalGame } from './components/LocalGame'

function App() {
  const [playerNames, setPlayerNames] = useState({
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
  const [currentPlayer, setCurrentPlayer] = useState({
    symbol: '❌',
    playerName: playerNames.player1,
    firstMove: playerNames.player1,
  })
  const [isBoardDisabled, setIsBoardDisabled] = useState(false)

  useEffect(() => {
    serverConnect(
      setClients,
      setGameId,
      setBoard,
      setCurrentPlayer,
      setIsBoardDisabled,
      currentPlayer
    )
  }, [currentPlayer])

  useEffect(() => {
    window.localStorage.setItem('players', JSON.stringify(playerNames))
  }, [playerNames])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route
          path="/local"
          element={
            <LocalGameWelcome
              playerNames={playerNames}
              setPlayerNames={setPlayerNames}
            />
          }
        />
        <Route
          path="/online"
          element={
            <OnlineGame
              gameId={gameId}
              clients={clients}
              playerNames={playerNames}
              board={board}
              currentPlayer={currentPlayer}
              isBoardDisabled={isBoardDisabled}
              setBoard={setBoard}
              setCurrentPlayer={setCurrentPlayer}
              setPlayerNames={setPlayerNames}
            />
          }
        />
        <Route
          path="/local/game"
          element={
            <LocalGame
              currentPlayer={currentPlayer}
              playerNames={playerNames}
              setCurrentPlayer={setCurrentPlayer}
            />
          }
        />
      </Routes>
    </Router>
  )
}

export default App

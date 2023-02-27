import { useEffect, useState } from 'react'
import { PlayerForm } from './PlayerForm'
import { useNavigate } from 'react-router-dom'
import { ws, clientId, gameId } from '../utils/serverConnect'
import { Board } from './Board'

export const OnlineGame = (props) => {
  const navigate = useNavigate()
  const [gameInputId, setGameInputId] = useState('')
  const players = props.players
  const clients = props.clients
  const board = props.board

  const handleBack = () => {
    const payLoad = {
      method: 'disconnect',
      clientId: clientId,
      gameId: gameId || gameInputId,
    }
    ws.send(JSON.stringify(payLoad))
    navigate('/')
  }

  const handleCreateRoom = () => {
    const payLoad = {
      method: 'create',
      clientId: clientId,
      player: players.player1,
      board: board,
    }

    ws.send(JSON.stringify(payLoad))
  }

  const handleJoinGame = () => {
    let gameJoinId = gameId === null ? gameInputId : gameId
    if (gameJoinId.length === 0) {
      alert('Please enter a game ID')
      return;
    }
    
    const payLoad = {
      method: 'join',
      clientId: clientId,
      gameId: gameJoinId,
      player: players.player1,
    }
    console.log(clients)
    ws.send(JSON.stringify(payLoad))
  }

  const handleIdInputChange = (e) => {
    if (e.target.value.length === 0) {
      return
    }
    setGameInputId(e.target.value)
  }

  const handleMove = () => {
    console.log('handleMove', board)
    const payLoad = {
      method: 'move',
      clientId: clientId,
      gameId: gameId || gameInputId,
      board: board,
    }
    ws.send(JSON.stringify(payLoad))
  }   

  useEffect(() => {
    const payLoad = {
      method: 'updateBoard',
      board: board,
      gameId: gameId || gameInputId,
    }
    setTimeout(() => {}, 100)
    ws.send(JSON.stringify(payLoad))
  }, [board])

  return (
    <div className="container">
      <h1 className="title">TicTacToe</h1>
      {clients.map((client, key) => {
        return (
          <div key={key}>
            <h2>{client.name} connected!</h2>
          </div>
        )
      })}

      {clients.length === 2 ? (
        <div className="start-game" onClick={handleMove}>
          <Board
            firstPlayer={clients[0].name}
            secondPlayer={clients[1].name}
            board={board}
            setBoard={props.setBoard}
            player={props.player}
            setPlayer={props.setPlayer}
          />
          <button className="button back-button" onClick={handleBack}>
            Back
          </button>
        </div>
      ) : (
        <div className="start-game">
          <div className="form">
            <PlayerForm
              amountOfPlayers={1}
              players={players}
              setPlayers={props.setPlayers}
            />
          </div>

          <div className="room-management">
            <div className="create-room">
              <button
                className="button start-button"
                onClick={handleCreateRoom}
              >
                Create Room
              </button>
            </div>
            <div className="join-room">
              {props.gameId === null ? <></> : <h2>Room ID: {props.gameId}</h2>}
              <input
                type="text"
                placeholder="Enter Room ID"
                onChange={handleIdInputChange}
              />
              <button className="button start-button" onClick={handleJoinGame}>
                Join Game
              </button>
            </div>
            <div className="back-button">
              <button className="button start-button" onClick={handleBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { PlayerForm } from './PlayerForm'
import { useNavigate } from 'react-router-dom'
import { ws, clientId, gameId } from '../utils/serverConnect'
import { Board } from './Board'
import Clipboard from 'react-clipboard.js'

export const OnlineGame = (props) => {
  const navigate = useNavigate()
  const [gameInputId, setGameInputId] = useState('')
  const playerNames = props.playerNames
  const clients = props.clients
  const board = props.board

  const handleDisconnect = () => {
    const payLoad = {
      method: 'disconnect',
      clientId: clientId,
      gameId: gameId || gameInputId,
    }
    ws.send(JSON.stringify(payLoad))
    navigate('/')
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleCreateRoom = () => {
    const payLoad = {
      method: 'create',
      clientId: clientId,
      player: playerNames.player1,
      board: board,
    }

    ws.send(JSON.stringify(payLoad))
  }

  const handleJoinGame = () => {
    let gameJoinId = gameId === null ? gameInputId : gameId
    if (gameJoinId.length === 0) {
      alert('Please enter a game ID')
      return
    }

    const payLoad = {
      method: 'join',
      clientId: clientId,
      gameId: gameJoinId,
      player: playerNames.player1,
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

  const handleResetGame = () => {
    const payLoad = {
      method: 'resetGame',
      gameId: gameId || gameInputId,
    }
    ws.send(JSON.stringify(payLoad))
  }

  const handleMove = () => {
    console.log('clientId', clientId)
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
      <div className="game">
        {clients.length === 2 ? (
          <div>
            <div className="start-game" onClick={handleMove}>
              <Board
                firstPlayer={clients[0].name}
                secondPlayer={clients[1].name}
                board={board}
                setBoard={props.setBoard}
                currentPlayer={props.currentPlayer}
                setCurrentPlayer={props.setCurrentPlayer}
                isBoardDisabled={props.isBoardDisabled}
                handleResetGame={handleResetGame}
                isOnline={true}
              />
              <button className="button back-button" onClick={handleDisconnect}>
              Back
            </button>
            </div>
          </div>
        ) : (
          <div className="start-game">
            <div className="form">
              <PlayerForm
                amountOfPlayers={1}
                playerNames={playerNames}
                setPlayerNames={props.setPlayerNames}
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
                {props.gameId === null ? (
                  <></>
                ) : (
                  <Clipboard onClick={() => alert("Copied")} className='id-copy-button' data-clipboard-text={props.gameId}> Copy ID </Clipboard>
                )}
              </div>
              <div className="join-room">
                <input
                  className='id-input'
                  type="text"
                  placeholder="Enter Room ID"
                  onChange={handleIdInputChange}
                />
                <button
                  className="button start-button"
                  onClick={handleJoinGame}
                >
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
        <div className="connected-clients">
          {clients.map((client, key) => {
            return (
              <div key={key}>
                <h4>{client.name}</h4>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

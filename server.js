const { v4: uuidv4 } = require('uuid')
const express = require('express')
const WebSocket = require('ws')

const PORT = process.env.PORT || 3000

const app = express()
  .use(express.static('build'))
  .get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html')
  })
  .listen(PORT, () => {
    console.log('Server is running on port', PORT)
  })

const clients = {}
const games = {}

const wsServer = new WebSocket.Server({ 
  server: app,
})

wsServer.on('listening', () => {
  console.log('Websocket server is listening')
})

wsServer.on('connection', (ws) => {
  const clientId = uuidv4()
  clients[clientId] = {
    connection: ws,
    name: null,
  }
  const payLoad = {
    method: 'connect',
    clientId: clientId,
  }
  ws.send(JSON.stringify(payLoad))
  console.log('client connected', clientId)

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`)
    const result = JSON.parse(message)
    console.log('Received result', result)
    switch (result.method) {
      case 'create': {
        const clientId = result.clientId
        const gameId = uuidv4()

        games[gameId] = {
          id: gameId,
          player1: result.player,
          player2: null,
          board: result.board,
          clients: [],
        }

        games[gameId].clients.push({
          clientId: clientId,
          name: result.player,
        })

        const payLoad = {
          method: 'create',
          game: games[gameId],
          clientId: clientId,
          playerName: result.player,
        }

        ws.send(JSON.stringify(payLoad))

        return
      }
      case 'join': {
        const clientId = result.clientId
        
        clients[clientId].name = result.player

        const gameId = result.gameId
        if (!games[gameId]) {
          console.log('Game does not exist')
          return
        }
        const game = games[gameId]

        if (game.clients.length >= 2) {
          console.log('Game is full')
          return
        }

        if (
          game.clients.filter((client) => client.clientId === clientId).length >
          0
        ) {
          console.log('You are already in this game')
          return
        }

        game.player2 = result.player
        game.clients.push({
          clientId: clientId,
        })
        game.clients.forEach((client) => {
          if (client.clientId === clientId) {
            client.name = result.player
          }
        })

        const payLoad = {
          method: 'join',
          game: game,
          clients: game.clients,
          clientId: clientId,
        }

        game.clients.forEach((client) => {
          const clientConnection = clients[client.clientId].connection
          clientConnection.send(JSON.stringify(payLoad))
        })

        return
      }
      case 'move': {
        const clientId = result.clientId
        console.log('clientId MOVED', clientId)
        const gameId = result.gameId
        const game = games[gameId]
        game.board = result.board

        const payLoad = {
          method: 'move',
          game: games[gameId],
          movePlayer: game.clients.filter(
            (client) => client.clientId === clientId
          )[0]?.name,
        }

        setTimeout(() => {
          games[gameId].clients.forEach((client) => {
            const clientConnection = clients[client.clientId].connection
            clientConnection.send(JSON.stringify(payLoad))
          })
        }, 100)

        break
      }
      case 'disconnect': {
        const clientId = result.clientId
        const game = games[result.gameId]

        const savedGameClients = game?.clients
        if (!savedGameClients) {
          return
        }
        const disconnectedClient = game.clients.filter(
          (client) => client.clientId === clientId
        )[0]

        game.clients = game.clients.filter(
          (client) => client.clientId !== clientId
        )

        const payLoad = {
          method: 'disconnect',
          clients: game.clients,
          disconnectedClient: disconnectedClient?.name,
        }

        savedGameClients.forEach((client) => {
          const clientConnection = clients[client.clientId].connection
          clientConnection.send(JSON.stringify(payLoad))
        })

        break
      }
      case 'updateBoard': {
        const gameId = result.gameId
        if (!games[gameId]) {
          return
        }
        const game = games[gameId]
        game.board = result.board
        break
      }
      case 'resetGame': {
        const gameId = result.gameId
        if (!games[gameId]) {
          return
        }
        const game = games[gameId]

        game.clients.forEach((client) => {
          const clientConnection = clients[client.clientId].connection
          clientConnection.send(JSON.stringify(result))
        })
        break
      }
      default:
        break
    }
  })

  ws.on('close', () => {
    console.log('WebSocket disconnected')
  })

})

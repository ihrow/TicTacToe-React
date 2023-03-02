const { v4: uuidv4 } = require('uuid')
const express = require('express')
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.static('build'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html')
})
app.listen(PORT, () => {
  console.log('Server is running on port 3001')
})

const http = require('http')
const webSocketServer = require('websocket').server
const httpServer = http.createServer()
httpServer.listen(8080, () => {
  console.log('Server is running on port 8080')
})

const clients = {}
const games = {}

const wsServer = new webSocketServer({
  httpServer: httpServer,
})

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin)

  connection.on('open', () => console.log('opened'))
  connection.on('close', () => console.log('closed'))
  connection.on('message', (message) => {
    const result = JSON.parse(message.utf8Data)
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

        const clientConnection = clients[clientId]?.connection
        clientConnection.send(JSON.stringify(payLoad))

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

  const clientId = uuidv4()
  clients[clientId] = {
    connection: connection,
  }

  const payLoad = {
    method: 'connect',
    clientId: clientId,
  }

  connection.send(JSON.stringify(payLoad))
})

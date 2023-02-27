export let clientId = null
export let ws = new WebSocket('ws://localhost:8080')
export let gameId = null

export function serverConnect(setClients, setGameId, setBoard, setPlayerNumber) {
  ws.onmessage = (message) => {
    const response = JSON.parse(message.data)
    switch (response.method) {
      case 'connect':
        clientId = response.clientId
        console.log('Client successfully connected: ', clientId)
        break
      case 'create': {
        clientId = response.clientId
        gameId = response.game.id

        setGameId(gameId)
        console.log(
          'Game successfully created: ',
          response.game.id,
          ' with ',
          response.game.player1,
          ' as player 1 and ',
          response.game.board,
          ' as board'
        )
        break
      }

      case 'join':
        const game = response.game
        clientId = response.clientId
        setClients(game.clients)
        console.log(game.clients)

        if (game.clients.length >= 3) {
          console.log('Game is full')
          return
        } else if (response.game.clients.length === 2) {
          console.log(
            'Game successfully joined: ',
            response.game.id,
            ' with ',
            response.game.player2,
            ' as player 2'
          )
        } else if (response.game.clients.length === 1) {
          console.log(
            'Game successfully joined: ',
            response.game.id,
            ' with ',
            response.game.player1,
            ' as player 1'
          )
        }
        break

      case 'move':
        console.log('Move successfully made: ', response.game.board)
        const gameBoard = response.game.board
        setBoard(gameBoard)

        break

      case 'disconnect':
        console.log('Client successfully disconnected: ', response.clients)
        setClients(response.clients)
        alert(response.disconnectedClient + ' has disconnected')
      break

      default:
        break
    }
  }
}

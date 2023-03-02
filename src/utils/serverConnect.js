export let clientId = null
export let ws = new WebSocket('ws://localhost:8080')
export let gameId = null

export function serverConnect(
  setClients,
  setGameId,
  setBoard,
  setCurrentPlayer,
  setIsBoardDisabled,
  currentPlayer
) {
  ws.onmessage = (message) => {
    const response = JSON.parse(message.data)
    switch (response.method) {
      case 'connect':
        clientId = response.clientId
        break
      case 'create': {
        clientId = response.clientId
        gameId = response.game.id

        setGameId(gameId)
        setIsBoardDisabled(true)

        break
      }
      case 'join':
        const game = response.game
        if (game.clients.length >= 3) {
          alert('Game is full')
          return
        }
        if (clientId === response.clientId) {
          setIsBoardDisabled(false)
        }

        setClients(game.clients)
        setCurrentPlayer((prev) => {
          return {
            ...prev,
            playerName: game.clients[1]?.name,
          }
        })
        setBoard(Array(9).fill(null))
        break

      case 'move':
        const gameBoard = response.game.board

        if (currentPlayer.playerName === response.movePlayer) {
          setBoard(gameBoard)
          setCurrentPlayer((prev) => {
            return {
              ...prev,
              symbol: prev.symbol === '❌' ? '⭕' : '❌',
              playerName:
                prev.playerName === response.game.clients[0]?.name
                  ? response.game.clients[1]?.name
                  : response.game.clients[0]?.name,
            }
          })
          setIsBoardDisabled((prev) => !prev)
        }
        break
      case 'resetGame':
        setBoard(Array(9).fill(null))
        setCurrentPlayer((prev) => {
          return {
            ...prev,
            symbol: '❌',
          }
        })
        break
      case 'disconnect':
        setClients(response.clients)
        alert(response.disconnectedClient + ' has disconnected')
        break
      default:
        break
    }
  }
}

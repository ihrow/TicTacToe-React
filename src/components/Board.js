import useWindowSize from 'react-use/lib/useWindowSize'
import Square from './Square'
import Confetti from 'react-confetti'
import winningLines from '../models/Board.models'

export function Board(props) {
  const board = props.board
  const { width, height } = useWindowSize()

  const currentPlayer = props.currentPlayer
  const style = props.isBoardDisabled ? { pointerEvents: 'none' } : {}

  const isWinner = (board) => {
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i]
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const handleSquareClick = (position) => {
    if (winner || board[position]) {
      return
    }
    props.setBoard((prev) => {
      return prev.map((square, pos) => {
        return pos === position ? currentPlayer.symbol : square
      })
    })
    if (!props.isOnline) {
      props.setCurrentPlayer((prev) => {
        return {
          ...prev,
          symbol: prev.symbol === '❌' ? '⭕' : '❌',
          playerName:
            prev.currentPlayer === props.firstPlayer
              ? props.secondPlayer
              : props.firstPlayer,
        }
      })
    }
  }

  const tie = board.every((square) => square !== null)
  const winner = isWinner(board, currentPlayer)

  let statusMessage = winner ? (
    <span>
      <span className="player-status">
        {currentPlayer.playerName === props.firstPlayer
          ? props.secondPlayer
          : props.firstPlayer}
      </span>
      <span>
        {' '}
        won!
        <br />{' '}
      </span>
      <span className="switch-side-status">Switching sides...</span>
    </span>
  ) : (
    <span>
      <span className="player-status">{currentPlayer.playerName}</span>'s move.
    </span>
  )

  if (tie) {
    statusMessage = 'It is a tie!'
  }

  return (
    <div className="gameboard">
      {winner ? <Confetti width={width} height={height} /> : null}
      <div className="status">{statusMessage}</div>
      <div className="board" style={style}>
        {board.map((square, pos) => {
          return (
            <Square
              isVisible={!!square}
              key={pos}
              squareN={pos}
              value={square}
              onClick={() => {
                handleSquareClick(pos)
              }}
            />
          )
        })}
      </div>
      {winner || tie ? (
        <button
          className="button restart-button"
          onClick={props.handleResetGame}
        >
          Restart
        </button>
      ) : null}
    </div>
  )
}

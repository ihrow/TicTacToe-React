import { useNavigate } from "react-router-dom"

export function StartScreen() {
  const navigate = useNavigate()

  const handleStartLocalGame = () => {
    navigate("/local")
  }

  const handleStartOnlineGame = () => {
    navigate("/online")
  }

  return (
    <div className="container">
      <h1 className="title">TicTacToe</h1>
      <div className="start-game">
        <button onClick={handleStartLocalGame} className="button start-button">
          Start Local Game
        </button>
        <button onClick={handleStartOnlineGame} className="button start-button">
          Start Online Game
        </button>
      </div>
    </div>
  )
}

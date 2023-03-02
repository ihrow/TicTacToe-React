export const PlayerForm = ({
  amountOfPlayers,
  playerNames,
  setPlayerNames,
}) => {
  const handlePlayerChange = (e) => {
    setPlayerNames({
      ...playerNames,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form className="player-form">
      <div>
        <label className="player-form-input" htmlFor="player1">
          {amountOfPlayers === 2 ? '❌ Player 1:' : '👤 Your name: '}
        </label>
        <input
          type="text"
          id="player1"
          name="player1"
          className="player-form-input"
          value={playerNames.player1}
          onChange={handlePlayerChange}
        />
      </div>
      {amountOfPlayers === 2 ? (
        <div>
          <label className="player-form-input" htmlFor="player2">
            ⭕ Player 2:{' '}
          </label>
          <input
            type="text"
            id="player2"
            name="player2"
            value={playerNames.player2}
            className="player-form-input"
            onChange={handlePlayerChange}
          />
        </div>
      ) : null}
    </form>
  )
}

import { GamePrepProps, gamePrepReducer, initialPrepState, AddPlayerAction, PlayerInputChangeAction, RemovePlayerAction } from "./Prep.state"
import { useLocalState } from "../use-local-state"

export const GamePrep: React.FC<GamePrepProps> = ({startGame}) => {
  const [state, dispatch] = useLocalState('prepstate', gamePrepReducer, () => initialPrepState)

  return (
    <>
      <h1>Skull King Calculator</h1>
      <p>Add up to 6 players:</p>
      {state.players.length < 6 && (
        <form onSubmit={(e) => {
          e.preventDefault()
          dispatch(new AddPlayerAction(state.playerInput))
        }}>
          <input
            placeholder="Player name"
            value={state.playerInput}
            onChange={(e) => dispatch(new PlayerInputChangeAction(e.target.value))}
          />
          <input type="submit" value="Add player"/>
        </form>
      )}
      <ul>
        {state.players.map((p) => (
          <li key={p}>{p} <button onClick={() => dispatch(new RemovePlayerAction(p))}>x</button></li>
        ))}
      </ul>
      {
        state.players.length >= 2 && (
          <button onClick={() => startGame(state.players)}>
            Start game!
          </button>
        )
      }
    </>
  )
}

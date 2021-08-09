import { Action, ActualChangedAction, BetChangedAction, Player, PirateCapturesChangedAction, State, SkullKingsCapturedChangedAction } from "./state"



interface NumberThingProps {
  value: number
  onChange(nextValue: number): void
  roundIndex: number
  max?: number
}

const NumberThing: React.FC<NumberThingProps> = (props) => {
  return (
    <>
      <button
        onClick={() => props.onChange((props.value || 0) - 1)}
        disabled={props.value === 0}
      >-</button>
      <span>{props.value}</span>
      <button
        onClick={() => props.onChange((props.value || 0) + 1)}
        disabled={props.value >= (props.max ?? props.roundIndex + 1)}
      >+</button>
    </>
  )
}

interface RoundProps {
  state: State
  dispatch: React.Dispatch<Action>
}

export const RoundModule: React.FC<RoundProps> =  ({ state, dispatch }) => {
  const roundIndex = 0
  return (
    <table>
      <caption>Round 1</caption>
      <thead>
        <tr>
          <th>Player</th>
          <th>Bet</th>
          <th>Actual</th>
          <th>Pirates captured</th>
          <th>Skull kings captured</th>
        </tr>
      </thead>
      <tbody>
        {state.players.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>
              <NumberThing
                value={p.rounds[roundIndex].bet}
                onChange={(x) => dispatch(new BetChangedAction(x, p.id, roundIndex))}
                roundIndex={roundIndex}
              />
            </td>
            <td>
              <NumberThing
                value={p.rounds[roundIndex].actual}
                onChange={(x) => dispatch(new ActualChangedAction(x, p.id, roundIndex))}
                roundIndex={roundIndex}
              />
            </td>
            <td>
              <NumberThing
                value={p.rounds[roundIndex].piratesCaptured}
                onChange={(x) => dispatch(new PirateCapturesChangedAction(x, p.id, roundIndex))}
                roundIndex={roundIndex}
                max={6} // 5 pirates and 1 scary mary
              />
            </td>
            <td>
              <NumberThing
                value={p.rounds[roundIndex].skullKingsCaptured}
                onChange={(x) => dispatch(new SkullKingsCapturedChangedAction(x, p.id, roundIndex))}
                roundIndex={roundIndex}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

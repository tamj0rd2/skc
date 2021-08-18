import styled from "styled-components"
import {
  GameAction,
  TricksWonChangedAction,
  BetChangedAction,
  PirateCapturesChangedAction,
  GameState,
  SkullKingsCapturedChangedAction
} from "./Game.state"

interface NumberThingProps {
  value: number | undefined
  onChange(nextValue: number): void
  roundIndex: number
  max?: number
}

const NumberSpan = styled.span`
  margin-left: 2px;
  margin-right: 2px;
`

export const NumberThing: React.FC<NumberThingProps> = (props) => {
  return (
    <>
      <button
        onClick={() => props.onChange((props.value || 0) - 1)}
        disabled={props.value === 0}
      >-</button>
      <NumberSpan>{props.value ?? '?'}</NumberSpan>
      <button
        onClick={() => props.onChange((props.value || 0) + 1)}
        disabled={(props.value ?? 0) >= (props.max ?? props.roundIndex + 1)}
      >+</button>
    </>
  )
}

interface RoundProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  roundIndex: number
}

const RoundCard = styled.section`
  margin-top: 10px;
`

export const RoundModule: React.FC<RoundProps> =  ({ state, dispatch, roundIndex }) => {
  const roundNumber = roundIndex + 1
  return (
    <RoundCard>
    <hr />

    <table>
      <caption><strong>Round {roundNumber}</strong></caption>
      <thead>
        <tr>
          <th>Player</th>
          <th>Bet</th>
          <th>Won</th>
          <th>Pirates</th>
          <th>SkullKs</th>
          <th>Diff</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {state.players.map((p) => {
          const round = p.rounds[roundIndex]
          return (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>
                <NumberThing
                  value={round.bet}
                  onChange={(x) => dispatch(new BetChangedAction(x, p.id, roundIndex))}
                  roundIndex={roundIndex}
                />
              </td>
              <td>
                <NumberThing
                  value={round.won}
                  onChange={(x) => dispatch(new TricksWonChangedAction(x, p.id, roundIndex))}
                  roundIndex={roundIndex}
                />
              </td>
              <td>
                <NumberThing
                  value={round.piratesCaptured}
                  onChange={(x) => dispatch(new PirateCapturesChangedAction(x, p.id, roundIndex))}
                  roundIndex={roundIndex}
                  max={6 * (roundNumber)} // 5 pirates and 1 scary mary, * by the number of tricks
                />
              </td>
              <td>
                <NumberThing
                  value={round.skullKingsCaptured}
                  onChange={(x) => dispatch(new SkullKingsCapturedChangedAction(x, p.id, roundIndex))}
                  roundIndex={roundIndex}
                />
              </td>
              <td>{round.score}</td>
              <td><strong>{p.rounds.slice(0, roundNumber).reduce((acc, r) => acc + r.score, 0)}</strong></td>
            </tr>
          )
        })}
      </tbody>
    </table>
    </RoundCard>
  )
}

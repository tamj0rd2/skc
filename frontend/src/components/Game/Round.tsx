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


const NumberThingStyle = styled.div`
  button {
    width: 15px;
    padding: 0;
  }

  span {
    margin-left: 2px;
    margin-right: 2px;
  }

  input {
    display: inline-block;
    min-width: 10px;
    max-width: 20px;
    height: 20px;
  }
`

export const NumberThing: React.FC<NumberThingProps> = (props) => {
  return (
    // <NumberThingStyle>
    //   <button
    //     onClick={() => props.onChange((props.value || 0) - 1)}
    //     disabled={props.value === 0}
    //   >-</button>
    //   <span>{props.value ?? '?'}</span>
    //   <button
    //     onClick={() => props.onChange((props.value || 0) + 1)}
    //     disabled={(props.value ?? 0) >= (props.max ?? props.roundIndex + 1)}
    //   >+</button>
    // </NumberThingStyle>
    <NumberThingStyle>
      <input pattern="\d*" type="tel" onChange={(e) => props.onChange(e.target.value ? parseInt(e.target.value) : 0)} />
    </NumberThingStyle>
  )
}

interface RoundProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  roundIndex: number
}

const RoundCard = styled.section`
  margin-top: 10px;

  th {
    font-weight: normal;
  }
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
          <th></th>
          <th>Bet</th>
          <th>Wins</th>
          <th>Pirates</th>
          <th>SkullKs</th>
          <th>D</th>
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

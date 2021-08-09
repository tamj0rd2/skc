import React, { useReducer } from 'react'
import styled from 'styled-components'
import { RoundModule } from '../../components/Round'
import { ActualChangedAction, BetChangedAction, Player, State, stateReducer, Round } from '../../components/state'

const TableInput = styled.input`
  display: inline-block;
  width: 25px;
  height: 25px;
  margin: 2px;

  -moz-appearance:textfield;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  
  input,
  input::-webkit-input-placeholder {
    font-size:8px;
    line-height: 3;
  }
`

interface RoundInputForTable {
  state: Round
  onBetChange(v: number): void
  onActualChange(v: number): void
}

const RoundInputForTable: React.FC<RoundInputForTable> = (props) => {
  return (
    <td>
      <TableInput
        type="tel"
        pattern="\d*"
        value={props.state.bet ?? ''}
        placeholder="Bet"
        onChange={(e) =>props.onBetChange(parseInt(e.target.value))} />
        
      <TableInput
        type="tel"
        pattern="\d*"
        value={props.state.actual ?? ''}
        placeholder="Act"
        onChange={(e) => props.onActualChange(parseInt(e.target.value))} />
    </td>
  )
}

const Table = styled.table`
  border-collapse: collapse;

  th, td {
    border-left: 1px solid grey;
    border-right: 1px solid grey;
  }

  td {
    padding: 2px;
  }
`

const HomePage: React.FC = () => {
  const [state, dispatch] = useReducer<typeof stateReducer>(stateReducer, initialState)
  
  console.log({state})

  return (
    <>
      <h1>Skull king calculator</h1>
      <Table>
        <thead>
          <tr>
            <th>Round</th>
            {state.players.map((p, i) => <th key={i}>{p.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array(10).fill(0).map((_, roundIndex) => (
            <tr key={roundIndex}>
              <th>{roundIndex + 1}</th>
              {state.players.map((p) => (
                <RoundInputForTable
                  key={p.id}
                  state={p.rounds[roundIndex]}
                  onBetChange={(b) => dispatch(new BetChangedAction(b, p.id, roundIndex))}
                  onActualChange={(b) => dispatch(new ActualChangedAction(b, p.id, roundIndex))}
                />
              ))}
            </tr>
          ))}
          <tr>
            <th>Scores:</th>
            {state.players.map((p) =>
              <td key={p.id}>{p.rounds.reduce((accum, r) => accum + r.score, 0)}</td>
            )}
          </tr>
        </tbody>
      </Table>
      <RoundModule state={state} dispatch={dispatch} />
    </>
  )
}

export default HomePage

const initialState: State = {
  players: Array(6).fill(0).map<Player>((_, i) => ({
    rounds: Array(10).fill(0).map<Round>(() => 
      ({ actual: undefined, bet: undefined, bonus: 0, score: 0, piratesCaptured: 0, skullKingsCaptured: 0 })
    ),
    id: i + 1,
    name: `Player ${i + 1}`,
  }))
}

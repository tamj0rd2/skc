import React, { useReducer } from 'react'
import styled from 'styled-components'

const Input = styled.input`
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

interface RoundInput {
  state: Round
  onBetChange(v: number): void
  onActualChange(v: number): void
}

const RoundInput: React.FC<RoundInput> = (props) => {
  return (
    <td>
      <Input
        type="tel"
        pattern="\d*"
        value={props.state.bet ?? ''}
        placeholder="Bet"
        onChange={(e) =>props.onBetChange(parseInt(e.target.value))} />
        
      <Input
        type="tel"
        pattern="\d*"
        value={props.state.actual ?? ''}
        placeholder="Won"
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
                <RoundInput
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
    </>
  )
}

export default HomePage

const stateReducer = (state: State, action: Action): State => {
  console.log(action)

  const calcScore = (bet: number | undefined, actual: number | undefined, roundIndex: number): number => {
    const roundNumber = roundIndex + 1
    if (bet === undefined || actual === undefined) return 0
    if (bet === 0) return actual === 0 ? roundNumber * 10 : roundNumber * -10
    if (bet === actual) return bet * 20
    return Math.abs(bet - actual) * -10
  }

  if (action instanceof BetChangedAction) {
    const playerIndex = state.players.findIndex(p => p.id === action.playerId)
    if (playerIndex < 0) throw new Error('whaa')
    return {
      ...state,
      players: replace(state.players, playerIndex, (p) => ({
        ...p,
        rounds: replace(p.rounds, action.roundIndex, (r) => ({
          ...r, bet: action.bet, score: calcScore(action.bet, r.actual, action.roundIndex)
        }))
      }))
    }
  }

  if (action instanceof ActualChangedAction) {
    const playerIndex = state.players.findIndex(p => p.id === action.playerId)
    if (playerIndex < 0) throw new Error('whaa')
    return {
      ...state,
      players: replace(state.players, playerIndex, (p) => ({
        ...p,
        rounds: replace(p.rounds, action.roundIndex, (r) => ({
          ...r, actual: action.actual, score: calcScore(r.bet, action.actual, action.roundIndex)
        }))
      }))
    }
  }

  return state
}

const initialState: State = {
  players: Array(6).fill(0).map<Player>((_, i) => ({
    rounds: Array(10).fill({ bonus: 0, score: 0 }),
    id: i + 1,
    name: `Player ${i + 1}`,
  }))
}

interface Player {
  rounds: Round[]
  id: number
  name: string
}

interface State {
  players: Player[]
}

interface Round {
  bet: number | undefined
  actual: number | undefined
  bonus: number
  score: number
}

type Action = BetChangedAction | ActualChangedAction

class BetChangedAction {
  constructor(
    public readonly bet: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    if (isNaN(bet)) this.bet = undefined
  }
}

class ActualChangedAction {
  constructor(
    public readonly actual: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    if (isNaN(actual)) this.actual = undefined
  }
}

function replace<T>(items: T[], index: number, update: (item: T) => T) {
  const updatedArray = [...items]
  const updatedItem = update(items[index])
  updatedArray.splice(index, 1, updatedItem)
  return updatedArray
}

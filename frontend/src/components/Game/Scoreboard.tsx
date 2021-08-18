import React from "react"
import styled from "styled-components"
import { GameAction, GameState, BetChangedAction, TricksWonChangedAction, Round } from "./Game.state"

interface ScoreboardProps {
  dispatch: React.Dispatch<GameAction>
  state: GameState
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ dispatch, state }) => {
  return (
    <Table>
        <caption><strong>Scoreboard</strong></caption>
        <thead>
          <tr style={{ width: '10px' }}>
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
                  onWinCountChange={(b) => dispatch(new TricksWonChangedAction(b, p.id, roundIndex))}
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
      
  )
}

interface RoundInputForTable {
  state: Round
  onBetChange(v: number | undefined): void
  onWinCountChange(v: number | undefined): void
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
        value={props.state.won ?? ''}
        placeholder="Act"
        onChange={(e) => props.onWinCountChange(parseInt(e.target.value))} />
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

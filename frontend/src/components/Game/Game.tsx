import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import { NumberThing, RoundModule } from './Round'
import { TricksWonChangedAction, BetChangedAction, gameStateReducer, Round, createInitialState, Player, PirateCapturesChangedAction, SkullKingsCapturedChangedAction } from './Game.state'
import { useLocalState } from '../use-local-state'
import { Scoreboard } from './Scoreboard'


export const GAME_STATE_STORAGE_KEY = 'gamestate'

interface GameProps {
  players: {id: number, name: string}[]
  startOver(): void
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(3, auto);
`

const Section = styled.section`
  h4, strong {
    margin: 0;
    padding: 0;
  }
`

export const Game: React.FC<GameProps> = (props) => {
  const [state, dispatch] = useLocalState('gamestate', gameStateReducer, () => createInitialState(props.players))

  return (
    <>
      <h1>Skull King Calculator</h1>
      <button onClick={props.startOver}>Reset</button>
      {/* <Section>
        <h4>Round 1</h4>
        <Grid>
          {state.players.map((p) => {
            const roundIndex = 0
            return (
              <div>
                <strong>{p.name}</strong>
                <p>Bet: <NumberThing roundIndex={roundIndex} value={p.rounds[roundIndex].bet} onChange={(x) => dispatch(new BetChangedAction(x, p.id, 0))} /> </p>
                <p>Won: <NumberThing roundIndex={roundIndex} value={p.rounds[roundIndex].won} onChange={(x) => dispatch(new TricksWonChangedAction(x, p.id, 0))} /> </p>
                <p>Pirates: <NumberThing roundIndex={roundIndex} value={p.rounds[roundIndex].piratesCaptured} onChange={(x) => dispatch(new PirateCapturesChangedAction(x, p.id, 0))} /> </p>
                <p>Skull kings: <NumberThing roundIndex={roundIndex} value={p.rounds[roundIndex].skullKingsCaptured} onChange={(x) => dispatch(new SkullKingsCapturedChangedAction(x, p.id, 0))} /> </p>
              </div>
            )
          })}
        </Grid> */}
      {/* </Section> */}
      {Array(10).fill(0).map((_, i) => <RoundModule key={i} roundIndex={i} state={state} dispatch={dispatch} />)}
      <hr />
      <Scoreboard state={state} dispatch={dispatch} />
    </>
  )
}

import React from 'react'
import styled from 'styled-components'
import { appStateReducer, initialAppState, ResetAction, StartGameAction, Status } from '../components/App.state'
import { Game } from '../components/Game'
import { GamePrep } from '../components/Prep'
import { useLocalState } from '../components/use-local-state'

const Main = styled.main`
  font-family: Arial, Helvetica, sans-serif;
`

const HomePage: React.FC = () => {
  const [state, dispatch] = useLocalState('appstate', appStateReducer, () => initialAppState)

  console.log(state)

  return (
    <Main>
      {state.status === Status.Preparation && <GamePrep startGame={(players) => dispatch(new StartGameAction(players))} />}
      {state.status === Status.InGame && <Game players={state.players} startOver={() => dispatch(new ResetAction())} />}
    </Main>
  )
}

export default HomePage

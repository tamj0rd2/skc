import React from 'react'
import { appStateReducer, initialAppState, ResetAction, StartGameAction, Status } from '../components/App.state'
import { Game } from '../components/Game'
import { GamePrep } from '../components/Prep'
import { useLocalState } from '../components/use-local-state'

const HomePage: React.FC = () => {
  const [state, dispatch] = useLocalState('appstate', appStateReducer, () => initialAppState)

  console.log(state)

  if (state.status === Status.Preparation) return <GamePrep startGame={(players) => dispatch(new StartGameAction(players))} />
  if (state.status === Status.InGame) return <Game players={state.players} startOver={() => dispatch(new ResetAction())} />
  return <h1>unhandled status {state.status}</h1>
}

export default HomePage

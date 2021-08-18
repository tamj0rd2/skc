export enum Status {
  Preparation = 'Preparation',
  InGame = 'InGame'
}

export interface AppState {
  status: Status
  players: { id: number, name: string }[]
}

export type AppAction = StartGameAction | ResetAction

export const initialAppState: AppState = {
  status: Status.Preparation,
  players: []
}

export const appStateReducer = (state: AppState, action: AppAction): AppState => {
  if (action instanceof StartGameAction)
    return {...state, status: Status.InGame, players: action.playerNames.map((name, id) => ({ name, id })) }
  
  if (action instanceof ResetAction)
    return {...initialAppState}

  throw new Error(`Unhandled action type ${JSON.stringify(action)}`)
}

export class StartGameAction {
  constructor (public readonly playerNames: string[]) {}
}

export class ResetAction {}

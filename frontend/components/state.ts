export const createInitialState = (): State => ({
  players: Array(6).fill(0).map<Player>((_, i) => ({
    rounds: Array(10).fill(0).map<Round>(() => 
      ({ actual: undefined, bet: undefined, bonus: 0, score: 0, piratesCaptured: 0, skullKingsCaptured: 0 })
    ),
    id: i + 1,
    name: `Player ${i + 1}`,
  }))
})


export const stateReducer = (state: State, action: Action): State => {
  console.log(action)

  type Calc = Omit<Round, 'bonus' | 'score'> & { roundIndex: number }

  const calcScore = ({ bet, actual, roundIndex, skullKingsCaptured, piratesCaptured }: Calc): number => {
    const roundNumber = roundIndex + 1
    if (bet === undefined || actual === undefined) return 0
    
    const bonus = (piratesCaptured * 30) + (skullKingsCaptured * 50)
    if (bet === 0) return bonus + (actual === 0 ? roundNumber * 10 : roundNumber * -10)
    if (bet === actual) return bonus + (bet * 20)
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
          ...r,
          bet: action.bet,
          score: calcScore({ ...r,  bet: action.bet, roundIndex: action.roundIndex })
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
          ...r,
          actual: action.actual,
          score: calcScore({ ...r, actual: action.actual, roundIndex: action.roundIndex })
        }))
      }))
    }
  }

  if (action instanceof PirateCapturesChangedAction) {
    const playerIndex = state.players.findIndex(p => p.id === action.playerId)
    if (playerIndex < 0) throw new Error('whaa')
    return {
      ...state,
      players: replace(state.players, playerIndex, (p) => ({
        ...p,
        rounds: replace(p.rounds, action.roundIndex, (r) => ({
          ...r,
          piratesCaptured: action.count,
          score: calcScore({ ...r, piratesCaptured: action.count, roundIndex: action.roundIndex })
        }))
      }))
    }
  }

  if (action instanceof SkullKingsCapturedChangedAction) {
    const playerIndex = state.players.findIndex(p => p.id === action.playerId)
    if (playerIndex < 0) throw new Error('whaa')
    return {
      ...state,
      players: replace(state.players, playerIndex, (p) => ({
        ...p,
        rounds: replace(p.rounds, action.roundIndex, (r) => ({
          ...r,
          skullKingsCaptured: action.count,
          score: calcScore({ ...r, skullKingsCaptured: action.count, roundIndex: action.roundIndex })
        }))
      }))
    }
  }

  if (action instanceof ResetGameAction) {
    return createInitialState()
  }

  throw new Error(`Unhandled action type ${JSON.stringify(action)}`)
}

export interface State {
  players: Player[]
}

export interface Player {
  rounds: Round[]
  id: number
  name: string
}

export interface Round {
  bet: number | undefined
  actual: number | undefined
  bonus: number
  piratesCaptured: number
  skullKingsCaptured: number
  score: number
}

export type Action = BetChangedAction
  | ActualChangedAction
  | PirateCapturesChangedAction
  | SkullKingsCapturedChangedAction
  | ResetGameAction

export class BetChangedAction {
  constructor(
    public readonly bet: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    if (isNaN(bet)) this.bet = undefined
  }
}

export class ActualChangedAction {
  constructor(
    public readonly actual: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    if (isNaN(actual)) this.actual = undefined
  }
}

export class PirateCapturesChangedAction {
  constructor(
    public readonly count: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    if (isNaN(count)) this.count = undefined
  }
}

export class SkullKingsCapturedChangedAction {
  constructor(
    public readonly count: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    if (isNaN(count)) this.count = undefined
  }
}

export class ResetGameAction {}

function replace<T>(items: T[], index: number, update: (item: T) => T) {
  const updatedArray = [...items]
  const updatedItem = update(items[index])
  updatedArray.splice(index, 1, updatedItem)
  return updatedArray
}

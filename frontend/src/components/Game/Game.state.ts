export const createInitialState = (playerNames: {name: string, id: number}[]): GameState => ({
  players: playerNames.map<Player>((p) => ({
    ...p,
    rounds: Array(10).fill(0).map<Round>(() => 
      ({ won: undefined, bet: undefined, bonus: 0, score: 0, piratesCaptured: 0, skullKingsCaptured: 0 })
    ),
  }))
})


export const gameStateReducer = (state: GameState, action: GameAction): GameState => {
  type Calc = Omit<Round, 'bonus' | 'score'> & { roundIndex: number }

  const calcScore = ({ bet, won, roundIndex, skullKingsCaptured, piratesCaptured }: Calc): number => {
    const roundNumber = roundIndex + 1
    if (bet === undefined || won === undefined) return 0
    
    const bonus = (piratesCaptured * 30) + (skullKingsCaptured * 50)
    if (bet === 0) return won === 0 ? bonus + (roundNumber * 10) : roundNumber * -10
    if (bet === won) return bonus + (bet * 20)
    return Math.abs(bet - won) * -10
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

  if (action instanceof TricksWonChangedAction) {
    const playerIndex = state.players.findIndex(p => p.id === action.playerId)
    if (playerIndex < 0) throw new Error('whaa')
    return {
      ...state,
      players: replace(state.players, playerIndex, (p) => ({
        ...p,
        rounds: replace(p.rounds, action.roundIndex, (r) => ({
          ...r,
          won: action.tricksWon,
          score: calcScore({ ...r, won: action.tricksWon, roundIndex: action.roundIndex })
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

  throw new Error(`Unhandled action type ${JSON.stringify(action)}`)
}

export interface GameState {
  players: Player[]
}

export interface Player {
  rounds: Round[]
  id: number
  name: string
}

export interface Round {
  bet: number | undefined
  won: number | undefined
  bonus: number
  piratesCaptured: number
  skullKingsCaptured: number
  score: number
}

export type GameAction = BetChangedAction
  | TricksWonChangedAction
  | PirateCapturesChangedAction
  | SkullKingsCapturedChangedAction

export class BetChangedAction {
  constructor(
    public readonly bet: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    if (bet && isNaN(bet)) this.bet = undefined
  }
}

export class TricksWonChangedAction {
  constructor(
    public readonly tricksWon: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    if (tricksWon && isNaN(tricksWon)) this.tricksWon = undefined
  }
}

export class PirateCapturesChangedAction {
  public readonly count: number
  constructor(
    changedValue: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    this.count = changedValue && !isNaN(changedValue) ? changedValue : 0
  }
}

export class SkullKingsCapturedChangedAction {
  public readonly count: number
  constructor(
    changedValue: number | undefined,
    public readonly playerId: number,
    public readonly roundIndex: number
  ) {
    this.count = changedValue && !isNaN(changedValue) ? changedValue : 0
  }
}

function replace<T>(items: T[], index: number, update: (item: T) => T) {
  const updatedArray = [...items]
  const updatedItem = update(items[index])
  updatedArray.splice(index, 1, updatedItem)
  return updatedArray
}

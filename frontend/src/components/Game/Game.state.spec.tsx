import { TricksWonChangedAction, BetChangedAction, createInitialState, GameAction, GameState, gameStateReducer, PirateCapturesChangedAction, Round, SkullKingsCapturedChangedAction } from "./Game.state"

it('can track a players bets and scores correctly', () => {
  let currentState: GameState = createInitialState([{ id: 123, name: 'Tam' }])

  const getScore = (action: GameAction) => {
    currentState = gameStateReducer(currentState, action)
    const player = currentState.players.find(x => x.id === action.playerId)!
    const currentRound = player.rounds[action.roundIndex]
    return {
      bet: currentRound.bet,
      won: currentRound.won,
      total: player.rounds.reduce((acc, r) => acc + r.score, 0)
    }
  }

  const setBet = ({ val, round }: { val: number, round: number }) => {
    return getScore(new BetChangedAction(val, 123, round - 1))
  }

  const setTricksWon = ({ val, round }: { val: number, round: number }) => {
    return getScore(new TricksWonChangedAction(val, 123, round - 1))
  }

  const setPiratesCaptured = ({ val, round }: { val: number, round: number }) => {
    return getScore(new PirateCapturesChangedAction(val, 123, round - 1))
  }

  const setSkullKingsCaptured = ({ val, round }: { val: number, round: number }) => {
    return getScore(new SkullKingsCapturedChangedAction(val, 123, round - 1))
  }

  // won non-0 bet with capture
  expect(setBet({ round: 1, val: 1 })).toEqual({  bet: 1, total: 0 })
  expect(setTricksWon({ round: 1, val: 1 })).toEqual({  bet: 1, won: 1, total: 20 })
  expect(setPiratesCaptured({ round: 1, val: 1 })).toEqual({  bet: 1, won: 1, total: 50 })

  // won 0 bet with capture
  expect(setBet({ round: 2, val: 0 })).toEqual({ bet: 0, total: 50 })
  expect(setTricksWon({ round: 2, val: 0 })).toEqual({ bet: 0, won: 0, total: 70 })
  expect(setSkullKingsCaptured({ round: 2, val: 1 })).toEqual({ bet: 0, won: 0, total: 120 })

  // lost 0 bet with 2 captures
  expect(setBet({ round: 3, val: 0 })).toEqual({ bet: 0, total: 120 })
  expect(setTricksWon({ round: 3, val: 2 })).toEqual({ bet: 0, won: 2, total: 90 })
  expect(setPiratesCaptured({ round: 3, val: 1 })).toEqual({ bet: 0, won: 2, total: 90 })
  expect(setSkullKingsCaptured({ round: 3, val: 1 })).toEqual({ bet: 0, won: 2, total: 90 })

  // won non-0 bet with 2 captures
  expect(setBet({ round: 4, val: 4 })).toEqual({ bet: 4, total: 90 })
  expect(setTricksWon({ round: 4, val: 4 })).toEqual({ bet: 4, won: 4, total: 170 })
  expect(setPiratesCaptured({ round: 4, val: 2 })).toEqual({ bet: 4, won: 4, total: 230 })
  
  // lost non-0 bet with capture
  expect(setBet({ round: 5, val: 2 })).toEqual({ bet: 2, total: 230 })
  expect(setTricksWon({ round: 5, val: 3 })).toEqual({ bet: 2, won: 3, total: 220 })
  expect(setSkullKingsCaptured({ round: 5, val: 1 })).toEqual({ bet: 2, won: 3, total: 220 })

  // won non-0 without capture
  expect(setBet({ round: 6, val: 1 })).toEqual({ bet: 1, total: 220 })
  expect(setTricksWon({ round: 6, val: 1 })).toEqual({ bet: 1, won: 1, total: 240 })

  // lost 0 without capture
  expect(setBet({ round: 7, val: 0 })).toEqual({ bet: 0, total: 240 })
  expect(setTricksWon({ round: 7, val: 1 })).toEqual({ bet: 0, won: 1, total: 170 })

  // won 0 without capture
  expect(setBet({ round: 8, val: 0 })).toEqual({ bet: 0, total: 170 })
  expect(setTricksWon({ round: 8, val: 0 })).toEqual({ bet: 0, won: 0, total: 250 })
})

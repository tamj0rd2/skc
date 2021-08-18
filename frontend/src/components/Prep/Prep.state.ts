interface GamePrepState {
  players: string[];
  playerInput: string;
}
export const gamePrepReducer = (state: GamePrepState, action: GamePrepAction): GamePrepState => {
  if (action instanceof AddPlayerAction) {
    return { ...state, players: [...state.players, action.name], playerInput: '' };
  }

  if (action instanceof RemovePlayerAction) {
    const updatedPlayers = [...state.players];
    const playerIndex = updatedPlayers.indexOf(action.name);
    if (playerIndex < 0)
      throw new Error('NANI?!');
    updatedPlayers.splice(playerIndex, 1);

    return { ...state, players: updatedPlayers };
  }

  if (action instanceof PlayerInputChangeAction) {
    return { ...state, playerInput: action.value };
  }

  throw new Error(`Unknown action type ${JSON.stringify(action)}`);
};
type GamePrepAction = AddPlayerAction | RemovePlayerAction | PlayerInputChangeAction;
export class AddPlayerAction {
  constructor(public readonly name: string) { }
}
export class RemovePlayerAction {
  constructor(public readonly name: string) { }
}
export class PlayerInputChangeAction {
  constructor(public readonly value: string) { }
}
export interface GamePrepProps {
  startGame(players: string[]): void;
}

export const initialPrepState: GamePrepState = {
  playerInput: '',
  players: []
};

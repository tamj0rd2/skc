import React, { useEffect, useReducer } from "react"

export const useLocalState = <S, A>(
    stateKey: string,
    reducer: (state: S, action: A) => S,
    createInitialState: () => S
  ): [S, React.Dispatch<A>] => {
  const storedState = global.localStorage?.getItem(stateKey)
  const [state, dispatch] = useReducer(reducer, storedState ? JSON.parse(storedState) : createInitialState())
  // console.log(stateKey, state)

  useEffect(() => localStorage.setItem(stateKey, JSON.stringify(state)))
  useEffect(() => () => localStorage.removeItem(stateKey), [])

  return [state, dispatch]
}

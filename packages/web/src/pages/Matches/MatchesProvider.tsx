import React from 'react';
import { createUseCRUDReducer } from '../../hooks/crud';
import { Match } from '../../typings';

const useMatchesReducer = createUseCRUDReducer<Match, 'matchID'>('matchID', {
  prefill: false
});

type Args = ReturnType<typeof useMatchesReducer>;

const StateContext = React.createContext({} as Args[0]);
const ActionContext = React.createContext({} as Args[1]);

export function useMatchesActions() {
  return React.useContext(ActionContext);
}

export function useMatchesState() {
  return React.useContext(StateContext);
}

export function useMatches() {
  return [useMatchesState(), useMatchesActions()] as const;
}

export const MatchesProvider: React.FC = ({ children }) => {
  const [state, actions] = useMatchesReducer();

  return (
    <StateContext.Provider value={state}>
      <ActionContext.Provider value={actions}>
        {children}
      </ActionContext.Provider>
    </StateContext.Provider>
  );
};

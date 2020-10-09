import React, { useState, ProviderProps, useEffect, useRef } from 'react';
import { createBoardgameStorage } from '../utils/storage';

export interface PreferencesState {
  theme: Theme;
  screenWidth: ScreenWidth;
  playerName: string;
  polling?: boolean;
}

const initialState: PreferencesState = {
  playerName: '',
  polling: true,
  theme: typeof window === 'undefined' ? 'dark' : window.__initialTheme,
  screenWidth:
    typeof window === 'undefined' ? 'limited' : window.__initialScreenWidth
};

export const preferencesStorage = createBoardgameStorage<PreferencesState>(
  'BOARDGAME_PREFERENCE',
  initialState
);

type Actions = React.Dispatch<React.SetStateAction<PreferencesState>>;

const StateContext = React.createContext({} as PreferencesState);
const ActionsContext = React.createContext({} as Actions);

export function usePreferencesState() {
  return React.useContext(StateContext);
}

export function usePreferencesAction() {
  return React.useContext(ActionsContext);
}

export function usePreferences() {
  return [usePreferencesState(), usePreferencesAction()] as const;
}

export const PreferencesProvider: React.FC = ({ children }) => {
  const [preferences, setPreferences] = useState<PreferencesState>(
    initialState
  );
  const previous = useRef(preferences);

  useEffect(() => {
    const value = preferencesStorage.get();
    setPreferences(value);
  }, []);

  useEffect(() => {
    // mainly for big-two
    if (previous.current.screenWidth !== preferences.screenWidth) {
      window.dispatchEvent(new Event('resize'));
      window.__setScreenWidth(preferences.screenWidth);
    }

    if (previous.current.theme !== preferences.theme) {
      window.__setTheme(preferences.theme);
    }

    preferencesStorage.save(preferences);

    previous.current = preferences;
  }, [preferences]);

  return React.createElement<ProviderProps<PreferencesState>>(
    StateContext.Provider,
    { value: preferences },
    React.createElement<ProviderProps<Actions>>(
      ActionsContext.Provider,
      {
        value: setPreferences
      },
      children
    )
  );
};

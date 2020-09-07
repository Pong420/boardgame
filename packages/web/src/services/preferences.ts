import React, { useState, ProviderProps, useEffect } from 'react';
import { createLocalStorage } from '../utils/storage';

export type Theme = 'light' | 'dark';
export type ScreenWidth = 'stretch' | 'limited';

export interface PreferencesState {
  theme: Theme;
  screenWidth: ScreenWidth;
  playerName: string;
  polling?: boolean;
}

export const BOARDGAME_THEME = 'BOARDGAME_THEME';

export const themeStorage = createLocalStorage<Theme>(BOARDGAME_THEME, 'dark');

export const preferencesStorage = createLocalStorage<PreferencesState>(
  'BOARDGAME_PREFERENCE',
  {
    playerName: '',
    screenWidth: 'limited',
    polling: true,
    theme: themeStorage.get()
  }
);

export function handleTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList[theme === 'dark' ? 'add' : 'remove'](
      'bp3-dark'
    );
  }
}

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
    preferencesStorage.get()
  );

  useEffect(() => {
    handleTheme(preferences.theme);
    preferencesStorage.save(preferences);
    themeStorage.save(preferences.theme);
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

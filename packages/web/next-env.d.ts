/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.svg';
declare module '*.png';

type Theme = 'light' | 'dark';
type ScreenWidth = 'stretch' | 'limited';

declare interface Window {
  __setTheme: (theme: Theme) => void;
  __setScreenWidth: (theme: ScreenWidth) => void;

  __initialTheme: Theme;
  __initialScreenWidth: ScreenWidth;
}

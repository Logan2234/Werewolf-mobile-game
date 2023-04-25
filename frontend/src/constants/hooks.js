import { createContext } from 'react';

// Provider used in Home.js
export const ScreenContext = createContext(null);
export const TokenContext = createContext(null);

// Provider used in GameView.js
export const CurrentGameView = createContext(null);
import { createContext } from 'react';

/**
 * Liste des hooks utilisés dans l'application
 */

// Provider used in Home.js
export const ScreenContext = createContext(null);
export const TokenContext = createContext(null);

// Provider used in GameView.js
export const CurrentGameView = createContext(null);
import React, { useState } from 'react';
import Menu from './components/Menu';
import Canvas from './components/Canvas';
import { Container } from '@mui/material';
import { MatchEndState } from './interfaces/sharedInterfaces';

const App: React.FC = (): React.ReactElement => {
  const [view, setView] = useState< 'menu' | 'battle' | 'preBattle' | 'afterBattle'>('menu'); 
  const [playerRig, setPlayerRig] = useState<string>('Amazonas');
  const [opponentRig, setOpponentRig] = useState<string>('Bullterrier');
  const [endOfTheMatch, setEndOfTheMatch] = useState<MatchEndState | null>(null);


  return (
    <Container>
      {
        (view === 'menu') ?
        <>
          <Menu 
            setView={setView}
            playerRig={playerRig}
            opponentRig={opponentRig}
            setPlayerRig={setPlayerRig}
            setOpponentRig={setOpponentRig}
          />
        </> : <></>
      }
      {
        (
          view === 'battle' ||
          view === 'preBattle' ||
          view === 'afterBattle'
        ) ?
        <>
          <Canvas 
            setView={setView}
            view={view}
            playerRig={playerRig}
            opponentRig={opponentRig}
            setEndOfTheMatch={setEndOfTheMatch}
            endOfTheMatch={endOfTheMatch}
          />
        </> : <></>
      }
    </Container>
  );

}

export default App;

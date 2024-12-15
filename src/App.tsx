import React, { useState } from 'react';
import Menu from './components/Menu';
import Canvas from './components/Canvas';
import { Container } from '@mui/material';

const App: React.FC = (): React.ReactElement => {
  const [view, setView] = useState< 'menu' | 'canvas' | 'afterBattle'>('menu'); 

  return (
    <Container>
      {
        (view === 'menu') ?
        <>
          <Menu 
            setView={setView}
          />
        </> : <></>
      }
      {
        (view === 'canvas') ?
        <>
          <Canvas />
        </> : <></>
      }
    </Container>
  );

}

export default App;

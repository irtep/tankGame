import { Button, Container, Typography } from '@mui/material';
import React, { useState } from 'react';

interface PreMatchProps {
  setView: React.Dispatch<React.SetStateAction<'menu' | 'battle' | 'preBattle' | 'afterBattle'>>;
}

const PreMatch: React.FC<PreMatchProps> = ({setView}) => {

  return (
    <Container
      sx={{
        background: 'black',
        color: 'red'
      }}
    >
      <Typography margin="10">
        <strong>
          Move rig:<br /><br />
        </strong>
        <span style={{ color: 'darkRed', fontWeight: 'bold' }}>
          {`Gas: `}
        </span>
        Arrow Up / W <br />
        <span style={{ color: 'darkRed', fontWeight: 'bold' }}>
          {`Break/Reverse: `}
        </span>
        Arrow Down / S <br />
        <span style={{ color: 'darkRed', fontWeight: 'bold' }}>
          {`Turn left: `}
        </span>
        Arrow Left / A <br />
        <span style={{ color: 'darkRed', fontWeight: 'bold' }}>
          {`Turn right: `}
        </span>
        Arrow Right / D <br />
        <span style={{ color: 'darkRed', fontWeight: 'bold' }}>
          {`fire: `} <br />
        </span>
        <span style={{ color: 'darkRed', fontWeight: 'bold' }}>
          left click
        </span> fires to direction where your mouse points.<br />
        if your opponent is directly ahead of you all weapons are fired,<br />
        if opponent is somewhere else, only turret weapon is fired.
        <br /><br />
        Match ends when any of rig is charred (has no hit points left)
      </Typography>
      <Typography margin="10">
        Your Rig starts at right bottom corner, be ready!
      </Typography>
      <Button
        sx={{
          margin: 10,
          background: 'red',
          color: 'black'
        }}
        onClick={() => setView('battle')}
      >Click this to start the battle</Button>
    </Container>
  );
};

export default PreMatch;
import React from 'react';
import { Box, Button, MenuItem, Select } from '@mui/material';
import { Vehicle } from '../interfaces/sharedInterfaces';
import { rigs } from '../constants/rigs';
import { getRigByName } from '../functions/utils';
import Footer from './Footer';
import DescOfRig from './DescOfRig';

interface MenuProps {
  setView: React.Dispatch<React.SetStateAction<'menu' | 'battle' | 'preBattle' | 'afterBattle'>>;
  playerRig: string;
  opponentRig: string;
  setPlayerRig: React.Dispatch<React.SetStateAction<string>>;
  setOpponentRig: React.Dispatch<React.SetStateAction<string>>;
};

const Menu: React.FC<MenuProps> = ({
  setView,
  playerRig,
  opponentRig,
  setPlayerRig,
  setOpponentRig
}) => {

  const pRig: Vehicle | undefined = getRigByName(playerRig);
  const oRig: Vehicle | undefined = getRigByName(opponentRig);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      p: 3,
      background: 'black',
      color: 'red'
    }}>
      {/* Left Column: Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <h3>Select Your Rig</h3>
        <Select
          value={playerRig}
          onChange={(e) => setPlayerRig(e.target.value)}
          sx={{
            mb: 2,
            background: 'gray',
            color: 'white'
          }}
        >
          {rigs.map((rig: Vehicle, i: number) => (
            <MenuItem key={`pRig ${i}`} value={rig.name}>
              {rig.name}
            </MenuItem>
          ))}
        </Select>

        <h3>Select Opponents Rig</h3>
        <Select
          value={opponentRig}
          onChange={(e) => setOpponentRig(e.target.value)}
          sx={{
            mb: 2,
            background: 'gray',
            color: 'white'
          }}
        >
          {rigs.map((rig: Vehicle, i: number) => (
            <MenuItem
              key={`oRig ${i}`}
              value={rig.name}
              sx={{
                borderColor: 'red'
              }}
            >
              {rig.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          sx={{
            background: 'red',
            color: 'black'
          }}
          onClick={() => {
            setView('preBattle');
          }}
        >Play</Button>
      </Box>

      {/* Right Column: Selected rigs */}
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          gap: 2,
        }}
      >
        <Box sx={{ border: '1px solid #ccc', p: 2 }}>
          <DescOfRig
            rigOfWho={playerRig}
            rig={pRig}
          />
        </Box>
        <Box sx={{ border: '1px solid #ccc', p: 2 }}>
          <DescOfRig
            rigOfWho={opponentRig}
            rig={oRig}
          />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Menu;

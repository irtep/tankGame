import React from 'react';
import { Box, Button } from '@mui/material';

interface MenuProps {
  setView: any;
};

const Menu: React.FC<MenuProps> = ({ setView }) => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, p: 3 }}>
      {/* Left Column: Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >

        <Button
          onClick={() => {
            setView('canvas');
          }}
        >race</Button>
      </Box>

      {/* Right Column: Lap Records */}
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 2,
        }}
      >
        <Box sx={{ border: '1px solid #ccc', p: 2 }}>
          <h4>Track 1</h4>
          {/* Placeholder for Track 1 lap records */}
        </Box>
        <Box sx={{ border: '1px solid #ccc', p: 2 }}>
          <h4>Track 2</h4>
          {/* Placeholder for Track 2 lap records */}
        </Box>
        <Box sx={{ border: '1px solid #ccc', p: 2 }}>
          <h4>Track 3</h4>
          {/* Placeholder for Track 3 lap records */}
        </Box>
        <Box sx={{ border: '1px solid #ccc', p: 2 }}>
          <h4>Track 4</h4>
          {/* Placeholder for Track 4 lap records */}
        </Box>
      </Box>
    </Box>
  );
};

export default Menu;

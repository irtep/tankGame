import React, { useState } from 'react';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select, Button } from '@mui/material';
import { colorOptions, raceTypes } from '../constants/menuConstants';
import { vehicles } from '../constants/carsAndAccessories';
import { Vehicle } from '../interfaces/vehicleInterfaces';

interface MenuProps {
  setView: any;
};

const Menu: React.FC<MenuProps> = ({setView}) => {
  const [name, setName] = useState<String>('');
  const [car, setCar] = useState<String>('');
  const [color1, setColor1] = useState<String>('');
  const [color2, setColor2] = useState<String>('');
  const [raceType, setRaceType] = useState<String>('');

  const handleSubmit = () => {
    console.log('Form Data:', { name, car, color1, color2, raceType });
  };

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
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Car</InputLabel>
          <Select
            value={car}
            onChange={(e) => setCar(e.target.value)}
            label="Car"
          >
            {vehicles.map((option: Vehicle, i: number) => (
              <MenuItem key={`${option.name} ${i}`} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Color 1</InputLabel>
          <Select
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            label="Color 1"
          >
            {colorOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Color 2</InputLabel>
          <Select
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            label="Color 2"
          >
            {colorOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Race Type</InputLabel>
          <Select
            value={raceType}
            onChange={(e) => setRaceType(e.target.value)}
            label="Race Type"
          >
            {raceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button
          onClick={ () => {
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

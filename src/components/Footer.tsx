import { Container, Typography } from '@mui/material';
import React from 'react';

const Footer: React.FC = (): React.ReactElement => {

    return (
      <Container sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundImage: "linear-gradient(to right, rgb(0,0,70), black, black)",
        color: "red",
        borderRadius: 2,
        margin: 1,
        padding: 1
      }}>
        <Typography>
          Version: Test: 0.1.0
        </Typography>
      </Container>
    );
  }

export default Footer;
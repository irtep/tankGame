import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { MatchEndState } from '../interfaces/sharedInterfaces';

interface AfterMatchProps {
    setView: React.Dispatch<React.SetStateAction<'menu' | 'battle' | 'preBattle' | 'afterBattle'>>;
    message: string;
    endOfTheMatch: MatchEndState | null;
}

const AfterMatch: React.FC<AfterMatchProps> = ({
    setView,
    message
}) => {

    return (
        <Typography
            sx={{
                color: 'red'
            }}
        >
            {message}<br /><br />

            <button onClick={() => setView('battle')}>Play again</button>
            <button onClick={() => setView('menu')}>Back to menu</button>
        </Typography>
    );
};

export default AfterMatch;
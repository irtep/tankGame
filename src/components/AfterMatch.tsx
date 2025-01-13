import { Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { MatchEndState, VehicleWithRole } from '../interfaces/sharedInterfaces';
import draw from '../functions/draw';
import { arenaHeight, arenaWidth } from '../constants/measures';

interface AfterMatchProps {
    setView: React.Dispatch<React.SetStateAction<'menu' | 'battle' | 'preBattle' | 'afterBattle'>>;
    message: string;
    endOfTheMatch: MatchEndState | null;
}

const AfterMatch: React.FC<AfterMatchProps> = ({
    setView,
    message,
    endOfTheMatch }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;    
        
        if (canvas && endOfTheMatch !== null) {
            canvas.width = arenaWidth;
            canvas.height = arenaHeight;
            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

            // Check for vehicles with 0 or fewer hit points
            const destroyedRigs = endOfTheMatch.gameObject.vehicles.filter(
                (v: VehicleWithRole) => v.vehicle.hitPoints <= 0
            );

            // Push damaged vehicle coordinates to hits
            destroyedRigs.forEach((damagedVehicle) => {
                endOfTheMatch.gameObject.hits.push({
                    x: damagedVehicle.vehicle.x, // Assuming x is the coordinate
                    y: damagedVehicle.vehicle.y, // Assuming y is the coordinate
                    damage: 3
                });
            });

            if (ctx) {
                draw(ctx,
                    canvas,
                    endOfTheMatch.gameObject.vehicles.map((v: VehicleWithRole) => v.vehicle),
                    endOfTheMatch.gameObject.hits,
                    endOfTheMatch.gameObject.bullets,
                    endOfTheMatch.gameObject.radars,
                    endOfTheMatch.gameObject.mouseNowX,
                    endOfTheMatch.gameObject.mouseNowY
                );
            }
        }
    });

    return (
        <Typography
            sx={{
                color: 'red'
            }}
        >
            {message}<br /><br />

            <button onClick={() => setView('battle')}>Play again</button>
            <button onClick={() => setView('menu')}>Back to menu</button>

            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    border: '1px solid black',
                    //background: '#9A7B4D',
                    backgroundImage: `url(${process.env.PUBLIC_URL}/img/desert1.png)`,
                    backgroundSize: 'cover', // Or 'contain', '100% 100%' for specific sizing
                    backgroundRepeat: 'no-repeat', // Avoid tiling the image
                    marginLeft: 0,
                    marginRight: 0,
                }}
            />
        </Typography >
    );
};

export default AfterMatch;
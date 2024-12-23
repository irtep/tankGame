import React, { useEffect, useRef, useState } from 'react';
import draw from '../functions/draw';
import { arenaHeight, arenaWidth, deceleration } from '../constants/measures';
import { obstacles } from '../constants/obstacles';
import { Bullet, Hit, MatchEndState, Obstacle, Vehicle, VehicleWithRole, Weapon } from '../interfaces/sharedInterfaces';
import { getRigByName } from '../functions/utils';
import { isRotatedRectColliding } from '../functions/collisionDetect';
import { fireWeapon } from '../functions/fireWeapon';
import { weapons } from '../constants/weapons';
import { placeHolder1, placeHolder2 } from '../constants/rigs';
import { updateRigMovement } from '../functions/updateRigMovement';
import { getAIInput } from '../functions/aiFunctions';
import { reloadWeapons } from '../functions/reloadWeapons';

interface CanvasProps {
  setView: React.Dispatch<React.SetStateAction<'menu' | 'battle' | 'preBattle' | 'afterBattle'>>;
  view: 'menu' | 'battle' | 'preBattle' | 'afterBattle';
  playerRig: string;
  opponentRig: string;
  setEndOfTheMatch: React.Dispatch<React.SetStateAction<MatchEndState | null>>;
}

const Canvas: React.FC<CanvasProps> = ({
  setView,
  view,
  playerRig,
  opponentRig,
  setEndOfTheMatch
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = arenaWidth;
    canvas.height = arenaHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bullets: Bullet[] = [];

    const vehicles: { vehicle: Vehicle; role: 'player' | 'ai' }[] = [
      // place holders, test Rig and ai Rig
      placeHolder1,
      placeHolder2
    ];

    // updates Rig objects to match selected rigs
    const pRig = getRigByName(playerRig);
    const oRig = getRigByName(opponentRig);

    if (pRig && oRig) {
      vehicles[0].vehicle = {
        ...pRig,
        x: 600,
        y: 500,
        velocityX: 0,
        velocityY: 0
      };
      vehicles[1].vehicle = {
        ...oRig,
        x: 150,
        y: 150,
        velocityX: 0,
        velocityY: 0
      };
    }

    const hits: Hit[] = [];

    // Keyboard state
    const keys: { [key: string]: boolean } = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    // Event listeners for keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const playerRig = vehicles.find(v => v.role === 'player')?.vehicle;

      if (playerRig) {
        const angle: number = Math.atan2(mouseY - playerRig.y, mouseX - playerRig.x);
        const shootingGun: Weapon | undefined = weapons.find(w => w.name === playerRig.weapons.turretGun?.name);

        // players shooting
        if (shootingGun && playerRig.weapons.turretGun?.cooldown === 0) {
          bullets = fireWeapon(
            {
              x: playerRig.x,
              y: playerRig.y,
              angle: angle,
            },
            shootingGun,
            bullets,
            'player',
            playerRig
          );
        };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handleMouseDown);

    const update = () => {
      const playerRig: Vehicle | undefined = vehicles.find(v => v.role === 'player')?.vehicle;
      const aiRig: Vehicle | undefined = vehicles.find(v => v.role === 'ai')?.vehicle;

      if (!playerRig || !aiRig) return;
      
      updateRigMovement(playerRig, keys, obstacles, aiRig, deceleration);
      const aiKeys = getAIInput(aiRig, playerRig, obstacles);
      updateRigMovement(aiRig, aiKeys, obstacles, playerRig, deceleration);

      // AI shoots
      if (aiRig.weapons.turretGun?.cooldown === 0) {
        const angle: number = Math.atan2(playerRig.y - aiRig.y, playerRig.x - aiRig.x);
        const shootingGun: Weapon | undefined = weapons.find(w => w.name === aiRig.weapons.turretGun?.name);

        if (shootingGun && aiRig.weapons.turretGun?.cooldown === 0) {
          bullets = fireWeapon(
            {
              x: aiRig.x,
              y: aiRig.y,
              angle: angle
            },
            shootingGun,
            bullets,
            'ai',
            aiRig
          );
        };
      }

      // Update bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        // Move bullet
        bullet.x += Math.cos(bullet.angle) * bullet.speed; // Adjust speed as needed
        bullet.y += Math.sin(bullet.angle) * bullet.speed;

        // Check collision with player
        if (
          bullet.owner === 'ai' &&
          isRotatedRectColliding(
            { x: bullet.x - 2.5, y: bullet.y - 2.5, width: bullet.size + 3, height: bullet.size + 3, angle: 0 },
            { x: playerRig.x - playerRig.width / 2, y: playerRig.y - playerRig.height / 2, width: playerRig.width, height: playerRig.height, angle: playerRig.angle }
          )
        ) {
          playerRig.hitPoints -= bullet.damage;
          bullets.splice(i, 1); // Remove the bullet
          continue;
        }

        // Check collision with AI
        if (
          bullet.owner === 'player' &&
          isRotatedRectColliding(
            { x: bullet.x - 2.5, y: bullet.y - 2.5, width: bullet.size, height: bullet.size, angle: 0 },
            { x: aiRig.x - aiRig.width / 2, y: aiRig.y - aiRig.height / 2, width: aiRig.width, height: aiRig.height, angle: aiRig.angle }
          )
        ) {
          aiRig.hitPoints -= bullet.damage;
          bullets.splice(i, 1); // Remove the bullet
          continue;
        }

        // Check collision with obstacles
        let bulletHitObstacle: boolean = false;
        for (const obstacle of obstacles) {
          if (
            isRotatedRectColliding(
              { x: bullet.x - 2.5, y: bullet.y - 2.5, width: 5, height: 5, angle: 0 },
              { x: obstacle.x + obstacle.width / 2, y: obstacle.y + obstacle.height / 2, width: obstacle.width, height: obstacle.height, angle: obstacle.angle }
            )
          ) {
            bullets.splice(i, 1); // Remove the bullet
            bulletHitObstacle = true;
            break; // Exit the obstacle loop since the bullet is already removed
          }
        }

        if (bulletHitObstacle) {
          continue; // Skip further checks if the bullet hit an obstacle
        }

        // Remove bullets that go off-screen
        if (
          bullet.x < 0 || bullet.x > canvas.width ||
          bullet.y < 0 || bullet.y > canvas.height
        ) {
          bullets.splice(i, 1);
        }
      }
    };

    const loop = () => {
      if (vehicles.some(v => v.vehicle.hitPoints <= 0)) {
        console.log('0 hp');
        const winner = 
          vehicles.find(v => v.vehicle.hitPoints > 0)?.role === 'player'
            ? 'Player Wins!'
            : 'AI Wins!';
        setMessage(winner);
        setView('afterBattle');
        // Render final state directly here
        draw(ctx, canvas, vehicles.map(v => v.vehicle), hits, bullets);

        // Save final state for possible later use
        setEndOfTheMatch({
          winner,
          finalObject: {
            ctx,
            canvas,
            vehicles,
            hits,
            bullets,
          },
        });
        return;
      }

      update();
      draw(ctx, canvas, vehicles.map(v => v.vehicle), hits, bullets);
      requestAnimationFrame(loop);
      reloadWeapons(vehicles);
    };

    if (view === 'battle') {
      loop();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [view]);

  return (
    <div>
      <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        {view === 'preBattle' && (
          <button onClick={() => setView('battle')}>Click this to start the battle</button>
        )}
        {view === 'afterBattle' && (
          <>
            {message}
            <button onClick={() => setView('battle')}>Play again</button>
            <button onClick={() => setView('menu')}>Back to menu</button>
          </>
        )}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          border: '1px solid black',
          background: '#9A7B4D',
          marginLeft: 0,
          marginRight: 0,
        }}
      />
    </div>
  );
};

export default Canvas;

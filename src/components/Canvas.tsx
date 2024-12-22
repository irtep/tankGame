import React, { useEffect, useRef, useState } from 'react';
import draw from '../functions/draw';
import { arenaHeight, arenaWidth, bulletSpeed } from '../constants/measures';
import { obstacles } from '../constants/obstacles';
import { bullets } from '../constants/bullets';
import { Hit, Obstacle, Vehicle } from '../interfaces/sharedInterfaces';
import { getRigByName } from '../functions/utils';
import { isRotatedRectColliding } from '../functions/collisionDetect';

interface CanvasProps {
  setView: React.Dispatch<React.SetStateAction<'menu' | 'battle' | 'preBattle' | 'afterBattle'>>;
  view: 'menu' | 'battle' | 'preBattle' | 'afterBattle';
  playerRig: string;
  opponentRig: string;
}

const Canvas: React.FC<CanvasProps> = ({
  setView,
  view,
  playerRig,
  opponentRig
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

    const vehicles: { vehicle: Vehicle; role: 'player' | 'ai' }[] = [
      {
        vehicle: {
          name: 'test Rig',
          x: 800 / 2,
          y: 600 / 2,
          width: 40,
          height: 20,
          angle: 0,
          speed: 3,
          hitPoints: 9,
          weapons: {},
        },
        role: 'player',
      },
      {
        vehicle: {
          name: 'ai Rig',
          x: 800 / 4,
          y: 600 / 4,
          width: 40,
          height: 20,
          angle: 0,
          speed: 3,
          hitPoints: 9,
          weapons: {},
        },
        role: 'ai',
      },
    ];
    // updates Rig objects to match selected rigs
    const pRig = getRigByName(playerRig);
    const oRig = getRigByName(opponentRig);

    if (pRig && oRig) {
      vehicles[0].vehicle = { ...pRig, x: 600, y: 500 };
      vehicles[1].vehicle = { ...oRig, x: 150, y: 150 };
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
        const angle = Math.atan2(mouseY - playerRig.y, mouseX - playerRig.x);
        bullets.push({
          x: playerRig.x,
          y: playerRig.y,
          angle,
          owner: 'player',
          color: 'red',
          damage: 1,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handleMouseDown);

    const update = () => {
      const playerRig = vehicles.find(v => v.role === 'player')?.vehicle;
      const aiRig = vehicles.find(v => v.role === 'ai')?.vehicle;

      if (!playerRig || !aiRig) return;

      // Update player movement
      const nextPlayerRig = {
        ...playerRig,
        x: playerRig.x + (keys.ArrowUp ? Math.cos(playerRig.angle) * playerRig.speed : 0) -
          (keys.ArrowDown ? Math.cos(playerRig.angle) * playerRig.speed : 0),
        y: playerRig.y + (keys.ArrowUp ? Math.sin(playerRig.angle) * playerRig.speed : 0) -
          (keys.ArrowDown ? Math.sin(playerRig.angle) * playerRig.speed : 0),
      };

      if (
        !obstacles.some(obstacle =>
          isRotatedRectColliding(nextPlayerRig, { x: obstacle.x + obstacle.width / 2, y: obstacle.y + obstacle.height / 2, width: obstacle.width, height: obstacle.height, angle: 0 })
        ) &&
        !isRotatedRectColliding(nextPlayerRig, aiRig)
      ) {
        Object.assign(playerRig, nextPlayerRig);
      }

      // AI movement and shooting
      aiRig.angle += (Math.random() - 0.5) * 0.1;

      if (Math.random() < 0.02) {
        const angle: number = Math.atan2(playerRig.y - aiRig.y, playerRig.x - aiRig.x);
        bullets.push({
          x: aiRig.x,
          y: aiRig.y,
          angle,
          owner: 'ai',
          color: 'black',
          damage: 1,
        });
      }

      // Rotate player Rig
      if (keys.ArrowLeft) playerRig.angle -= 0.05;
      if (keys.ArrowRight) playerRig.angle += 0.05;

      // Keep AI within bounds
      aiRig.x = Math.max(aiRig.width / 2, Math.min(canvas.width - aiRig.width / 2, aiRig.x));
      aiRig.y = Math.max(aiRig.height / 2, Math.min(canvas.height - aiRig.height / 2, aiRig.y));
      
      // Update bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        // Move bullet
        bullet.x += Math.cos(bullet.angle) * 5; // Adjust speed as needed
        bullet.y += Math.sin(bullet.angle) * 5;

        // Check collision with player
        if (
          bullet.owner === 'ai' &&
          isRotatedRectColliding(
            { x: bullet.x - 2.5, y: bullet.y - 2.5, width: 5, height: 5, angle: 0 },
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
            { x: bullet.x - 2.5, y: bullet.y - 2.5, width: 5, height: 5, angle: 0 },
            { x: aiRig.x - aiRig.width / 2, y: aiRig.y - aiRig.height / 2, width: aiRig.width, height: aiRig.height, angle: aiRig.angle }
          )
        ) {
          aiRig.hitPoints -= bullet.damage;
          bullets.splice(i, 1); // Remove the bullet
          continue;
        }

        // Check collision with obstacles
        let bulletHitObstacle = false;
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
        const winner = vehicles.find(v => v.vehicle.hitPoints > 0)?.role === 'player' ? 'Player Wins!' : 'AI Wins!';
        setMessage(winner);
        setView('afterBattle');
        return;
      }

      update();
      draw(ctx, canvas, vehicles.map(v => v.vehicle), hits);
      requestAnimationFrame(loop);
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

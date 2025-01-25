import React, { useEffect, useRef, useState } from 'react';
import draw from '../functions/draw';
import { arenaHeight, arenaWidth, deceleration } from '../constants/measures';
import { generateRandomObstacles, obstacles } from '../constants/obstacles';
import { GameObject, MatchEndState, Obstacle, Vehicle } from '../interfaces/sharedInterfaces';
import { getRigByName, playSound } from '../functions/utils';
import { isRotatedRectColliding } from '../functions/collisionDetect';
import { shoot } from '../functions/fireWeapon';
import { placeHolder1, placeHolder2 } from '../constants/rigs';
import { updateRigMovement } from '../functions/updateRigMovement';
import { getAIInput } from '../functions/aiFunctions';
import { reloadWeapons } from '../functions/reloadWeapons';
//import { radarCheck } from '../functions/radarCheck';
import { Container } from '@mui/material';
import PreMatch from './PreMatch';
import AfterMatch from './AfterMatch';

interface CanvasProps {
  setView: React.Dispatch<React.SetStateAction<'menu' | 'battle' | 'preBattle' | 'afterBattle'>>;
  view: 'menu' | 'battle' | 'preBattle' | 'afterBattle';
  playerRig: string;
  opponentRig: string;
  setEndOfTheMatch: React.Dispatch<React.SetStateAction<MatchEndState | null>>;
  endOfTheMatch: MatchEndState | null;
}

const Canvas: React.FC<CanvasProps> = ({
  setView,
  view,
  playerRig,
  opponentRig,
  setEndOfTheMatch,
  endOfTheMatch
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

    const gameObject: GameObject = {
      vehicles: [
        placeHolder1,
        placeHolder2
      ],
      arena: obstacles,
      hits: [],
      bullets: [],
      updateCounter: 0,
      radars: [],
      mouseNowX: 0,
      mouseNowY: 0
    };

    // updates Rig objects to match selected rigs
    const pRig = getRigByName(playerRig);
    const oRig = getRigByName(opponentRig);

    if (pRig && oRig) {
      // gives vehicles selected values
      gameObject.vehicles[0].vehicle = {
        ...pRig,
        x: 700,
        y: 500,
        velocityX: 0,
        velocityY: 0
      };
      gameObject.vehicles[1].vehicle = {
        ...oRig,
        x: 150,
        y: 150,
        velocityX: 0,
        velocityY: 0
      };
    }

    // Keyboard state
    // supports arrows and wsad
    const keys: { [key: string]: boolean } = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      s: false,
      a: false,
      d: false,
    };

    // Event listeners for keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect: DOMRect = canvas.getBoundingClientRect();
      const mouseX: number = e.clientX - rect.left;
      const mouseY: number = e.clientY - rect.top;
      const playerRig: Vehicle | undefined = gameObject.vehicles.find(v => v.role === 'player')?.vehicle;
      const aiRig: Vehicle | undefined = gameObject.vehicles.find(v => v.role === 'ai')?.vehicle;

      // player shooting:
      if (playerRig && aiRig) {
        //const turretsAngle: number = Math.atan2(mouseY - playerRig.y, mouseX - playerRig.x);
        //
        // Calculate the angle to the mouse position
        const mouseAngle: number = Math.atan2(mouseY - playerRig.y, mouseX - playerRig.x);
        const forwardAngle: number = playerRig.angle;

        // Define the arc range (±π/8 radians for a 45-degree arc)
        const arcRange: number = Math.PI / 8;

        // Normalize angles to [0, 2π] for comparison
        const normalizeAngle = (angle: number) => (angle + Math.PI * 2) % (Math.PI * 2);
        const normalizedMouseAngle = normalizeAngle(mouseAngle);
        const normalizedForwardAngle = normalizeAngle(forwardAngle);

        // Check if the mouse is within the front arc
        const isInFrontArc =
          Math.abs(normalizedMouseAngle - normalizedForwardAngle) <= arcRange ||
          Math.abs(normalizedMouseAngle - normalizedForwardAngle - Math.PI * 2) <= arcRange;
        //        
        //console.log('in front: ', isInFrontArc);
        /*
        const checkingRadar: CollisionReport = radarCheck(
          gameObject,
          'player',
          0,
          'check for front weapons'
        );
        */
        shoot(playerRig, gameObject, mouseAngle, isInFrontArc/*checkingRadar*/, true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      gameObject.mouseNowX = e.clientX - rect.left;
      gameObject.mouseNowY = e.clientY - rect.top;
    });

    const update = () => {
      const playerRig: Vehicle | undefined = gameObject.vehicles.find(v => v.role === 'player')?.vehicle;
      const aiRig: Vehicle | undefined = gameObject.vehicles.find(v => v.role === 'ai')?.vehicle;
      gameObject.updateCounter++;

      if (!playerRig || !aiRig) return;

      updateRigMovement(playerRig, keys, obstacles, aiRig, deceleration);
      const aiKeys = getAIInput(gameObject, aiRig, playerRig);
      updateRigMovement(aiRig, aiKeys, obstacles, playerRig, deceleration);

      // AI shoots

      if (aiRig.weapons[0].cooldown === 0) {

        const angle: number = Math.atan2(playerRig.y - aiRig.y, playerRig.x - aiRig.x);

        // Calculate the angle to the mouse position
        //const mouseAngle: number = Math.atan2(mouseY - playerRig.y, mouseX - playerRig.x);
        const forwardAngle: number = aiRig.angle;

        // Define the arc range (±π/8 radians for a 45-degree arc)
        const arcRange: number = Math.PI / 8;

        // Normalize angles to [0, 2π] for comparison
        const normalizeAngle = (angle: number) => (angle + Math.PI * 2) % (Math.PI * 2);
        const normalizedShootingAngle = normalizeAngle(angle);
        const normalizedForwardAngle = normalizeAngle(forwardAngle);

        // Check if the mouse is within the front arc
        const isInFrontArc =
          Math.abs(normalizedShootingAngle - normalizedForwardAngle) <= arcRange ||
          Math.abs(normalizedShootingAngle - normalizedForwardAngle - Math.PI * 2) <= arcRange;
        //        
        //console.log('in front (ai): ', isInFrontArc);
        /*
        const checkingRadar: CollisionReport = radarCheck(
          gameObject,
          'ai',
          0,
          'check for front weapons'
        );
        */
        shoot(aiRig, gameObject, angle, isInFrontArc/*checkingRadar*/, false);
      }

      // Update gameObject.bullets
      for (let i = gameObject.bullets.length - 1; i >= 0; i--) {
        const bullet = gameObject.bullets[i];

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
          gameObject.bullets.splice(i, 1); // Remove the bullet
          gameObject.hits.push({
            x: bullet.x,
            y: bullet.y,
            damage: bullet.damage
          });
          if (bullet.size > 2) {
            playSound('explosion');
          } else {
            playSound('clash');
          }
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
          gameObject.bullets.splice(i, 1); // Remove the bullet
          gameObject.hits.push({
            x: bullet.x,
            y: bullet.y,
            damage: bullet.damage
          });
          if (bullet.size > 2) {
            playSound('explosion');
          } else {
            playSound('clash');
          }
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
            gameObject.bullets.splice(i, 1); // Remove the bullet
            bulletHitObstacle = true;
            break; // Exit the obstacle loop since the bullet is already removed
          }
        }

        if (bulletHitObstacle) {
          continue; // Skip further checks if the bullet hit an obstacle
        }

        // Remove gameObject.bullets that go off-screen
        if (
          bullet.x < 0 || bullet.x > canvas.width ||
          bullet.y < 0 || bullet.y > canvas.height
        ) {
          gameObject.bullets.splice(i, 1);
        }
      }
    };

    const loop = () => {
      if (gameObject.vehicles.some(v => v.vehicle.hitPoints <= 0)) {
        console.log('0 hp');
        const winner =
          gameObject.vehicles.find(v => v.vehicle.hitPoints > 0)?.role === 'player'
            ? 'You won, greatly played!'
            : 'You lost, better luck next time!';
        setMessage(winner);
        setView('afterBattle');
        // Render final state directly here
        draw(ctx,
          canvas,
          gameObject.vehicles.map(v => v.vehicle),
          gameObject.hits,
          gameObject.bullets,
          gameObject.radars,
          gameObject.mouseNowX,
          gameObject.mouseNowY
        );

        // Save final state for possible later use
        setEndOfTheMatch({
          winner,
          gameObject
        });
        return;
      }

      update();
      draw(ctx,
        canvas,
        gameObject.vehicles.map(v => v.vehicle),
        gameObject.hits,
        gameObject.bullets,
        gameObject.radars,
        gameObject.mouseNowX,
        gameObject.mouseNowY
      );
      requestAnimationFrame(loop);
      reloadWeapons(gameObject.vehicles);
      // every tenth update removes some hits
      if (gameObject.hits.length > 0 &&
        gameObject.updateCounter % 10 === 0
      ) {
        gameObject.hits.shift();
      }
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
    <Container>
      {
        view === 'battle' && (
          <>
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
          </>)
      }
      {
        view === 'preBattle' && (
          <Container>
            <PreMatch
              setView={setView}
            />
          </Container>
        )
      }
      {
        view === 'afterBattle' && (
          <>
            <AfterMatch
              setView={setView}
              message={message}
              endOfTheMatch={endOfTheMatch}
            />
          </>
        )
      }

    </Container>
  );
};

export default Canvas;

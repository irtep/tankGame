import React, { useEffect, useRef, useState } from 'react';
import draw from '../functions/draw';
import { arenaHeight, arenaWidth, bulletSpeed } from '../constants/measures';
import { obstacles } from '../constants/obstacles';
import { bullets } from '../constants/bullets';
import { Hit, Obstacle, Vehicle } from '../interfaces/sharedInterfaces';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState<string>('');

  let tank: Vehicle = {
    name: 'test tank',
    x: 800 / 2,
    y: 600 / 2,
    width: 40,
    height: 20,
    angle: 0,
    speed: 3,
    hitPoints: 9
  };

  // AI Tank properties
  let aiTank: Vehicle = {
    name: 'ai tank',
    x: 800 / 4,
    y: 600 / 4,
    width: 40,
    height: 20,
    angle: 0,
    speed: 3,
    hitPoints: 9
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = arenaWidth;
    canvas.height = arenaHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      const angle = Math.atan2(mouseY - tank.y, mouseX - tank.x);
      bullets.push({
        x: tank.x,
        y: tank.y,
        angle,
        owner: 'player',
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handleMouseDown);

    //const randomAngle = () => Math.random() * Math.PI * 2;

    // Function for detecting collision between two rectangles
    const isRectColliding = (rect1: { x: number; y: number; width: number; height: number }, rect2: { x: number; y: number; width: number; height: number }) => {
      return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
    };

    const isRotatedRectColliding = (
      rect1: { x: number; y: number; width: number; height: number; angle: number },
      rect2: { x: number; y: number; width: number; height: number; angle: number }
    ) => {
      const getCorners = (rect: any) => {
        const cos = Math.cos(rect.angle);
        const sin = Math.sin(rect.angle);

        const halfW = rect.width / 2;
        const halfH = rect.height / 2;

        return [
          { x: rect.x + cos * halfW - sin * halfH, y: rect.y + sin * halfW + cos * halfH },
          { x: rect.x - cos * halfW - sin * halfH, y: rect.y - sin * halfW + cos * halfH },
          { x: rect.x - cos * halfW + sin * halfH, y: rect.y - sin * halfW - cos * halfH },
          { x: rect.x + cos * halfW + sin * halfH, y: rect.y + sin * halfW - cos * halfH },
        ];
      };

      const project = (corners: any[], axis: any) => {
        return corners.map((corner) => corner.x * axis.x + corner.y * axis.y);
      };

      const overlap = (proj1: any[], proj2: any[]) => {
        const max1 = Math.max(...proj1);
        const min1 = Math.min(...proj1);
        const max2 = Math.max(...proj2);
        const min2 = Math.min(...proj2);

        return max1 >= min2 && max2 >= min1;
      };

      const corners1 = getCorners(rect1);
      const corners2 = getCorners(rect2);

      const axes = [
        { x: corners1[1].x - corners1[0].x, y: corners1[1].y - corners1[0].y },
        { x: corners1[3].x - corners1[0].x, y: corners1[3].y - corners1[0].y },
        { x: corners2[1].x - corners2[0].x, y: corners2[1].y - corners2[0].y },
        { x: corners2[3].x - corners2[0].x, y: corners2[3].y - corners2[0].y },
      ];

      for (const axis of axes) {
        const proj1 = project(corners1, axis);
        const proj2 = project(corners2, axis);

        if (!overlap(proj1, proj2)) return false;
      }

      return true;
    };

    const update = () => {
      const nextTank = {
        x: tank.x + (keys.ArrowUp ? Math.cos(tank.angle) * tank.speed : 0) - (keys.ArrowDown ? Math.cos(tank.angle) * tank.speed : 0),
        y: tank.y + (keys.ArrowUp ? Math.sin(tank.angle) * tank.speed : 0) - (keys.ArrowDown ? Math.sin(tank.angle) * tank.speed : 0),
        width: tank.width,
        height: tank.height,
        angle: tank.angle,
      };

      if (
        !obstacles.some((obstacle: Obstacle) =>
          isRotatedRectColliding(nextTank, { x: obstacle.x + obstacle.width / 2, y: obstacle.y + obstacle.height / 2, width: obstacle.width, height: obstacle.height, angle: 0 })
        ) &&
        !isRotatedRectColliding(nextTank, aiTank)
      ) {
        tank = {
          ...nextTank,
          name: tank.name,
          speed: tank.speed,
          hitPoints: tank.hitPoints
        }; // Immutable update
      }

      // Check AI tank collision with obstacles
      const nextAiTank = {
        x: aiTank.x + Math.cos(aiTank.angle) * aiTank.speed,
        y: aiTank.y + Math.sin(aiTank.angle) * aiTank.speed,
        width: aiTank.width,
        height: aiTank.height,
        angle: aiTank.angle,
      };

      if (
        !obstacles.some((obstacle) =>
          isRotatedRectColliding(nextAiTank, { x: obstacle.x + obstacle.width / 2, y: obstacle.y + obstacle.height / 2, width: obstacle.width, height: obstacle.height, angle: 0 })
        ) &&
        !isRotatedRectColliding(nextAiTank, tank)
      ) {
        aiTank = {
          ...nextAiTank,
          name: aiTank.name,
          speed: aiTank.speed,
          hitPoints: aiTank.hitPoints
        }; // Immutable update, preserving the speed
      }

      // Update AI random movement angle
      aiTank.angle += (Math.random() - 0.5) * 0.1;

      // Keep AI tank within canvas bounds
      aiTank.x = Math.max(aiTank.width / 2, Math.min(canvas.width - aiTank.width / 2, aiTank.x));
      aiTank.y = Math.max(aiTank.height / 2, Math.min(canvas.height - aiTank.height / 2, aiTank.y));

      // Tank rotation
      if (keys.ArrowLeft) {
        tank.angle -= 0.05;
      }
      if (keys.ArrowRight) {
        tank.angle += 0.05;
      }

      // AI Shooting logic
      if (Math.random() < 0.02) {
        const angle = Math.atan2(tank.y - aiTank.y, tank.x - aiTank.x);
        bullets.push({
          x: aiTank.x,
          y: aiTank.y,
          angle,
          owner: 'ai',
        });
      }

      // Update bullets logic
      const updatedBullets = bullets.filter((bullet) => {
        const nextBulletX = bullet.x + Math.cos(bullet.angle) * bulletSpeed;
        const nextBulletY = bullet.y + Math.sin(bullet.angle) * bulletSpeed;

        // Remove bullet if it hits an obstacle
        if (
          obstacles.some((obstacle) =>
            isRectColliding({ x: nextBulletX - 2.5, y: nextBulletY - 2.5, width: 5, height: 5 }, obstacle)
          )
        ) {
          return false;
        }

        // Player hit by AI bullet
        if (
          bullet.owner === 'ai' &&
          isRectColliding(
            { x: bullet.x - 2.5, y: bullet.y - 2.5, width: 5, height: 5 },
            { x: tank.x - tank.width / 2, y: tank.y - tank.height / 2, width: tank.width, height: tank.height }
          )
        ) {
          hits.push({ x: bullet.x - 2.5, y: bullet.y - 2.5 });
          if (hits.length > 10) { hits.shift(); }
          tank = { ...tank, hitPoints: tank.hitPoints -1 };
          setMessage('AI Wins!');
          return false;
        }

        // AI hit by Player bullet
        if (
          bullet.owner === 'player' &&
          isRectColliding(
            { x: bullet.x - 2.5, y: bullet.y - 2.5, width: 5, height: 5 },
            { x: aiTank.x - aiTank.width / 2, y: aiTank.y - aiTank.height / 2, width: aiTank.width, height: aiTank.height }
          )
        ) {
          hits.push({ x: bullet.x - 2.5, y: bullet.y - 2.5 });
          if (hits.length > 10) { hits.shift(); }
          setMessage('Player Wins!');
          aiTank = { ...aiTank, hitPoints: aiTank.hitPoints -1 };
          return false;
        }

        // Remove bullets that move off the canvas
        if (nextBulletX < 0 || nextBulletX > canvas.width || nextBulletY < 0 || nextBulletY > canvas.height) {
          return false;
        }

        bullet.x = nextBulletX;
        bullet.y = nextBulletY;

        return true;
      });

      bullets.length = 0; // Clear the bullets array
      bullets.push(...updatedBullets); // Update with the remaining bullets
    };

    const loop = () => {
      if (tank.hitPoints <= 0 || aiTank.hitPoints <= 0) {
        // Stop the loop and display a message
        if (tank.hitPoints <= 0) setMessage('AI Wins!');
        if (aiTank.hitPoints <= 0) setMessage('Player Wins!');
        return; // Exit the loop
      }

      update();
      draw(ctx, canvas, tank, aiTank, hits);
      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div>
      <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        {message} player hp: {tank.hitPoints} ai hp: {aiTank.hitPoints}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          border: '1px solid black',
          background: "#9A7B4D",
          marginLeft: 0,
          marginRight: 0
        }}>
      </canvas>
    </div>
  );
};

export default Canvas;

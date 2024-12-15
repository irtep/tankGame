import React, { useEffect, useRef } from 'react';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1000;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Tank properties
    const tank = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: 40,
      height: 60,
      angle: 0,
      speed: 3,
    };

    // AI Tank properties
    const aiTank = {
      x: canvas.width / 4,
      y: canvas.height / 4,
      width: 40,
      height: 60,
      angle: 0,
      speed: 2,
    };

    // Bullet properties
    const bullets: { x: number; y: number; angle: number; owner: 'player' | 'ai' }[] = [];
    const bulletSpeed = 5;

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

    const randomAngle = () => Math.random() * Math.PI * 2;

    const update = () => {
      // Move tank
      if (keys.ArrowUp) {
        tank.x += Math.cos(tank.angle) * tank.speed;
        tank.y += Math.sin(tank.angle) * tank.speed;
      }
      if (keys.ArrowDown) {
        tank.x -= Math.cos(tank.angle) * tank.speed;
        tank.y -= Math.sin(tank.angle) * tank.speed;
      }
      if (keys.ArrowLeft) {
        tank.angle -= 0.05;
      }
      if (keys.ArrowRight) {
        tank.angle += 0.05;
      }

      // AI Tank random movement
      aiTank.angle += (Math.random() - 0.5) * 0.1;
      aiTank.x += Math.cos(aiTank.angle) * aiTank.speed;
      aiTank.y += Math.sin(aiTank.angle) * aiTank.speed;

      // Ensure AI stays in bounds
      aiTank.x = Math.max(aiTank.width / 2, Math.min(canvas.width - aiTank.width / 2, aiTank.x));
      aiTank.y = Math.max(aiTank.height / 2, Math.min(canvas.height - aiTank.height / 2, aiTank.y));

      // AI Shooting
      if (Math.random() < 0.02) {
        const angle = Math.atan2(tank.y - aiTank.y, tank.x - aiTank.x);
        bullets.push({
          x: aiTank.x,
          y: aiTank.y,
          angle,
          owner: 'ai',
        });
      }

      // Update bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += Math.cos(bullets[i].angle) * bulletSpeed;
        bullets[i].y += Math.sin(bullets[i].angle) * bulletSpeed;

        // Check collision with player tank
        if (
          bullets[i].owner === 'ai' &&
          Math.hypot(bullets[i].x - tank.x, bullets[i].y - tank.y) < tank.width / 2
        ) {
          console.log('AI Wins!');
          bullets.splice(i, 1);
          return;
        }

        // Check collision with AI tank
        if (
          bullets[i].owner === 'player' &&
          Math.hypot(bullets[i].x - aiTank.x, bullets[i].y - aiTank.y) < aiTank.width / 2
        ) {
          console.log('Player Wins!');
          bullets.splice(i, 1);
          return;
        }

        // Remove bullets that go off-screen
        if (
          bullets[i].x < 0 ||
          bullets[i].x > canvas.width ||
          bullets[i].y < 0 ||
          bullets[i].y > canvas.height
        ) {
          bullets.splice(i, 1);
        }
      }
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player tank
      ctx.save();
      ctx.translate(tank.x, tank.y);
      ctx.rotate(tank.angle);
      ctx.fillStyle = 'green';
      ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
      ctx.restore();

      // Draw AI tank
      ctx.save();
      ctx.translate(aiTank.x, aiTank.y);
      ctx.rotate(aiTank.angle);
      ctx.fillStyle = 'blue';
      ctx.fillRect(-aiTank.width / 2, -aiTank.height / 2, aiTank.width, aiTank.height);
      ctx.restore();

      // Draw bullets
      ctx.fillStyle = 'red';
      bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const loop = () => {
      update();
      draw();
      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;

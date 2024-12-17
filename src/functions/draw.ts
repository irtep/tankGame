import { Vehicle } from "../interfaces/sharedInterfaces";
import { bullets } from "../constants/bullets";
import { obstacles } from "../constants/obstacles";
import { Hit } from "../interfaces/sharedInterfaces";

const draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    tank: Vehicle,
    aiTank: Vehicle,
    hits: Hit[]
    ) => {

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player tank
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.angle);
    ctx.fillStyle = 'green';
    ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
    ctx.restore();

    // texts of player tank
    ctx.font = '10px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(tank.name, tank.x, tank.y);
    ctx.fillStyle = 'white';
    ctx.fillText(JSON.stringify(tank.hitPoints), tank.x, tank.y + 20);

    // Draw AI tank
    ctx.save();
    ctx.translate(aiTank.x, aiTank.y);
    ctx.rotate(aiTank.angle);
    ctx.fillStyle = 'blue';
    ctx.fillRect(-aiTank.width / 2, -aiTank.height / 2, aiTank.width, aiTank.height);
    ctx.restore();

    // texts of ai tank
    ctx.font = '10px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(aiTank.name, aiTank.x, aiTank.y);
    ctx.fillStyle = 'white';
    ctx.fillText(JSON.stringify(aiTank.hitPoints), aiTank.x, aiTank.y + 20);

    // Draw obstacles
    ctx.fillStyle = 'gray';
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw bullets
    ctx.fillStyle = 'red';
    bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw hits:
    ctx.fillStyle = 'darkred';
    hits.forEach((hit: Hit) => {
        ctx.beginPath();
        ctx.arc(hit.x, hit.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
};

export default draw;
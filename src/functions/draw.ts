import { Bullet, Vehicle } from "../interfaces/sharedInterfaces";
import { obstacles } from "../constants/obstacles";
import { Hit } from "../interfaces/sharedInterfaces";

// Define a type for the image cache
interface ImageCache {
    [key: string]: HTMLImageElement;
}

// Create an object to store loaded images
const imageCache: ImageCache = {};

// Function to draw a star-like explosion
const drawExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, numPoints: number, color: string) => {
    ctx.beginPath();
    ctx.fillStyle = color;

    for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints;
        const distance = i % 2 === 0 ? radius : radius / 2; // Alternate between outer and inner points
        const posX = x + distance * Math.cos(angle);
        const posY = y + distance * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(posX, posY);
        } else {
            ctx.lineTo(posX, posY);
        }
    }

    ctx.closePath();
    ctx.fill();
}

const draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    rigs: Vehicle[],
    hits: Hit[],
    bullets: Bullet[]
) => {

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rigs.forEach( (tank: Vehicle) => {
        const imgKey = tank.battleImg;
        if (imgKey) {
            // Check if the image is already in the cache
            if (!imageCache[imgKey]) {
                const img = new Image();
                img.onerror = (error) => {
                    console.error('Error loading image:', error);
                };
                img.src = process.env.PUBLIC_URL + `/img/${imgKey}`;
                imageCache[imgKey] = img;
            }
        
            const img = imageCache[imgKey];
            if (img) {
                ctx.save();
                ctx.translate(tank.x, tank.y);
                ctx.rotate(tank.angle);
                ctx.drawImage(img, -tank.width / 2, -tank.height / 2, tank.width, tank.height);
                ctx.restore();
            }
        } else {
            // backup to draw just a box
            console.log('drawing backup');
            ctx.save();
            ctx.translate(tank.x, tank.y);
            ctx.rotate(tank.angle);
            ctx.fillStyle = 'blue';
            ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
            ctx.restore();
        }
    
        // texts of player tank
        ctx.font = '10px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(tank.name, tank.x, tank.y);
        ctx.fillStyle = 'white';
        ctx.fillText(JSON.stringify(tank.hitPoints), tank.x, tank.y + 20);
    
    });
    

    // Draw AI tank
    /*
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
*/
    // Draw obstacles
    ctx.fillStyle = 'gray';
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw bullets
    bullets.forEach((bullet: Bullet) => {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
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
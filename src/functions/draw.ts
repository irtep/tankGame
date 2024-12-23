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

    rigs.forEach( (rig: Vehicle) => {
        const imgKey = rig.battleImg;
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
                ctx.translate(rig.x, rig.y);
                ctx.rotate(rig.angle);
                ctx.drawImage(img, -rig.width / 2, -rig.height / 2, rig.width, rig.height);
                ctx.restore();
            }
        } else {
            // backup to draw just a box
            console.log('drawing backup');
            ctx.save();
            ctx.translate(rig.x, rig.y);
            ctx.rotate(rig.angle);
            ctx.fillStyle = 'blue';
            ctx.fillRect(-rig.width / 2, -rig.height / 2, rig.width, rig.height);
            ctx.restore();
        }
    
        // texts of player rig
        ctx.font = '12px Arial';
        ctx.fillStyle = 'cyan';
        ctx.fillText(rig.name, rig.x, rig.y);
        ctx.fillStyle = 'cyan';
        ctx.fillText(JSON.stringify(rig.hitPoints), rig.x + 10, rig.y + 20);
        // gun
        ctx.fillStyle = 'cyan';
        ctx.fillText(JSON.stringify(rig.weapons.turretGun?.name), rig.x + 10, rig.y + 35);
        ctx.fillText(JSON.stringify(rig.weapons.turretGun?.cooldown), rig.x + 10, rig.y + 45);
    });
 
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
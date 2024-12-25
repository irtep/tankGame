import { Bullet, RadarImage, Vehicle } from "../interfaces/sharedInterfaces";
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

const drawVehicle = (ctx: CanvasRenderingContext2D, vehicle: Vehicle) => {
    const imgKey = vehicle.battleImg;
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
            ctx.translate(vehicle.x, vehicle.y);
            ctx.rotate(vehicle.angle);
            ctx.drawImage(img, -vehicle.width / 2, -vehicle.height / 2, vehicle.width, vehicle.height);
            ctx.restore();
        }
    } else {
        // backup to draw just a box
        console.log('drawing backup');
        ctx.save();
        ctx.translate(vehicle.x, vehicle.y);
        ctx.rotate(vehicle.angle);
        ctx.fillStyle = 'blue';
        ctx.fillRect(-vehicle.width / 2, -vehicle.height / 2, vehicle.width, vehicle.height);
        ctx.restore();
    }

    // texts of player rig
    ctx.font = '14px Arial';
    ctx.fillStyle = 'cyan';
    ctx.fillText(vehicle.name, vehicle.x, vehicle.y);
    ctx.fillStyle = 'cyan';
    ctx.fillText(JSON.stringify(vehicle.hitPoints), vehicle.x + 20, vehicle.y + 20);
    // gun
    if (vehicle.weapons.turretGun?.cooldown === 0) {
        ctx.fillStyle = 'green';
    } else {
        ctx.fillStyle = 'red';
    }
    ctx.fillText(JSON.stringify(vehicle.weapons.turretGun?.name), vehicle.x + 10, vehicle.y + 35);
}

const draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    rigs: Vehicle[],
    hits: Hit[],
    bullets: Bullet[],
    radars: RadarImage[]
) => {

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rigs.forEach((rig: Vehicle) => {
        drawVehicle(ctx, rig);
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
        drawExplosion(ctx, hit.x, hit.y, hit.damage * 10, 5, 'yellow');
    });

    // radar images for debug reasons, if needed
    radars.forEach((radar: RadarImage) => {
        ctx.save();
    
        // Translate to the radar's position
        ctx.translate(radar.x, radar.y);
        
        // Rotate the canvas to match the radar's angle (convert degrees to radians if needed)
        ctx.rotate(radar.angle);
        
        // Set the stroke style
        ctx.strokeStyle = 'blue';
        
        // Draw the rectangle, centered at the origin
        ctx.strokeRect(-radar.width / 2, -radar.height / 2, radar.width, radar.height);
        
        // Restore the canvas state
        ctx.restore();
    });
};

export default draw;
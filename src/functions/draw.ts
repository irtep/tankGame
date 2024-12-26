import { ArmedWeapon, Bullet, RadarImage, Vehicle } from "../interfaces/sharedInterfaces";
import { obstacles } from "../constants/obstacles";
import { Hit } from "../interfaces/sharedInterfaces";

// Define a type for the image cache
interface ImageCache {
    [key: string]: HTMLImageElement;
}

// Create an object to store loaded images
const imageCache: ImageCache = {};

// Function to draw a star-like explosion
const drawExplosion = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    numPoints: number,
    color: string
) => {
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

    // texts rig
    ctx.font = '14px Arial';
    ctx.fillStyle = 'cyan';
    ctx.fillText(vehicle.name, vehicle.x, vehicle.y);
    ctx.fillStyle = 'cyan';
    ctx.fillText(JSON.stringify(vehicle.hitPoints), vehicle.x + 20, vehicle.y + 20);
    // guns
    vehicle.weapons.forEach((w: ArmedWeapon, i: number) => {
        if (w.cooldown === 0) {
            ctx.fillStyle = 'cyan';
        } else {
            ctx.fillStyle = 'red';
        }
        ctx.fillText(JSON.stringify(w.name), vehicle.x + 10, vehicle.y + 35 + (11 * i));
    });

}

const drawTargetingX = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouseX: number,
    mouseY: number,
    mainGunAvailable: boolean,
    secondaryGunAvailable: boolean
) => {
    // Clear the canvas
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the targeting '+'
    const crossSize = 20; // Size of the '+'
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    // Vertical line of '+'
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY - crossSize);
    ctx.lineTo(mouseX, mouseY + crossSize);
    ctx.stroke();

    // Horizontal line of '+'
    ctx.beginPath();
    ctx.moveTo(mouseX - crossSize, mouseY);
    ctx.lineTo(mouseX + crossSize, mouseY);
    ctx.stroke();

    // Draw concentric circles
    //const circleColors = ['red', 'orange', 'yellow', 'green', 'purple'];
    for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, i * 10, 0, 2 * Math.PI); // Circles with increasing radius
        
        if (i === 1) {
            mainGunAvailable
            ? ctx.strokeStyle = 'Chartreuse'
            : ctx.strokeStyle = 'darkRed'
        }
        
        if (i === 2) {
            secondaryGunAvailable
            ? ctx.strokeStyle = 'Chartreuse'
            : ctx.strokeStyle = 'darkRed'
        }
        
        ctx.stroke();
    }
};

const draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    rigs: Vehicle[],
    hits: Hit[],
    bullets: Bullet[],
    radars: RadarImage[],
    mouseNowX: number,
    mouseNowY: number
) => {

    let mainGunAvailable = false;
    let secondaryGunAvailable = false;

    rigs[0].weapons.forEach( (w: ArmedWeapon, i: number) => {
        // 0 is main gun
        if (
            i === 0 &&
            w.cooldown === 0
        ) {
            mainGunAvailable = true;
        } else if (
            i > 0 &&
            w.cooldown === 0
        ) {
            secondaryGunAvailable = true;
        }
    });
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

    // draw targeting x
    drawTargetingX(
        ctx,
        canvas,
        mouseNowX,
        mouseNowY,
        mainGunAvailable,
        secondaryGunAvailable
    );

    // radar images for debug reasons, if needed
    // need to activate too from radarCheck that push
    /*
    radars.forEach((radarWave: RadarImage) => {
        ctx.fillStyle = 'darkRed';
        ctx.beginPath();
        ctx.arc(radarWave.x, radarWave.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    */
};

export default draw;
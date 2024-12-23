import { Obstacle, Vehicle } from "../interfaces/sharedInterfaces";
import { isRotatedRectColliding } from "./collisionDetect";

export const getAIInput = (aiRig: Vehicle, playerRig: Vehicle, obstacles: Obstacle[]): { [key: string]: boolean } => {
    const keys: { [key: string]: boolean } = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    };

    // Calculate angle to the player
    const dx = playerRig.x - aiRig.x;
    const dy = playerRig.y - aiRig.y;
    const targetAngle = Math.atan2(dy, dx);

    // Adjust AI's angle to face the player
    const angleDifference = (targetAngle - aiRig.angle + Math.PI * 2) % (Math.PI * 2);
    if (angleDifference > 0.1 && angleDifference < Math.PI) {
        keys.ArrowRight = true;
    } else if (angleDifference > Math.PI) {
        keys.ArrowLeft = true;
    }

    // Predict the next position of the AI
    const nextPosition = {
        x: aiRig.x + Math.cos(aiRig.angle) * aiRig.acceleration,
        y: aiRig.y + Math.sin(aiRig.angle) * aiRig.acceleration,
        width: aiRig.width,
        height: aiRig.height,
        angle: aiRig.angle,
    };

    // Check for potential collisions
    const willCollide = obstacles.some((obstacle: Obstacle) =>
        isRotatedRectColliding(nextPosition, {
            x: obstacle.x + obstacle.width / 2,
            y: obstacle.y + obstacle.height / 2,
            width: obstacle.width,
            height: obstacle.height,
            angle: aiRig.angle,
        })
    );

    // Ensure the AI never gets closer than 10px to an obstacle
    const safeDistance = 10;
    let closeObstacle = false;

    obstacles.forEach((obstacle: Obstacle) => {
        const distance = Math.sqrt(
            Math.pow(obstacle.x - aiRig.x, 2) + Math.pow(obstacle.y - aiRig.y, 2)
        );

        // If an obstacle is within the safe distance, mark it
        if (distance < safeDistance) {
            closeObstacle = true;
        }
    });

    if (closeObstacle) {
        // Slow down if close to an obstacle (to avoid a crash)
        aiRig.velocityX *= 0.5; // Reduce velocity to slow down
        aiRig.velocityY *= 0.5; // Reduce velocity to slow down

        // Prioritize avoiding the collision
        keys.ArrowUp = false;
        keys.ArrowDown = true;

        // Try to move in the opposite direction or adjust angle
        if (angleDifference < Math.PI) {
            keys.ArrowRight = true; // Turn right to avoid
        } else {
            keys.ArrowLeft = true; // Turn left to avoid
        }

        // Check if turning results in a collision or staying too close
        const adjustedPosition = {
            x: aiRig.x + Math.cos(aiRig.angle + 0.1) * aiRig.acceleration,
            y: aiRig.y + Math.sin(aiRig.angle + 0.1) * aiRig.acceleration,
            width: aiRig.width,
            height: aiRig.height,
            angle: aiRig.angle + 0.1,
        };

        const adjustedWillCollide = obstacles.some((obstacle: Obstacle) =>
            isRotatedRectColliding(adjustedPosition, {
                x: obstacle.x + obstacle.width / 2,
                y: obstacle.y + obstacle.height / 2,
                width: obstacle.width,
                height: obstacle.height,
                angle: aiRig.angle,
            })
        );

        // If the adjusted position still causes a collision, try to turn further
        if (adjustedWillCollide) {
            keys.ArrowLeft = true; // Try turning more if the adjusted position causes a collision
        }
    } else {
        // If no collision or close obstacle, move toward the player
        if (!willCollide) {
            keys.ArrowUp = true;
        } else {
            // If a collision is imminent, prioritize avoiding the obstacle
            keys.ArrowUp = false;
            keys.ArrowDown = true;

            // Adjust angle to navigate around the obstacle
            if (angleDifference < Math.PI) {
                keys.ArrowRight = true;
            } else {
                keys.ArrowLeft = true;
            }
        }
    }

    return keys;
};

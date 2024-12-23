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
        angle: 0,
      })
    );
  
    // Determine movement
    if (!willCollide) {
      // If no collision, move toward the player
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
  
    return keys;
  };
import { Obstacle } from "../interfaces/sharedInterfaces";
import { arenaHeight, arenaWidth, minimumObstacles, maximumObstacles } from "./measures";

const obstacleTypes: { img: string; width: number; height: number }[] = [
    { img: 'batteries', width: 100, height: 80 },
    { img: 'factory', width: 100, height: 120 },
    { img: 'scrab1_horizontal', width: 100, height: 80 },
];

const restrictedAreas: { x: number, y: number }[] = [
    { x: 700, y: 500 },
    { x: 150, y: 150 },
];

const isFarEnough = (x: number, y: number, minDistance: number): boolean => {
    for (const area of restrictedAreas) {
        const distance = Math.sqrt((x - area.x) ** 2 + (y - area.y) ** 2);
        if (distance < minDistance) {
            return false;
        }
    }
    return true;
}

export const generateRandomObstacles = (): Obstacle[] => {
    const randomCount = Math.floor(Math.random() * maximumObstacles) + minimumObstacles; // Random number between 1 and 5
    console.log('random count: ', randomCount);
    const obstacles: Obstacle[] = [];
    const minDistance = 200;

    while (obstacles.length < randomCount) {
        const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        const randomX = Math.floor(Math.random() * (arenaWidth - randomType.width));
        const randomY = Math.floor(Math.random() * (arenaHeight - randomType.height));

        // Ensure obstacle is far enough from restricted areas
        if (isFarEnough(randomX, randomY, minDistance)) {
            obstacles.push({
                img: randomType.img,
                x: randomX,
                y: randomY,
                angle: 0,
                width: randomType.width,
                height: randomType.height,
            });
        }
    }
    console.log('returning: ', obstacles);
    return obstacles;
}

// Obstacles, use png's for images of these
export const obstacles: Obstacle[] = [
    ...generateRandomObstacles(),
    // outer walls
    { img: 'wall_horizontal', x: 0, y: 0, angle: 0, width: arenaWidth, height: 10 },
    { img: 'wall_horizontal', x: 0, y: arenaHeight - 10, angle: 0, width: arenaWidth, height: 10 },
    { img: 'wall_2_vertical', x: 0, y: 0, angle: 0, width: 10, height: arenaHeight },
    { img: 'wall_2_vertical', x: arenaWidth - 10, y: 0, angle: 0, width: 10, height: arenaHeight },
];
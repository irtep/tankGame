import { Obstacle } from "../interfaces/sharedInterfaces";
import { arenaHeight, arenaWidth } from "./measures";

// Obstacles
export const obstacles: Obstacle[] = [
    { x: 200, y: 250, angle: 0, width: 100, height: 50 },
    { x: 560, y: 400, angle: 0, width: 150, height: 50 },
    { x: 400, y: 329, angle: 0, width: 100, height: 50 },
    { x: 550, y: 130, angle: 0, width: 150, height: 50 },
    { x: 110, y: 330, angle: 0, width: 150, height: 50 },
    // outer walls
    { x: 0, y: 0, angle: 0, width: arenaWidth, height: 5 },
    { x: 0, y: arenaHeight - 10, angle: 0, width: arenaWidth, height: 5 },
    { x: 0, y: 0, angle: 0, width: 5, height: arenaHeight },
    { x: arenaWidth - 10, y: 0, angle: 0, width: 5, height: arenaHeight },
];
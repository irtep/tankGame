import { Obstacle } from "../interfaces/sharedInterfaces";
import { arenaHeight, arenaWidth } from "./measures";

// Obstacles, use png's for images of these
export const obstacles: Obstacle[] = [
    { img: 'batteries', x: 200, y: 250, angle: 0, width: 100, height: 80 },
    { img: 'factory', x: 560, y: 400, angle: 0, width: 100, height: 120 },
    { img: 'scrab1_horizontal', x: 400, y: 329, angle: 0, width: 100, height: 80 },
    { img: 'factory', x: 550, y: 130, angle: 0, width: 100, height: 120 },
    { img: 'batteries', x: 110, y: 330, angle: 0, width: 150, height: 80 },
    // outer walls
    { img: 'wall_horizontal', x: 0, y: 0, angle: 0, width: arenaWidth, height: 10 },
    { img: 'wall_horizontal', x: 0, y: arenaHeight - 10, angle: 0, width: arenaWidth, height: 10 },
    { img: 'wall_2_vertical', x: 0, y: 0, angle: 0, width: 10, height: arenaHeight },
    { img: 'wall_2_vertical', x: arenaWidth - 10, y: 0, angle: 0, width: 10, height: arenaHeight },
];
import { arenaHeight, arenaWidth, deceleration } from "../constants/measures";
import { GameObject, Vehicle } from "../interfaces/sharedInterfaces";
import { aiRadarCheck } from "./radarCheck";
import { returnMovementTest } from "./updateRigMovement";

type InputKeys = { [key: string]: boolean };

const testKey: InputKeys[] = [
    {   // forward
        ArrowUp: true,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    },
    {   // left
        ArrowUp: true,
        ArrowDown: false,
        ArrowLeft: true,
        ArrowRight: false,
    },
    {   // right
        ArrowUp: true,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: true,
    }
];

export const getAIInput = (
    gameObject: GameObject,
    aiRig: Vehicle,
    playerRig: Vehicle
): InputKeys => {
    const keys: InputKeys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    };

    const gridSize: number = 6; // 6x6 grid
    const canvasWidth: number = arenaWidth;
    const canvasHeight: number = arenaHeight;
    const squareWidth: number = canvasWidth / gridSize;
    const squareHeight: number = canvasHeight / gridSize;

    // Helper to determine which grid square a position falls into
    const getSquare = (x: number, y: number) => ({
        col: Math.floor(x / squareWidth),
        row: Math.floor(y / squareHeight),
    });

    // Get AI's current grid position
    const currentSquare = getSquare(aiRig.x, aiRig.y);
    console.log('1 current: ', currentSquare);
    // Get obstacles and map them to the grid
    const obstacles = gameObject.arena.map(obstacle =>
        getSquare(obstacle.x, obstacle.y)
    );

    // Initialize aiRig.path if not set
    if (!aiRig.path || aiRig.path.length === 0) {
        // Plan a new path (5 steps ahead)
        aiRig.path = findPath(currentSquare, 5, obstacles, gridSize);
        aiRig.currentTargetIndex = 0; // Reset target index
    }

    let centerOfNextCheckPoint = null;

    // Check if there's a target square in the path
    if (aiRig.path && aiRig.path.length > 0 && aiRig.currentTargetIndex < aiRig.path.length) {
        const targetSquare = aiRig.path[aiRig.currentTargetIndex];
        centerOfNextCheckPoint = {
            x: targetSquare.col * squareWidth + squareWidth / 2,
            y: targetSquare.row * squareHeight + squareHeight / 2,
        };
    } else {
        console.warn('No valid target checkpoint found for AI!');
    }

    let bestResult = 'forward';
    let shortestDistance = null;

    // distance checks
    const forwardTestSpeeds = returnMovementTest({
        ...aiRig,
        speed: 3
    }, testKey[0],
        gameObject.arena,
        playerRig, deceleration
    );
    const turnLeftTestSpeeds = returnMovementTest({
        ...aiRig,
        speed: 3
    }, testKey[1],
        gameObject.arena,
        playerRig, deceleration
    );
    const turnRightTestSpeeds = returnMovementTest({
        ...aiRig,
        speed: 3
    }, testKey[2],
        gameObject.arena,
        playerRig, deceleration
    );
    // returnMovementTest(playerRig, keys, obstacles, aiRig, deceleration);
    console.log('current x and y', aiRig.x, aiRig.y);
    console.log('fTs: ', forwardTestSpeeds, centerOfNextCheckPoint);
    console.log('ls: ', turnLeftTestSpeeds, centerOfNextCheckPoint);
    console.log('rs: ', turnRightTestSpeeds, centerOfNextCheckPoint);
    const distanceIfForward = distanceCheck(forwardTestSpeeds, centerOfNextCheckPoint);
    const distanceIfLeft = distanceCheck(turnLeftTestSpeeds, centerOfNextCheckPoint);
    const distanceIfRight = distanceCheck(turnRightTestSpeeds, centerOfNextCheckPoint);
    console.log('dist checks: ', distanceIfForward, distanceIfLeft, distanceIfRight);

    const distanceNow = distanceCheck({ x: aiRig.x, y: aiRig.y }, centerOfNextCheckPoint);

    // choose direction by checking where is next checkpoint
    if (distanceIfForward > distanceIfLeft && distanceIfForward > distanceIfRight) {
        bestResult = 'forward';
    } else if (distanceIfLeft < distanceIfRight) {
        bestResult = 'turn left';
    } else {
        bestResult = 'turn right';
    }

    // execute wheel turning.
    switch (bestResult) {

        case 'turn left': keys.ArrowLeft = true; keys.ArrowUp = true; break;
        case 'turn right': keys.ArrowRight = true; keys.ArrowUp = true; break;
    }

    // Check if there's a path to follow
    if (aiRig.path && aiRig.path.length > 0) {
        const targetSquare = aiRig.path[aiRig.currentTargetIndex];

        // Check if AI has reached the target square
        if (
            Math.abs(aiRig.x - targetSquare.col * squareWidth) < squareWidth / 2 &&
            Math.abs(aiRig.y - targetSquare.row * squareHeight) < squareHeight / 2
        ) {
            aiRig.currentTargetIndex++;

            // If the path is complete, calculate a new one
            if (aiRig.currentTargetIndex >= aiRig.path.length) {
                aiRig.path = findPath(currentSquare, 5, obstacles, gridSize);
                aiRig.currentTargetIndex = 0;
            }
        }
    }

    console.log('AI Path:', aiRig.path);
    console.log('Current Target Index:', aiRig.currentTargetIndex);
    console.log('Keys:', keys);

    return keys;
};

// Pathfinding: Finds a path with a specified length avoiding obstacles
const findPath = (
    start: { col: number; row: number },
    length: number,
    obstacles: { col: number; row: number }[],
    gridSize: number
): { col: number; row: number }[] => {
    const path: { col: number; row: number }[] = [];
    let current = { ...start };

    for (let i = 0; i < length; i++) {
        const neighbors = getValidNeighbors(current, obstacles, gridSize);

        if (neighbors.length === 0) {
            break; // Stop if no valid moves
        }

        // Select a random neighbor (or use a smarter heuristic)
        current = neighbors[Math.floor(Math.random() * neighbors.length)];
        path.push({ ...current });
    }

    return path;
};

// Helper: Get valid neighbors of a square
const getValidNeighbors = (
    square: { col: number; row: number },
    obstacles: { col: number; row: number }[],
    gridSize: number
): { col: number; row: number }[] => {
    const neighbors: { col: number; row: number }[] = [
        { col: square.col + 1, row: square.row },
        { col: square.col - 1, row: square.row },
        { col: square.col, row: square.row + 1 },
        { col: square.col, row: square.row - 1 },
    ];

    return neighbors.filter(
        neighbor =>
            neighbor.col >= 0 &&
            neighbor.col < gridSize &&
            neighbor.row >= 0 &&
            neighbor.row < gridSize &&
            !obstacles.some(ob => ob.col === neighbor.col && ob.row === neighbor.row)
    );
};


// Distance check
function distanceCheck(fromWhere: any, toWhere: any) {
    const a = fromWhere.x - toWhere.x // x1 - x2;
    const b = fromWhere.y - toWhere.y // y1 - y2;

    const c = Math.sqrt(a * a + b * b);
    return c;
}  
import { arenaHeight, arenaWidth, deceleration } from "../constants/measures";
import { obstacles } from "../constants/obstacles";
import { GameObject, Obstacle, PathTarget, Vehicle } from "../interfaces/sharedInterfaces";
import { movementCollisionTest, returnMovementTest } from "./updateRigMovement";
import { isRotatedRectColliding } from "./collisionDetect";

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
    playerRig: Vehicle): InputKeys => {

    const keys: InputKeys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    };

    const canvasWidth: number = arenaWidth;
    const canvasHeight: number = arenaHeight;

    // check if target in path is reached or x 0, that is default
    if (aiRig.path.reached || aiRig.path.x === 0) {

        const newTarget: PathTarget = {
            x: 0,
            y: 0,
            reached: false
        }
        let collisionWithObstacles: boolean = true;
        let maxLimit: number = 200;
        let tryCount: number = 0;

        while (collisionWithObstacles && tryCount < maxLimit) {
            newTarget.x = Math.floor(Math.random() * (canvasWidth - 200) + 100);
            newTarget.y = Math.floor(Math.random() * (canvasHeight - 200) + 100);
            let collisionResultInLoop: boolean = false;

            obstacles.forEach((ob: Obstacle) => {

                let collisionWithThis: boolean = isRotatedRectColliding(
                    {
                        ...newTarget,
                        width: aiRig.width,
                        height: aiRig.height,
                        angle: 0
                    },
                    ob
                )
                if (collisionWithThis) {
                    console.log(true);
                    collisionResultInLoop = true;
                    return;
                } else {
                }
            });
            collisionWithObstacles = collisionResultInLoop;
            tryCount++;
        }

        aiRig.path = newTarget;
        //console.log('aiRig.path', aiRig.path);
    }

    // check what movement would take you to closest to target
    // radar images
    const forwardRadarImages = returnMovementTest(
        30,
        {
            ...aiRig,
        },
        testKey[0],
        gameObject.arena,
        playerRig,
        deceleration
    );
    const turnLeftRadarImages = returnMovementTest(
        22,
        {
            ...aiRig,
            angle: aiRig.angle - 0.5
        },
        testKey[1],
        gameObject.arena,
        playerRig,
        deceleration
    );
    const turnRightRadarImages = returnMovementTest(
        22,
        {
            ...aiRig,
            angle: aiRig.angle + 0.5
        },
        testKey[2],
        gameObject.arena,
        playerRig,
        deceleration
    );

    gameObject.radars = [];
    gameObject.radars.push(forwardRadarImages);
    gameObject.radars.push(turnLeftRadarImages);
    gameObject.radars.push(turnRightRadarImages);

    // collision tests
    const forwardCollisionTest = movementCollisionTest(
        forwardRadarImages,
        keys,
        gameObject.arena,
        playerRig,
        deceleration
    );
    const turnLeftCollisionTest = movementCollisionTest(
        turnLeftRadarImages,
        keys,
        gameObject.arena,
        playerRig,
        deceleration
    );
    const turnRightCollisionTest = movementCollisionTest(
        turnRightRadarImages,
        keys,
        gameObject.arena,
        playerRig,
        deceleration
    );
    //console.log('collis f l r: ', forwardCollisionTest, turnLeftCollisionTest, turnRightCollisionTest);

    // check if in target
    const howLongTillTarget: number = distanceCheck(aiRig, aiRig.path);

    if (howLongTillTarget < 100) {
        aiRig.path.reached = true;
    } else {
        let bestDirection: string = 'reverse';
        let forwardValid: boolean = !forwardCollisionTest;
        let leftValid: boolean = !turnLeftCollisionTest;
        let rightValid: boolean = !turnRightCollisionTest;
        
        let distanceFromForward: number = distanceCheck(forwardRadarImages, aiRig.path);
        let distanceFromLeft: number = distanceCheck(turnLeftRadarImages, aiRig.path);
        let distanceFromRight: number = distanceCheck(turnRightRadarImages, aiRig.path);
        
        // Check for the best direction based on collision tests and distances
        if (forwardValid) {
            bestDirection = 'forward';
        }
        
        if (leftValid && (distanceFromLeft < distanceFromForward || !forwardValid)) {
            bestDirection = 'left';
        }
        
        if (rightValid && 
            (distanceFromRight < distanceFromForward || (!forwardValid && !leftValid))) {
            bestDirection = 'right';
        }
        
        if (!forwardValid && !leftValid && !rightValid) {
            bestDirection = 'reverse'; // Default to reverse if no valid options
        }

        switch (bestDirection) {
            case 'left':
                keys.ArrowLeft = true;
                if ((aiRig.velocityX + aiRig.velocityY) < 0.2) {
                    keys.ArrowUp = true;
                }
                break;
            case 'right':
                keys.ArrowRight = true;
                if ((aiRig.velocityX + aiRig.velocityY) < 0.2) {
                    keys.ArrowUp = true;
                }
                break;
            case 'forward':
                keys.ArrowUp = true;
                break;
            case 'reverse':
                keys.ArrowDown = true;
                break;
            default: console.log('ai movement. bestCase not found');
        }
    }
    return keys;
};

// Distance check
function distanceCheck(fromWhere: any, toWhere: any) {
    const a = fromWhere.x - toWhere.x // x1 - x2;
    const b = fromWhere.y - toWhere.y // y1 - y2;

    const c = Math.sqrt(a * a + b * b);
    return c;
}  
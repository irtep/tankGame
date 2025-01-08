import { Obstacle, Vehicle } from "../interfaces/sharedInterfaces";
import { isRotatedRectColliding } from "./collisionDetect";

// Check if rotating would cause a collision
const checkForRotationCollision = (rig: Vehicle, angleDelta: number, obstacles: Obstacle[], otherRig: Vehicle): boolean => {
    // Temporarily update the angle
    const testRig = { ...rig, angle: rig.angle + angleDelta };

    // Calculate the next potential position after applying velocity and rotation
    const nextRig: Vehicle = {
        ...testRig,
        x: testRig.x + testRig.velocityX,
        y: testRig.y + testRig.velocityY,
    };

    // Check for potential collisions with obstacles and the other rig
    const willCollide = obstacles.some((obstacle: Obstacle) =>
        isRotatedRectColliding(nextRig, {
            x: obstacle.x + obstacle.width / 2,
            y: obstacle.y + obstacle.height / 2,
            width: obstacle.width,
            height: obstacle.height,
            angle: 0,
        })
    ) || isRotatedRectColliding(nextRig, otherRig);

    return willCollide;
};

export const updateRigMovement = (
    rig: Vehicle,
    keys: { [key: string]: boolean },
    obstacles: Obstacle[],
    otherRig: Vehicle,
    deceleration: number ) => {

    // Update movement based on input keys
    if (keys.ArrowUp || keys.w) {
        rig.velocityX += Math.cos(rig.angle) * rig.acceleration;
        rig.velocityY += Math.sin(rig.angle) * rig.acceleration;
    }
    if (keys.ArrowDown || keys.s) {
        if (rig.type === 'tank') {
            rig.velocityX -= Math.cos(rig.angle) * rig.acceleration;
            rig.velocityY -= Math.sin(rig.angle) * rig.acceleration;
        } else {
            rig.velocityX -= Math.cos(rig.angle) * 0.05;
            rig.velocityY -= Math.sin(rig.angle) * 0.05;
        }
    }

    // Apply friction (deceleration)
    if (!keys.ArrowUp &&
        !keys.ArrowDown &&
        !keys.w &&
        !keys.s
        ) {
        rig.velocityX *= 1 - deceleration;
        rig.velocityY *= 1 - deceleration;
    }

    // Cap the speed to maxSpeed
    const speed = Math.sqrt(rig.velocityX ** 2 + rig.velocityY ** 2);
    if (speed > rig.speed) {
        const scale = rig.speed / speed;
        rig.velocityX *= scale;
        rig.velocityY *= scale;
    }

// Only change the angle if the new angle doesn't cause a collision
if (keys.ArrowLeft || keys.a) {
    if (!checkForRotationCollision(rig, -0.05, obstacles, otherRig)) {
        rig.angle -= 0.05;
    }
}

if (keys.ArrowRight || keys.d) {
    if (!checkForRotationCollision(rig, 0.05, obstacles, otherRig)) {
        rig.angle += 0.05;
    }
}

    // Calculate the next position
    const nextRig: Vehicle = {
        ...rig,
        x: rig.x + rig.velocityX,
        y: rig.y + rig.velocityY,
    };

    // Check for collisions
    if (
        !obstacles.some((obstacle: Obstacle) =>
            isRotatedRectColliding(nextRig, {
                x: obstacle.x + obstacle.width / 2,
                y: obstacle.y + obstacle.height / 2,
                width: obstacle.width,
                height: obstacle.height,
                angle: 0,
            })
        ) &&
        !isRotatedRectColliding(nextRig, otherRig)
    ) {
        Object.assign(rig, nextRig);
    } else {
        // Stop the rig's movement upon collision
        rig.velocityX = 0;
        rig.velocityY = 0;
    }
}

export const returnMovementTest = (
    range: number,
    rig: Vehicle,
    keys: { [key: string]: boolean },
    obstacles: Obstacle[],
    otherRig: Vehicle,
    deceleration: number ): Vehicle => {

    // Update movement based on input keys
    //if (keys.ArrowUp || keys.w) {
        rig.velocityX += Math.cos(rig.angle) * range;
        rig.velocityY += Math.sin(rig.angle) * range;
    //}
    /*
    if (keys.ArrowDown || keys.s) {
        if (rig.type === 'tank') {
            rig.velocityX -= Math.cos(rig.angle) * rig.acceleration;
            rig.velocityY -= Math.sin(rig.angle) * rig.acceleration;
        } else {
            rig.velocityX -= Math.cos(rig.angle) * 0.1;
            rig.velocityY -= Math.sin(rig.angle) * 0.1;
        }
    }
    */
    // Apply friction (deceleration)
    /*
    if (!keys.ArrowUp &&
        !keys.ArrowDown &&
        !keys.w &&
        !keys.s
        ) {
        rig.velocityX *= 1 - deceleration;
        rig.velocityY *= 1 - deceleration;
    }
    */
    // Cap the speed to maxSpeed
    /*
    const speed = Math.sqrt(rig.velocityX ** 2 + rig.velocityY ** 2);
    if (speed > rig.speed) {
        const scale = rig.speed / speed;
        rig.velocityX *= scale;
        rig.velocityY *= scale;
    }
    */
// Only change the angle if the new angle doesn't cause a collision
if (keys.ArrowLeft || keys.a) {
//    if (!checkForRotationCollision(rig, -0.05, obstacles, otherRig)) {
        rig.angle -= 0.05;
//    }
}

if (keys.ArrowRight || keys.d) {
 //   if (!checkForRotationCollision(rig, 0.05, obstacles, otherRig)) {
        rig.angle += 0.05;
//    }
}

    // Calculate the next position
    const nextRig: Vehicle = {
        ...rig,
        x: rig.x + rig.velocityX,
        y: rig.y + rig.velocityY,
    };

    // Check for collisions
    /*
    if (
        !obstacles.some((obstacle: Obstacle) =>
            isRotatedRectColliding(nextRig, {
                x: obstacle.x + obstacle.width / 2,
                y: obstacle.y + obstacle.height / 2,
                width: obstacle.width,
                height: obstacle.height,
                angle: 0,
            })
        ) &&
        !isRotatedRectColliding(nextRig, otherRig)
    ) {
        Object.assign(rig, nextRig);
    } else {
        // Stop the rig's movement upon collision
        rig.velocityX = 0;
        rig.velocityY = 0;
    }*/

    return nextRig;
}

export const movementCollisionTest = (
    rig: Vehicle,
    keys: { [key: string]: boolean },
    obstacles: Obstacle[],
    otherRig: Vehicle,
    deceleration: number
): boolean => {

    let collision: boolean = false;

    // Update movement based on input keys
    if (keys.ArrowUp || keys.w) {
        rig.velocityX += Math.cos(rig.angle) * rig.acceleration + 10;
        rig.velocityY += Math.sin(rig.angle) * rig.acceleration + 10;
    }
    if (keys.ArrowDown || keys.s) {
        if (rig.type === 'tank') {
            rig.velocityX -= Math.cos(rig.angle) * rig.acceleration;
            rig.velocityY -= Math.sin(rig.angle) * rig.acceleration;
        } else {
            rig.velocityX -= Math.cos(rig.angle) * 0.1;
            rig.velocityY -= Math.sin(rig.angle) * 0.1;
        }
    }

    // Apply friction (deceleration)
    /*
    if (!keys.ArrowUp &&
        !keys.ArrowDown &&
        !keys.w &&
        !keys.s
        ) {
        rig.velocityX *= 1 - deceleration;
        rig.velocityY *= 1 - deceleration;
    }
    */
    // Cap the speed to maxSpeed
    /*
    const speed = Math.sqrt(rig.velocityX ** 2 + rig.velocityY ** 2);
    if (speed > rig.speed) {
        const scale = rig.speed / speed;
        rig.velocityX *= scale;
        rig.velocityY *= scale;
    }
    */
if (keys.ArrowLeft || keys.a) {
 //   if (!checkForRotationCollision(rig, -0.05, obstacles, otherRig)) {
        rig.angle -= 0.05;
 //   }
}

if (keys.ArrowRight || keys.d) {
 //   if (!checkForRotationCollision(rig, 0.05, obstacles, otherRig)) {
        rig.angle += 0.05;
 //   }
}

    // Calculate the next position
    const nextRig: Vehicle = {
        ...rig,
        x: rig.x + rig.velocityX,
        y: rig.y + rig.velocityY,
    };

    // Check for collisions
    
    if (
        !obstacles.some((obstacle: Obstacle) =>
            isRotatedRectColliding(nextRig, {
                x: obstacle.x + obstacle.width / 2,
                y: obstacle.y + obstacle.height / 2,
                width: obstacle.width,
                height: obstacle.height,
                angle: 0,
            })
        ) &&
        !isRotatedRectColliding(nextRig, otherRig)
    ) {
        Object.assign(rig, nextRig);
    } else {
        collision = true;
    }

    return collision;
}
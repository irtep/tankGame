import { GameObject, Vehicle } from "../interfaces/sharedInterfaces";
import { aiRadarCheck } from "./radarCheck";

type InputKeys = { [key: string]: boolean };

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

    const radarAngleOffset = Math.PI / 180 * 25; // 25 degrees in radians
    const avoidDistance = 50; // Minimum distance to avoid obstacles
    const stuckThreshold = 0.5; // Velocity threshold to consider the AI stuck
    const recoveryTime = 60; // Frames before aggressive recovery mode
    const stuckFrames = aiRig.stuckFrames || 0;

    // Radar checks in three directions
    const forwardCheck = aiRadarCheck(gameObject, 'ai', 0, 'navigation');
    const leftCheck = aiRadarCheck(gameObject, 'ai', -radarAngleOffset, 'navigation');
    const rightCheck = aiRadarCheck(gameObject, 'ai', radarAngleOffset, 'navigation');

    const isForwardClear = !forwardCheck.collision || forwardCheck.distance > avoidDistance;
    const isLeftClear = !leftCheck.collision || leftCheck.distance > avoidDistance;
    const isRightClear = !rightCheck.collision || rightCheck.distance > avoidDistance;

    // Recovery logic for getting unstuck
    if (
        Math.abs(aiRig.velocityX) < stuckThreshold &&
        Math.abs(aiRig.velocityY) < stuckThreshold
    ) {
        aiRig.stuckFrames = (aiRig.stuckFrames || 0) + 1;

        // Aggressive recovery logic
        if (stuckFrames > recoveryTime) {
            keys.ArrowDown = true; // Reverse
            if (isLeftClear) {
                keys.ArrowLeft = true; // Turn left to escape
            } else if (isRightClear) {
                keys.ArrowRight = true; // Turn right to escape
            }
            return keys;
        }
    } else {
        aiRig.stuckFrames = 0; // Reset stuck frames if moving
    }

    // Main navigation logic
    if (isForwardClear) {
        // Move forward toward the player
        keys.ArrowUp = true;

        // Calculate angle difference to player
        const dx = playerRig.x - aiRig.x;
        const dy = playerRig.y - aiRig.y;
        const targetAngle = Math.atan2(dy, dx);
        const angleDifference = (targetAngle - aiRig.angle + Math.PI * 2) % (Math.PI * 2);

        if (angleDifference > 0.1 && angleDifference < Math.PI) {
            keys.ArrowRight = true;
        } else if (angleDifference > Math.PI) {
            keys.ArrowLeft = true;
        }
    } else if (isLeftClear) {
        // If forward blocked, prefer left if clear
        keys.ArrowLeft = true;
        keys.ArrowUp = true;
    } else if (isRightClear) {
        // If forward and left blocked, prefer right if clear
        keys.ArrowRight = true;
        keys.ArrowUp = true;
    } else {
        // If all directions blocked, reverse and adjust
        keys.ArrowDown = true;
        if (stuckFrames % 2 === 0) {
            keys.ArrowLeft = true;
        } else {
            keys.ArrowRight = true;
        }
    }

    return keys;
};


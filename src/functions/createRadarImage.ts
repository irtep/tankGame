import { RadarImage, Vehicle } from "../interfaces/sharedInterfaces";
/*
export const createRadarImage = (rig: Vehicle): RadarImage => {

    const radarImage = {
        x: rig.x,
        y: rig.y,
        angle: rig.angle,
        width: rig.width,
        height: rig.height 
    };

    return radarImage;
};
*/
/*
export const createRadarImage = (rig: Vehicle): RadarImage => {
    // Calculate the forward distance, which will be the distance from the rig to the front of the radar image
    const forwardDistance = rig.width / 2; // Half the width of the rig (adjust as needed)

    // Convert the rig's angle from degrees to radians
    const radians = (rig.angle * Math.PI) / 180;

    // Calculate the new position of the radar image based on the rig's position and heading
    const radarX = rig.x + Math.cos(radians) * forwardDistance;
    const radarY = rig.y + Math.sin(radians) * forwardDistance;

    // Create the radar image object
    const radarImage = {
        x: radarX,  // Position in front of the rig based on its heading
        y: radarY,
        angle: rig.angle,  // Same angle as the rig
        width: rig.width + 200,  // Make the radar image 200px longer
        height: rig.height
    };

    return radarImage;
};
*/
// Function to check if a ray intersects with a circle (arc)
const isRayIntersectingCircle = (rayStartX: any, rayStartY: any, rayEndX: any, rayEndY: any, circleX: any, circleY: any, radius: any) => {
    // Vector representing the ray's direction
    const rayDirX = rayEndX - rayStartX;
    const rayDirY = rayEndY - rayStartY;

    // Vector from ray start to circle center
    const dx = circleX - rayStartX;
    const dy = circleY - rayStartY;

    // Quadratic formula variables (A, B, C)
    const a = rayDirX * rayDirX + rayDirY * rayDirY;
    const b = 2 * (dx * rayDirX + dy * rayDirY);
    const c = dx * dx + dy * dy - radius * radius;

    // Discriminant of the quadratic equation
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return false;  // No intersection
    }

    // We have an intersection, now check if it's in front of the ray
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b - sqrtDiscriminant) / (2 * a);
    const t2 = (-b + sqrtDiscriminant) / (2 * a);

    // Only consider intersections where t1 or t2 is positive (in front of the ray)
    return t1 >= 0 || t2 >= 0;
};

// Function to check if there's an arc in front of the rig
export const checkIfArcInFront = (rig: any, arc: any) => {
    console.log('rig: ', rig, ' arc: ', arc);

    const forwardDistance = rig.width * 2;  // Distance to check in front of the rig
    const radians = (rig.angle * Math.PI) / 180;

    // Calculate the end point of the ray (based on rig's angle)
    const rayEndX = rig.x + Math.cos(radians) * forwardDistance;
    const rayEndY = rig.y + Math.sin(radians) * forwardDistance;

    // Vector from rig to arc center
    const dx = arc.x - rig.x;
    const dy = arc.y - rig.y;

    // Calculate the angle of the vector from rig to arc center
    const arcAngle = Math.atan2(dy, dx);

    // If the arc is more than 90 degrees from the rig's facing angle, it's not in front
    const angleDifference = Math.abs(rig.angle * Math.PI / 180 - arcAngle);
    if (angleDifference > Math.PI / 2) {
        console.log("Arc is behind or to the side of the rig.");
        return false;  // Arc is not in front
    }

    // Check for intersection
    if (isRayIntersectingCircle(rig.x, rig.y, rayEndX, rayEndY, arc.x, arc.y, arc.radius)) {
        console.log("Arc detected in front of the rig!");
        return true;  // Arc found in front
    }

    console.log("No arc in front.");
    return false;  // No arc found in front
};

// Example usage:
const rig = {
    x: 600,
    y: 500,
    width: 50,
    height: 30,
    angle: 45,  // Direction the rig is facing
};

const arc = { x: 650, y: 550, radius: 30 };  // Example arc obstacle

console.log('Arc in front:', checkIfArcInFront(rig, arc));








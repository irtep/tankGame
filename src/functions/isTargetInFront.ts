import { Vehicle } from "../interfaces/sharedInterfaces";

export function isTargetInFront(scanningRig: Vehicle, targetRig: Vehicle): boolean {
    // Helper function to rotate a point around a pivot
    function rotatePoint(x: number, y: number, pivotX: number, pivotY: number, angle: number): { x: number; y: number } {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: cos * (x - pivotX) - sin * (y - pivotY) + pivotX,
            y: sin * (x - pivotX) + cos * (y - pivotY) + pivotY,
        };
    }

    // Get corners of a rotated rectangle (target or scanning rig)
    function getRotatedCorners(rig: Vehicle): { x: number; y: number }[] {
        const halfWidth = rig.width / 2;
        const halfHeight = rig.height / 2;

        const corners = [
            { x: rig.x - halfWidth, y: rig.y - halfHeight }, // Top-left
            { x: rig.x + halfWidth, y: rig.y - halfHeight }, // Top-right
            { x: rig.x + halfWidth, y: rig.y + halfHeight }, // Bottom-right
            { x: rig.x - halfWidth, y: rig.y + halfHeight }, // Bottom-left
        ];

        // Rotate each corner around the rig's center
        return corners.map(corner => rotatePoint(corner.x, corner.y, rig.x, rig.y, rig.angle));
    }

    // Check if two polygons intersect using SAT
    function polygonsIntersect(poly1: { x: number; y: number }[], poly2: { x: number; y: number }[]): boolean {
        function projectPolygon(points: { x: number; y: number }[], axis: { x: number; y: number }): [number, number] {
            const projections = points.map(point => point.x * axis.x + point.y * axis.y);
            return [Math.min(...projections), Math.max(...projections)];
        }

        function overlap(proj1: [number, number], proj2: [number, number]): boolean {
            return proj1[1] >= proj2[0] && proj2[1] >= proj1[0];
        }

        function getAxes(points: { x: number; y: number }[]): { x: number; y: number }[] {
            const axes = [];
            for (let i = 0; i < points.length; i++) {
                const next = (i + 1) % points.length;
                const edge = { x: points[next].x - points[i].x, y: points[next].y - points[i].y };
                axes.push({ x: -edge.y, y: edge.x }); // Perpendicular vector
            }
            return axes;
        }

        const axes = [...getAxes(poly1), ...getAxes(poly2)];
        for (const axis of axes) {
            const proj1 = projectPolygon(poly1, axis);
            const proj2 = projectPolygon(poly2, axis);
            if (!overlap(proj1, proj2)) return false; // No overlap means no intersection
        }
        return true;
    }

    // Define the scanning beam as a rectangle extended forward from the rig's current facing direction
    const beamLength = 800; // Extend length for "front beam"
    const halfWidth = scanningRig.width / 2;

    // Calculate the bottom-left and bottom-right corners of the beam at the rig's current position
    const bottomLeft = { x: scanningRig.x - halfWidth, y: scanningRig.y };
    const bottomRight = { x: scanningRig.x + halfWidth, y: scanningRig.y };

    // Now, calculate the top-left and top-right corners of the beam based on the rig's angle
    // Move the top corners along the direction of the rig's facing angle
    const topLeft = { 
        x: scanningRig.x - halfWidth + Math.cos(scanningRig.angle) * beamLength, 
        y: scanningRig.y + Math.sin(scanningRig.angle) * beamLength 
    };
    const topRight = { 
        x: scanningRig.x + halfWidth + Math.cos(scanningRig.angle) * beamLength, 
        y: scanningRig.y + Math.sin(scanningRig.angle) * beamLength 
    };

    // Rotate the four corners of the beam to align with the rig's facing angle
    const beamCorners = [
        rotatePoint(bottomLeft.x, bottomLeft.y, scanningRig.x, scanningRig.y, scanningRig.angle),
        rotatePoint(bottomRight.x, bottomRight.y, scanningRig.x, scanningRig.y, scanningRig.angle),
        rotatePoint(topRight.x, topRight.y, scanningRig.x, scanningRig.y, scanningRig.angle),
        rotatePoint(topLeft.x, topLeft.y, scanningRig.x, scanningRig.y, scanningRig.angle),
    ];

    // Get the target rig's rotated corners
    const targetCorners = getRotatedCorners(targetRig);

    // Check for intersection between the beam and the target
    return polygonsIntersect(beamCorners, targetCorners);
}

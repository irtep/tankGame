// Function for detecting collision between two rectangles
export const isRectColliding = (
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }) => {
        
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
};

export const isRotatedRectColliding = (
    rect1: { x: number; y: number; width: number; height: number; angle: number },
    rect2: { x: number; y: number; width: number; height: number; angle: number }
) => {
    const getCorners = (rect: any) => {
        const cos = Math.cos(rect.angle);
        const sin = Math.sin(rect.angle);

        const halfW = rect.width / 2;
        const halfH = rect.height / 2;

        return [
            { x: rect.x + cos * halfW - sin * halfH, y: rect.y + sin * halfW + cos * halfH },
            { x: rect.x - cos * halfW - sin * halfH, y: rect.y - sin * halfW + cos * halfH },
            { x: rect.x - cos * halfW + sin * halfH, y: rect.y - sin * halfW - cos * halfH },
            { x: rect.x + cos * halfW + sin * halfH, y: rect.y + sin * halfW - cos * halfH },
        ];
    };

    const project = (corners: any[], axis: any) => {
        return corners.map((corner) => corner.x * axis.x + corner.y * axis.y);
    };

    const overlap = (proj1: any[], proj2: any[]) => {
        const max1 = Math.max(...proj1);
        const min1 = Math.min(...proj1);
        const max2 = Math.max(...proj2);
        const min2 = Math.min(...proj2);

        return max1 >= min2 && max2 >= min1;
    };

    const corners1 = getCorners(rect1);
    const corners2 = getCorners(rect2);

    const axes = [
        { x: corners1[1].x - corners1[0].x, y: corners1[1].y - corners1[0].y },
        { x: corners1[3].x - corners1[0].x, y: corners1[3].y - corners1[0].y },
        { x: corners2[1].x - corners2[0].x, y: corners2[1].y - corners2[0].y },
        { x: corners2[3].x - corners2[0].x, y: corners2[3].y - corners2[0].y },
    ];

    for (const axis of axes) {
        const proj1 = project(corners1, axis);
        const proj2 = project(corners2, axis);

        if (!overlap(proj1, proj2)) return false;
    }

    return true;
};
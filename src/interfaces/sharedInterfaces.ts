export interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
};

export interface Hit {
    x: number;
    y: number;
};

export interface Vehicle {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    speed: number;
    hitPoints: number;
};
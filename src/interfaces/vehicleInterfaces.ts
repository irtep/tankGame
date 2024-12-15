export interface Vehicle {
    name: string;
    chassis: string;
    motor: string;
    tires: string;
    armour: string;
    description: string;
    stats: string;
};

export interface Hull {
    name: string;
    x: number;
    y: number;
    h: number;
    w: number;
    color: string;
};

export interface SideWindow {
    name: string;
    color: string;
    h: number;
};

export interface FrontOrBackWindow {
    name: string;
    color: string;
    w: number;
};

export interface SpeedStripe {
    name: string;
    color: string;
    h: number;
};

export interface PiecesOfVehicle {
    hull: Hull;
    leftFrontWindow?: SideWindow;
    rightFrontWindow?: SideWindow;
    frontWindow?: FrontOrBackWindow;
    leftRearWindow?: SideWindow;
    rightRearWindow?: SideWindow;
    rearWindow?: FrontOrBackWindow;
    speedStripe?: SpeedStripe;
};

export interface DrawPoint {
    x: number;
    y: number;
};

export interface Chassis {
    name: string;
    weight: number;
    armour: number;
    durability: number;
    cost: number;
    pieces: PiecesOfVehicle;
    drawPoint: DrawPoint;
};

export interface Motor {
    name: string;
    power: number;
    maxSpeed: number;
    weight: number;
    durability: number;
    cost: number;
    desc: string;
};

export interface Tire {
    name: string;
    grip: number;
    cost: number;
    weight: number;
    desc: string;
};

export interface Armour {
    name: string;
    weight: number;
    value: number;
    cost: 100;
    desc: string;
};
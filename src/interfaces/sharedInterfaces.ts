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
    desc?: string;
    battleImg?: string;
    descImg?: string;
    turretGun?: string; // fires from back center
    leftSideGun?: string; // fires from side, quite front
    rightSideGun?: string; // fires from side, quite front
    leftBackGun?: string; // fires from side, quite back
    rightBackGun?: string; // fires from side, quite back
};

export interface Bullet {
    x: number;
    y: number;
    angle: number;
    owner: 'player' | 'ai';
    color: string;
    damage: number;
};

export interface Weapon {
    name: string;
    type: string;
    color: string;
    bulletSize: number;
    turret: boolean;
    damage: number;
    impactPower: number;
    cooldown: number;
    specials: string[];
    cost: number;
    speed: number;
};
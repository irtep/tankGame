export interface Obstacle {
    x: number;
    y: number;
    angle: number;
    width: number;
    height: number;
};

export interface Hit {
    x: number;
    y: number;
};

export interface ArmedWeapon {
    name: string;
    cooldown: number;
}

export interface WeaponArray {
    turretGun?: ArmedWeapon; // fires from back center
    leftSideGun?: ArmedWeapon; // fires from side, quite front
    rightSideGun?: ArmedWeapon; // fires from side, quite front
    leftBackGun?: ArmedWeapon; // fires from side, quite back
    rightBackGun?: ArmedWeapon; // fires from side, quite back
};

export interface Vehicle {
    name: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    speed: number;
    acceleration: number;
    armour: number;
    velocityX: number;
    velocityY: number;
    hitPoints: number;
    desc?: string;
    battleImg?: string;
    descImg?: string;
    reloadStatus?: number;
    weapons: WeaponArray;
};

export interface VehicleWithRole {
    vehicle: Vehicle;
    role: 'player' | 'ai';
}

export interface Bullet {
    x: number;
    y: number;
    angle: number;
    owner: 'player' | 'ai';
    color: string;
    damage: number;
    size: number;
    specials?: string[];
    speed: number;
};

export interface Coordinates {
    x: number;
    y: number;
    angle: number;
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
    costInSpeed: number;
    speed: number;
};
export interface Obstacle {
    img: string; // use png's
    x: number;
    y: number;
    angle: number;
    width: number;
    height: number;
};

export interface Hit {
    x: number;
    y: number;
    damage: number;
};

export interface RadarImage {
    x: number;
    y: number;
    a: number;
};

export interface ArmedWeapon {
    name: string;
    cooldown: number;
    offsetX: number;
    offsetY: number;
}

export interface WeaponArray {
    turretGun?: ArmedWeapon; // fires from back center
    leftSideGun?: ArmedWeapon; // fires from side, quite front
    rightSideGun?: ArmedWeapon; // fires from side, quite front
    leftBackGun?: ArmedWeapon; // fires from side, quite back
    rightBackGun?: ArmedWeapon; // fires from side, quite back
};

export interface CollisionReport {
    collision: boolean;
    withWhat: string;
};

export interface AiCollisionReport {
    collision: boolean;
    withWhat: string;
    distance: number;
};

export interface GameObject {
  vehicles: VehicleWithRole[],
  arena: Obstacle[],
  hits: Hit[],
  bullets: Bullet[],
  updateCounter: number;
  radars: Vehicle[],
  mouseNowX: number,
  mouseNowY: number
};

export interface MatchEndState {
  winner: string;
  gameObject: GameObject
}

export interface PathTarget {
    x: number;
    y: number;
    reached: boolean;
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
    maxHitPoints: number;
    hitPoints: number;
    desc?: string;
    battleImg?: string;
    descImg?: string;
    reloadStatus?: number;
    weapons: ArmedWeapon[];
    path: PathTarget;
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
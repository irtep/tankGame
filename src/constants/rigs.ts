import { Verified } from "@mui/icons-material";
import { Vehicle, VehicleWithRole } from "../interfaces/sharedInterfaces";

export const rigs: Vehicle[] = [
    {
        name: 'Bullterrier',
        type: 'car',
        x: 0,
        y: 0,
        width: 45, // this is from front to rear
        height: 32, // side to side
        angle: 0,
        speed: 3,
        velocityX: 0,
        velocityY: 0,
        acceleration: 0.1,
        hitPoints: 9,
        armour: 0.1,
        desc: 'Heavily armed hotrod offers good movement and good firepower with accelerator, microbeams and micro missile pods',
        battleImg: 'bullterrier_battle.png',
        descImg: 'bullterrier_desc.jpg',
        reloadStatus: 0,
        weapons: {
            turretGun:
            {
                name: 'accelerator',
                cooldown: 0 // 0 is ready fire
            },
            leftSideGun: {
                name: 'microbeam',
                cooldown: 0
            },
            rightSideGun: {
                name: 'microbeam',
                cooldown: 0
            }
        },
    },
    {
        name: 'Amazonas',
        type: 'car',
        x: 0,
        y: 0,
        width: 46,
        height: 35,
        angle: 0,
        speed: 3,
        velocityX: 0,
        velocityY: 0,
        acceleration: 0.1,
        hitPoints: 9,
        armour: 0.2,
        desc: 'Amazonas is designed for fighting close distance with deadly vanguard and slam ram',
        battleImg: 'amazonas_battle.png',
        descImg: 'amazonas_desc.jpg',
        reloadStatus: 0,
        weapons: {
            turretGun: {
                name: 'vanguard',
                cooldown: 0
            },
            leftSideGun: {
                name: 'microbeam',
                cooldown: 0
            },
            rightSideGun: {
                name: 'microbeam',
                cooldown: 0
            },
            leftBackGun: {
                name: 'micro rocket pod',
                cooldown: 0
            },
            rightBackGun: {
                name: 'micro rocket pod',
                cooldown: 0
            },
        }
    },
    {
        name: 'Leprechaun',
        type: 'tank',
        x: 0,
        y: 0,
        width: 37,
        height: 50,
        angle: 0,
        speed: 2,
        velocityX: 0,
        velocityY: 0,
        acceleration: 0.05,
        hitPoints: 12,
        armour: 0.5,
        desc: 'This All-terrain roller terrorizes opponents with rapid bursts of its rattler.',
        battleImg: 'leprechaun_battle.png',
        descImg: 'leprechaun_desc.jpg',
        reloadStatus: 0,
        weapons: {
            turretGun: {
                name: 'rattler',
                cooldown: 0
            },
            leftSideGun: {
                name: 'micro rocket pod',
                cooldown: 0
            },
            rightSideGun: {
                name: 'micro rocket pod',
                cooldown: 0
            },
        }
    },
    {
        name: 'Ice',
        type: 'bike',
        x: 0,
        y: 0,
        width: 43,
        height: 25,
        angle: 0,
        speed: 5,
        velocityX: 0,
        velocityY: 0,
        acceleration: 0.2,
        armour: 0,
        hitPoints: 9,
        desc: 'Desert spear Ice is for friends of fast speeds and long ranged missiles',
        battleImg: 'ice_battle.png',
        descImg: 'ice_desc.jpg',
        reloadStatus: 0,
        weapons: {
            turretGun: {
                name: 'shreik missiles',
                cooldown: 0
            },
            leftSideGun: {
                name: 'microbeam',
                cooldown: 0
            },
            rightSideGun: {
                name: 'microbeam',
                cooldown: 0
            },
        }
    },
    {
        name: 'Starblade',
        type: 'car',
        x: 0,
        y: 0,
        width: 48,
        height: 32,
        angle: 0,
        speed: 3,
        velocityX: 0,
        velocityY: 0,
        acceleration: 0.1,
        armour: 0.1,
        hitPoints: 9,
        desc: 'If you like huge cannons and vengeances... Starblade with vengeance cannon is what you need.',
        battleImg: 'starblade_battle.png',
        descImg: 'starblade_desc.jpg',
        reloadStatus: 0,
        weapons: {
            turretGun: {
                name: 'vengeance cannon',
                cooldown: 0
            },
            leftSideGun: {
                name: 'blaster',
                cooldown: 0
            },
            rightSideGun: {
                name: 'blaster',
                cooldown: 0
            }
        }
    }
];

export const placeHolder1: VehicleWithRole = {
    vehicle: {
        name: 'test Rig',
        type: 'car',
        x: 800 / 2,
        y: 600 / 2,
        width: 40,
        height: 20,
        angle: 0,
        speed: 3,
        velocityX: 0,
        velocityY: 0,
        acceleration: 0.1,
        armour: 0,
        hitPoints: 9,
        weapons: {},
    },
    role: 'player',
}

export const placeHolder2: VehicleWithRole = {
    vehicle: {
        name: 'ai Rig',
        type: 'car',
        x: 800 / 4,
        y: 600 / 4,
        width: 40,
        height: 20,
        angle: 0,
        speed: 3,
        velocityX: 0,
        velocityY: 0,
        acceleration: 0.1,
        armour: 0,
        hitPoints: 9,
        weapons: {},
    },
    role: 'ai',
}
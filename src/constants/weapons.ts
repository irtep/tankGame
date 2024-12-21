import { Weapon } from "../interfaces/sharedInterfaces";

export const weapons: Weapon[] = [
    {
        name: 'rattler',
        type: 'shell',
        color: 'red',
        bulletSize: 2,
        turret: true,
        damage: 0.2,
        impactPower: 4,
        cooldown: 0.5,
        specials: ['suppressing'],
        cost: 1,
        speed: 4
    },
    {
        name: 'vengeance cannon',
        type: 'shell',
        color: 'black',
        bulletSize: 10,
        turret: true,
        damage: 3,
        impactPower: 6,
        cooldown: 5,
        specials: ['detonate 5'],
        cost: 2,
        speed: 1
    },
    {
        name: 'shreik missiles',
        type: 'missile',
        color: 'white',
        bulletSize: 10,
        turret: true,
        damage: 3,
        impactPower: 6,
        cooldown: 5,
        specials: ['homing'],
        cost: 2,
        speed: 1
    },
    {
        name: 'vanguard',
        type: 'shell',
        color: 'black',
        bulletSize: 5,
        turret: true,
        damage: 1,
        impactPower: 4,
        cooldown: 1,
        specials: ['point blank'],
        cost: 1,
        speed: 1
    },
    {
        name: 'accelerator',
        type: 'shell',
        color: 'black',
        bulletSize: 5,
        turret: true,
        damage: 1,
        impactPower: 4,
        cooldown: 1,
        specials: ['ignores fields'],
        cost: 1,
        speed: 1
    },
    {
        name: 'micro rocket pod',
        type: 'missile',
        color: 'white',
        bulletSize: 1,
        turret: false,
        damage: 0,
        impactPower: 3,
        cooldown: 1,
        specials: ['light'],
        cost: 0,
        speed: 0
    },
    {
        name: 'microbeam',
        type: 'energy',
        color: 'cyan',
        bulletSize: 1,
        turret: false,
        damage: 0,
        impactPower: 3,
        cooldown: 1,
        specials: ['light'],
        cost: 0,
        speed: 0
    },
    {
        name: 'blaster',
        type: 'shell',
        color: 'black',
        bulletSize: 1,
        turret: false,
        damage: 0,
        impactPower: 3,
        cooldown: 0.5,
        specials: ['light'],
        cost: 0,
        speed: 0
    }
];
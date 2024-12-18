import { Vehicle } from "../interfaces/sharedInterfaces";

export const rigs: Vehicle[] = [
    {
        name: 'Bullterrier',
        x: 0,
        y: 0,
        width: 45, // this is from front to rear
        height: 32, // side to side
        angle: 0,
        speed: 3,
        hitPoints: 9,
        desc: 'Heavily armed hotrod offers good movement and good firepower with accelerator, microbeams and micro missile pods',
        battleImg: 'bullterrier_battle.png',
        descImg: 'bullterrier_desc.jpg'
    },
    {
        name: 'Amazonas',
        x: 0,
        y: 0,
        width: 46,
        height: 35,
        angle: 0,
        speed: 3,
        hitPoints: 9,
        desc: 'Amazonas is designed for fighting close distance with deadly vanguard and slam ram',
        battleImg: 'amazonas_battle.png',
        descImg: 'amazonas_desc.jpg'
    },
    {
        name: 'Leprechaun',
        x: 0,
        y: 0,
        width: 37,
        height: 50,
        angle: 0,
        speed: 3,
        hitPoints: 9,
        desc: 'This All-terrain roller terrorizes opponents with rapid bursts of its rattler.',
        battleImg: 'leprechaun_battle.png',
        descImg: 'leprechaun_desc.jpg'
    },
    {
        name: 'Ice',
        x: 0,
        y: 0,
        width: 43,
        height: 25,
        angle: 0,
        speed: 3,
        hitPoints: 9,
        desc: 'Desert spear Ice is for friends of fast speeds and long ranged missiles',
        battleImg: 'ice_battle.png',
        descImg: 'ice_desc.jpg'
    },
    {
        name: 'Starblade',
        x: 0,
        y: 0,
        width: 48,
        height: 32,
        angle: 0,
        speed: 3,
        hitPoints: 9,
        desc: 'If you like huge cannons and vengeances... Starblade with vengeance cannon is what you need.',
        battleImg: 'starblade_battle.png',
        descImg: 'starblade_desc.jpg'
    }
];
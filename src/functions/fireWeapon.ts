import { Bullet, Coordinates, Vehicle, Weapon } from "../interfaces/sharedInterfaces";

export const fireWeapon = (
    from: Coordinates,
    weapon: Weapon,
    bullets: Bullet[], 
    owner: 'player' | 'ai',
    shooter: Vehicle
    ): Bullet[] => {
    
    if (shooter.weapons.turretGun) {
        shooter.weapons.turretGun.cooldown = weapon.cooldown;
    }
    
    bullets.push({
        x: from.x,
        y: from.y,
        angle: from.angle,
        owner: owner,
        color: weapon.color,
        size: weapon.bulletSize,
        damage: weapon.damage,
        speed: weapon.speed
    });

    return bullets;
};
import { Bullet, Coordinates, Vehicle, Weapon } from "../interfaces/sharedInterfaces";

function getRandomNumber(max: number): number {
    if (max < 0) {
        throw new Error("Maximum value must be a non-negative number.");
    }
    return Math.floor(Math.random() * (max + 1));
}

const createBullet = (
    x: number,
    y: number,
    angle: number,
    owner: 'player' | 'ai',
    color: string,
    size: number,
    damage: number,
    speed: number,
): Bullet => {

    return {
        x: x,
        y: y,
        angle: angle,
        owner: owner,
        color: color,
        size: size,
        damage: damage,
        speed: speed
    }
}

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

    const speedOfShooter: number = Math.abs(shooter.velocityX) + Math.abs(shooter.velocityY);

    bullets.push(createBullet(
        from.x,
        from.y,
        from.angle,
        owner,
        weapon.color,
        weapon.bulletSize,
        weapon.damage,
        weapon.speed
    ));

    if (weapon.specials.includes('suppressing') ||
        weapon.specials.includes('point blank')
    ) {
        let repeatingTimes: number = 0;
        let spread: number = 0;
        let angleOffset: number = 0;

        if (weapon.specials.includes('suppressing')) {
            repeatingTimes = 4
            spread = 10;
            angleOffset = 50;
        }
        if (weapon.specials.includes('point blank')) {
            repeatingTimes = 3
            spread = 20;
            angleOffset = 40;
        }

        for (let i = 0; i < repeatingTimes; i++) {
            bullets.push(createBullet(
                from.x + (getRandomNumber(spread)),
                from.y + (getRandomNumber(spread)),
                from.angle + (i/ angleOffset),
                owner,
                weapon.color,
                weapon.bulletSize,
                weapon.damage,
                weapon.speed
            ));
        }
    }

    return bullets;
};
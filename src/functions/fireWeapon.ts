import { weapons } from "../constants/weapons";
import { ArmedWeapon, Bullet, Coordinates, GameObject, Vehicle, Weapon } from "../interfaces/sharedInterfaces";
import { playSound } from './utils';

function getRandomNumber(max: number): number {
    if (max < 0) {
        throw new Error("Maximum value must be a non-negative number.");
    }
    return Math.floor(Math.random() * (max + 1));
}

const weaponTypeToSoundMap: Record<string, string> = {
    shell: 'cannonShoots',
    energy: 'energyShoots',
    missile: 'missileShoots',
    shellBurst: 'burstShoots'
};

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
    shooter: Vehicle,
    weaponsIndex: number
): Bullet[] => {

    if (weapon.cooldown) {
        shooter.weapons[weaponsIndex].cooldown = weapon.cooldown;
    }

    // Dynamically play the sound based on weapon type
    const soundName = weaponTypeToSoundMap[weapon.type];
    if (soundName) {
        playSound(soundName);
    }

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
            repeatingTimes = 4;
            spread = 10;
            angleOffset = 50;

            for (let i = 0; i < repeatingTimes; i++) {
                bullets.push(createBullet(
                    from.x + (getRandomNumber(spread)),
                    from.y + (getRandomNumber(spread)),
                    from.angle + (i / angleOffset),
                    owner,
                    weapon.color,
                    weapon.bulletSize,
                    weapon.damage,
                    weapon.speed
                ));
            }
        }
        if (weapon.specials.includes('point blank')) {
            const repeatingTimes = 4;
            const spacing = 7; // Adjust this value to control the spacing between bullets

            for (let i = 0; i < repeatingTimes; i++) {
                // Calculate the perpendicular angle to the shooting direction
                const perpendicularAngle = from.angle + Math.PI / 2;

                // Calculate the offset based on the perpendicular angle
                const offsetX = Math.cos(perpendicularAngle) * (i - (repeatingTimes - 1) / 2) * spacing;
                const offsetY = Math.sin(perpendicularAngle) * (i - (repeatingTimes - 1) / 2) * spacing;

                bullets.push(createBullet(
                    from.x + offsetX,
                    from.y + offsetY,
                    from.angle, // Bullets still travel in the shooting direction
                    owner,
                    weapon.color,
                    weapon.bulletSize,
                    weapon.damage,
                    weapon.speed
                ));
            }
        }

        /* this shoots a row of bullets, if needed
        if (weapon.specials.includes('point blank')) {
            const repeatingTimes = 4;
            const spacing = 7; // Adjust this value to control the spacing between bullets

            for (let i = 0; i < repeatingTimes; i++) {
                // Calculate the offset based on the angle
                const offsetX = Math.cos(from.angle) * (i - (repeatingTimes - 1) / 2) * spacing;
                const offsetY = Math.sin(from.angle) * (i - (repeatingTimes - 1) / 2) * spacing;

                bullets.push(createBullet(
                    from.x + offsetX,
                    from.y + offsetY,
                    from.angle,
                    owner,
                    weapon.color,
                    weapon.bulletSize,
                    weapon.damage,
                    weapon.speed
                ));
            }
        }
        */
    }

    return bullets;
};

export const shoot = (
    shootingRig: Vehicle,
    gameObject: GameObject,
    turretsAngle: number,
    //checkingRadar: CollisionReport,
    inFrontArc: boolean,
    playerShooting: boolean
): void => {
    shootingRig.weapons.forEach((weaponInTurn: ArmedWeapon, i: number) => {
        const shootingGun: Weapon | undefined = weapons.find(w => w.name === weaponInTurn.name);

        if (shootingGun && weaponInTurn.cooldown <= 0) {
            // turret weapons
            if (shootingGun.turret) {
                //console.log('turret gun');
                gameObject.bullets = fireWeapon(
                    {
                        x: shootingRig.x + weaponInTurn.offsetX,
                        y: shootingRig.y + weaponInTurn.offsetY,
                        angle: turretsAngle,
                    },
                    shootingGun,
                    gameObject.bullets,
                    playerShooting ? 'player' : 'ai',
                    shootingRig,
                    i
                );
            } else {
                //console.log('not turret');
                // non turreted weapons

                /*checkingRadar.withWhat === 'ai' ||
                checkingRadar.withWhat === 'player'*/
                if (inFrontArc) {
                    // Calculate rotated offsets
                    const rotatedOffsetX = weaponInTurn.offsetX * Math.cos(turretsAngle) - weaponInTurn.offsetY * Math.sin(turretsAngle);
                    const rotatedOffsetY = weaponInTurn.offsetX * Math.sin(turretsAngle) + weaponInTurn.offsetY * Math.cos(turretsAngle);

                    // Fire the weapon with adjusted coordinates
                    gameObject.bullets = fireWeapon(
                        {
                            x: shootingRig.x + rotatedOffsetX,
                            y: shootingRig.y + rotatedOffsetY,
                            angle: turretsAngle,
                        },
                        shootingGun,
                        gameObject.bullets,
                        playerShooting ? 'player' : 'ai',
                        shootingRig,
                        i
                    );
                } else {
                    // Handle non-front AI or other cases
                    //console.log('AI not at front');
                }
            }
        } else {
            //console.log('not found, or cooldown not ok', shootingGun?.cooldown);
        }
    });
};



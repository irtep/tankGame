import { weapons } from "../constants/weapons";
import { ArmedWeapon, Bullet, CollisionReport, Coordinates, GameObject, Vehicle, Weapon } from "../interfaces/sharedInterfaces";

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
    shooter: Vehicle,
    weaponsIndex: number
): Bullet[] => {

    if (weapon.cooldown) {
        shooter.weapons[weaponsIndex].cooldown = weapon.cooldown;
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
            repeatingTimes = 4

            for (let i = 0; i < repeatingTimes; i++) {
                bullets.push(createBullet(
                    from.x,
                    from.y - 15 + (i*7),
                    from.angle,
                    owner,
                    weapon.color,
                    weapon.bulletSize,
                    weapon.damage,
                    weapon.speed
                ));
            }
        }


    }

    return bullets;
};

export const shoot = (
    shootingRig: Vehicle,
    gameObject: GameObject,
    turretsAngle: number,
    checkingRadar: CollisionReport,
    playerShooting: boolean
): void => {
    shootingRig.weapons.forEach((weaponInTurn: ArmedWeapon, i: number) => {
        const shootingGun: Weapon | undefined = weapons.find(w => w.name === weaponInTurn.name);

        if (shootingGun && weaponInTurn.cooldown <= 0) {
            //console.log('cooldown ok for ', shootingGun.name);
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
                if (
                    checkingRadar.withWhat === 'ai' ||
                    checkingRadar.withWhat === 'player'
                ) {
                    //console.log('ai at front');
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
                    //console.log('ai not at front');
                }
            }
        } else {
            //console.log('not found, or cooldown not ok', shootingGun?.cooldown);
        }
    });
};



import { VehicleWithRole } from "../interfaces/sharedInterfaces";

export const reloadWeapons = (vehicles: VehicleWithRole[]) => {
    if (vehicles) {
        vehicles.forEach((v: VehicleWithRole) => {
            if (v.vehicle.weapons.turretGun &&
                v.vehicle.weapons.turretGun.cooldown > 0
            ) {
                v.vehicle.weapons.turretGun.cooldown--; // cooling down

                if (v.vehicle.weapons.turretGun.cooldown < 0) {
                    v.vehicle.weapons.turretGun.cooldown = 0;
                }
            }
        });
    }
};

import { ArmedWeapon, VehicleWithRole } from "../interfaces/sharedInterfaces";

export const reloadWeapons = (vehicles: VehicleWithRole[]) => {
    if (vehicles) {
        vehicles.forEach((v: VehicleWithRole) => {
            v.vehicle.weapons.forEach( (w: ArmedWeapon) => {
                if (w.cooldown > 0) {
                    w.cooldown--;
                }
                if (w.cooldown < 0) {
                    w.cooldown = 0;
                }
            });
        });
    }
};

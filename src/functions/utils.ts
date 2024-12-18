import { rigs } from "../constants/rigs";
import { Vehicle } from "../interfaces/sharedInterfaces";

export const getRigByName = (name: string) => rigs.find((rig: Vehicle) => rig.name === name);
import { rigs } from "../constants/rigs";
import { Vehicle } from "../interfaces/sharedInterfaces";

export const getRigByName = (name: string) => {
    const rig = rigs.find((rig: Vehicle) => rig.name === name);
    return rig ? JSON.parse(JSON.stringify(rig)) : undefined;
  };

export const playSound = (soundName: string) => {
    //const audio = new Audio(`/sounds/${soundName}.ogg`);
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/${soundName}.ogg`);
    audio.currentTime = 0;
    audio.play().catch((error) => {
        console.error(`Failed to play sound: ${soundName}`, error);
    });
};
import { GameObject, Vehicle } from "../interfaces/sharedInterfaces";
import { shoot } from "./fireWeapon";

// Keyboard state
// supports arrows and wsad
export const keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false,
};

// Event listeners for keyboard
export const handleKeyDown = (e: KeyboardEvent) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
};

export const handleKeyUp = (e: KeyboardEvent) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
};

export const handleMouseDown = (
    e: MouseEvent,
    canvasRef: React.RefObject<HTMLCanvasElement> | null,
    gameObject: GameObject
) => {
    if (!canvasRef) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect: DOMRect = canvas.getBoundingClientRect();
    const mouseX: number = e.clientX - rect.left;
    const mouseY: number = e.clientY - rect.top;
    const playerRig: Vehicle | undefined = gameObject.vehicles.find(v => v.role === 'player')?.vehicle;
    const aiRig: Vehicle | undefined = gameObject.vehicles.find(v => v.role === 'ai')?.vehicle;

    // player shooting:
    if (playerRig && aiRig) {
        //const turretsAngle: number = Math.atan2(mouseY - playerRig.y, mouseX - playerRig.x);
        //
        // Calculate the angle to the mouse position
        const mouseAngle: number = Math.atan2(mouseY - playerRig.y, mouseX - playerRig.x);
        const forwardAngle: number = playerRig.angle;

        // Define the arc range (±π/8 radians for a 45-degree arc)
        const arcRange: number = Math.PI / 8;

        // Normalize angles to [0, 2π] for comparison
        const normalizeAngle = (angle: number) => (angle + Math.PI * 2) % (Math.PI * 2);
        const normalizedMouseAngle = normalizeAngle(mouseAngle);
        const normalizedForwardAngle = normalizeAngle(forwardAngle);

        // Check if the mouse is within the front arc
        const isInFrontArc =
            Math.abs(normalizedMouseAngle - normalizedForwardAngle) <= arcRange ||
            Math.abs(normalizedMouseAngle - normalizedForwardAngle - Math.PI * 2) <= arcRange;
        //        
        //console.log('in front: ', isInFrontArc);
        /*
        const checkingRadar: CollisionReport = radarCheck(
          gameObject,
          'player',
          0,
          'check for front weapons'
        );
        */
        shoot(playerRig, gameObject, mouseAngle, isInFrontArc/*checkingRadar*/, true);
    }
};
import { AiCollisionReport, CollisionReport, Coordinates, GameObject, Vehicle } from "../interfaces/sharedInterfaces";
import { isRotatedRectColliding } from "./collisionDetect";

export const radarCheck = (
    gameObject: GameObject,
    who: 'player' | 'ai',
    anglefix: number, // if using this too for determing turning
    why: string): CollisionReport => {

    const playerRig: Vehicle | undefined = gameObject.vehicles.find(v => v.role === 'player')?.vehicle;
    const aiRig: Vehicle | undefined = gameObject.vehicles.find(v => v.role === 'ai')?.vehicle;
    const radarRange: number = 500;
    const waveSpeed: number = 20;
    const waveSize: number = 20;

    let radarReport: CollisionReport = {
        collision: false,
        withWhat: ''
    }

    if (why === 'check for front weapons') {
        let radarWave: Coordinates = {
            x: 0,
            y: 0,
            angle: 0
        }

        if (who === 'player' && playerRig) {
            radarWave = {
                x: playerRig.x,
                y: playerRig.y,
                angle: playerRig.angle
            }
        } else if (aiRig) {
            radarWave = {
                x: aiRig.x,
                y: aiRig.y,
                angle: aiRig.angle
            }
        }

        for (let i = 0; i < radarRange; i++) {
            radarWave.x += Math.cos(radarWave.angle) * waveSpeed; // Adjust speed as needed
            radarWave.y += Math.sin(radarWave.angle) * waveSpeed;

            let bulletHitObstacle: boolean = false;
            for (const obstacle of gameObject.arena) {
                if (
                    isRotatedRectColliding(
                        { x: radarWave.x - waveSize / 2, y: radarWave.y - waveSize / 2, width: waveSize, height: waveSize, angle: 0 },
                        { x: obstacle.x + obstacle.width / 2, y: obstacle.y + obstacle.height / 2, width: obstacle.width, height: obstacle.height, angle: obstacle.angle }
                    )
                ) {
                    bulletHitObstacle = true;
                    break; // Exit the obstacle loop since the bullet is already removed
                }
            }

            if (bulletHitObstacle) {
                gameObject.radars.push({
                    x: radarWave.x,
                    y: radarWave.y
                });
                radarReport.collision = true;
                radarReport.withWhat = 'obstacle'
                //console.log('obstacle found by radar');
                continue; // Skip further checks if the bullet hit an obstacle
            }


            // Check collision with obstacles
            if (!radarReport.collision) {
                // Check collision with player
                if (
                    who === 'ai' &&
                    playerRig &&
                    isRotatedRectColliding(
                        { x: radarWave.x - waveSize / 2, y: radarWave.y - waveSize / 2, width: waveSize + 3, height: waveSize + 3, angle: 0 },
                        { x: playerRig.x - playerRig.width / 2, y: playerRig.y - playerRig.height / 2, width: playerRig.width, height: playerRig.height, angle: playerRig.angle }
                    )
                ) {
                    /* activate if want to draw in draw.ts
                    gameObject.radars.push({
                        x: radarWave.x,
                        y: radarWave.y
                    });
                    */
                    radarReport.collision = true;
                    radarReport.withWhat = 'player'
                    //console.log('player found by radar');
                    break;
                }

                // Check collision with AI
                if (
                    who === 'player' &&
                    aiRig &&
                    isRotatedRectColliding(
                        { x: radarWave.x - waveSize / 2, y: radarWave.y - waveSize / 2, width: waveSize, height: waveSize, angle: 0 },
                        { x: aiRig.x - aiRig.width / 2, y: aiRig.y - aiRig.height / 2, width: aiRig.width, height: aiRig.height, angle: aiRig.angle }
                    )
                ) {
                    /* activate if want to draw in draw.ts
                    gameObject.radars.push({
                        x: radarWave.x,
                        y: radarWave.y
                    });
                    */
                    radarReport.collision = true;
                    radarReport.withWhat = 'ai'
                    console.log('ai found by radar');
                    break;
                }
            }
        }
    };
    return radarReport;
};

export const aiRadarCheck = (
  gameObject: GameObject,
  who: 'player' | 'ai',
  angleFix: number,
  why: string
): AiCollisionReport => {
  const radarRange = 500;
  const waveSpeed = 20;
  const waveSize = 20;

  // Initialize radarWave based on `who` (player or AI)
  const radarWave: Coordinates = (() => {
    const playerRig = gameObject.vehicles.find((v) => v.role === 'player')?.vehicle;
    const aiRig = gameObject.vehicles.find((v) => v.role === 'ai')?.vehicle;
    if (who === 'player' && playerRig) {
      return { x: playerRig.x, y: playerRig.y, angle: playerRig.angle };
    } else if (who === 'ai' && aiRig) {
      return { x: aiRig.x, y: aiRig.y, angle: aiRig.angle };
    } else {
      throw new Error(`No vehicle found for role: ${who}`);
    }
  })();

  let nearestCollision: AiCollisionReport = {
    collision: false,
    withWhat: '',
    distance: radarRange,
  };

  // Radar sweep loop
  for (let i = 0; i < radarRange; i += waveSpeed) {
    radarWave.x += Math.cos(radarWave.angle + angleFix) * waveSpeed;
    radarWave.y += Math.sin(radarWave.angle + angleFix) * waveSpeed;

    // Check collision with obstacles
    for (const obstacle of gameObject.arena) {
      const radarRect = {
        x: radarWave.x - waveSize / 2,
        y: radarWave.y - waveSize / 2,
        width: waveSize,
        height: waveSize,
        angle: 0,
      };
      const obstacleRect = {
        x: obstacle.x + obstacle.width / 2,
        y: obstacle.y + obstacle.height / 2,
        width: obstacle.width,
        height: obstacle.height,
        angle: obstacle.angle,
      };

      if (isRotatedRectColliding(radarRect, obstacleRect)) {
        const distanceToCollision = Math.sqrt(
          Math.pow(radarWave.x - (obstacle.x + obstacle.width / 2), 2) +
          Math.pow(radarWave.y - (obstacle.y + obstacle.height / 2), 2)
        );

        nearestCollision = {
          collision: true,
          withWhat: 'obstacle',
          distance: distanceToCollision,
        };
        break;
      }
    }

    if (nearestCollision.collision) break;
  }

  return nearestCollision;
};


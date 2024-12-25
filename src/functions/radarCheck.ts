import { CollisionReport, Coordinates, GameObject, Vehicle } from "../interfaces/sharedInterfaces";
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
                    console.log('player found by radar');
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

/*
      // Update gameObject.bullets
      for (let i = gameObject.bullets.length - 1; i >= 0; i--) {
        const bullet = gameObject.bullets[i];

        // Move bullet
        radarWave.x += Math.cos(radarWave.angle) * waveSpeed; // Adjust speed as needed
        radarWave.y += Math.sin(radarWave.angle) * bullet.speed;

        // Check collision with player
        if (
          bullet.owner === 'ai' &&
          isRotatedRectColliding(
            { x: bullet.x - waveSize/2, y: bullet.y - 2.5, width: bullet.size + 3, height: bullet.size + 3, angle: 0 },
            { x: playerRig.x - playerRig.width / 2, y: playerRig.y - playerRig.height / 2, width: playerRig.width, height: playerRig.height, angle: playerRig.angle }
          )
        ) {
          playerRig.hitPoints -= bullet.damage;
          gameObject.bullets.splice(i, 1); // Remove the bullet
          gameObject.hits.push({x: bullet.x,
                                y: bullet.y,
                                damage: bullet.damage});
          continue;
        }

        // Check collision with AI
        if (
          bullet.owner === 'player' &&
          isRotatedRectColliding(
            { x: bullet.x - 2.5, y: bullet.y - 2.5, width: bullet.size, height: bullet.size, angle: 0 },
            { x: aiRig.x - aiRig.width / 2, y: aiRig.y - aiRig.height / 2, width: aiRig.width, height: aiRig.height, angle: aiRig.angle }
          )
        ) {
          aiRig.hitPoints -= bullet.damage;
          gameObject.bullets.splice(i, 1); // Remove the bullet
          gameObject.hits.push({x: bullet.x,
                                y: bullet.y,
                                damage: bullet.damage});
          continue;
        }

        // Check collision with obstacles
        let bulletHitObstacle: boolean = false;
        for (const obstacle of obstacles) {
          if (
            isRotatedRectColliding(
              { x: bullet.x - 2.5, y: bullet.y - 2.5, width: 5, height: 5, angle: 0 },
              { x: obstacle.x + obstacle.width / 2, y: obstacle.y + obstacle.height / 2, width: obstacle.width, height: obstacle.height, angle: obstacle.angle }
            )
          ) {
            gameObject.bullets.splice(i, 1); // Remove the bullet
            bulletHitObstacle = true;
            break; // Exit the obstacle loop since the bullet is already removed
          }
        }

        if (bulletHitObstacle) {
          continue; // Skip further checks if the bullet hit an obstacle
        }

        // Remove gameObject.bullets that go off-screen
        if (
          bullet.x < 0 || bullet.x > canvas.width ||
          bullet.y < 0 || bullet.y > canvas.height
        ) {
          gameObject.bullets.splice(i, 1);
        }
      }
*/
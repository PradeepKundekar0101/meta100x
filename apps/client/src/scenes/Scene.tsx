import { Scene } from "phaser";

// import {EventTypes} from "@repo/types"

export default class TestScene extends Scene {
  private player!:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private userId:string | undefined
  private worldLayer: Phaser.Tilemaps.TilemapLayer | undefined | null

    private players:Record<string,Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>
    private socket: WebSocket | null
    constructor() {
    super("garden");
    this.players = {}
    this.socket = null
  }
  preload() {}
  create() {

    this.socket = new WebSocket("ws://localhost:8000")
    this.socket.addEventListener("open", () => {
        console.log("WebSocket connection established");
        this.socket?.send(
          JSON.stringify({
            type: "JOIN_SPACE",
            payload: {
              roomId: "room",
            },
          })
        );
      });

        this.socket.addEventListener("message",(message)=>{
            console.log(JSON.parse(message.data))
            const {type,payload} = JSON.parse(message.data)
            switch(type){
                case "USER_JOINED":
                    const {id,x,y} = payload
                    this.addPlayer(id,x,y)
                    break;
                case "SPACE_JOINED":
                    this.userId = payload.userId
                    if(Array.isArray(payload.users)){
                        payload.users.forEach((e:any)=>{
                            const {id,x,y} = e;
                            this.addPlayer(id,x,y)
                            
                        })
                    }
                    break;
                case "MOVEMENT":
                    const {userId,x:velocityX,y:velocityY,xPos:targetX,yPos:targetY} = payload
                    console.log("PLAYER MOVED:",userId)
                    const player = this.players[userId]
                    if (player) {
                        console.log("USerId",userId,"X:",velocityX,"Y:",velocityY)


                        this.movePlayer(player, velocityX, velocityY, targetX, targetY);

                      }
                    break
            }
        })

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(
      "tuxmon-sample-32px-extruded",
      "tuxmon-sample-32px-extruded"
    );
    map.createLayer("Below Player", tileset!, 0, 0);
    this.worldLayer = map.createLayer("World", tileset!, 0, 0);
    this.worldLayer!.setCollisionByProperty({ collides: true });
    map.createLayer("Above Player", tileset!, 0, 0);
    // const spawnPoint = map.findObject(
    //   "Objects",
    //   (obj) => obj.name === "Spawn Point"
    // );


    this.player = this.physics.add
    //   .sprite(spawnPoint?.x!, spawnPoint?.y!, "atlas", "misa-front")
      .sprite(390, 1260, "atlas", "misa-front")
      .setSize(30, 40)
      .setOffset(0, 24);


    this.physics.add.collider(this.player, this.worldLayer!);
    
    const anims = this.anims;
    anims.create({
      key: "misa-left-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-left-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-right-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-right-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-front-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-front-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "misa-back-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-back-walk.",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);
  }
 movePlayer(
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    velocityX: number,
    velocityY: number,
    targetX: number,
    targetY: number
) {
    // Smoothly interpolate the player's position to the target position
    const smoothingFactor = 0.1; // Adjust for smoother movement
    player.x = Phaser.Math.Linear(player.x, targetX, smoothingFactor);
    player.y = Phaser.Math.Linear(player.y, targetY, smoothingFactor);

    // Update player's velocity for animation purposes
    player.body.setVelocity(velocityX, velocityY);

    // Determine animation based on velocity
    let animationKey = "";
    if (velocityX < 0) {
        animationKey = "misa-left-walk";
    } else if (velocityX > 0) {
        animationKey = "misa-right-walk";
    } else if (velocityY < 0) {
        animationKey = "misa-back-walk";
    } else if (velocityY > 0) {
        animationKey = "misa-front-walk";
    }

    if (animationKey) {
        player.anims.play(animationKey, true);
    } else {
        // Stop animation when not moving
        player.anims.stop();
        player.body.setVelocity(0, 0);
    }
}


  update() {
    const cursors = this.input.keyboard?.createCursorKeys();
    let moving = false;

    let velocityX = 0;
    let velocityY = 0;
    let animationKey = "";

    if (cursors!.left.isDown) {
        velocityX = -100;
        animationKey = "misa-left-walk";
        moving = true;
    } else if (cursors!.right.isDown) {
        velocityX = 100;
        animationKey = "misa-right-walk";
        moving = true;
    } 

    if (cursors!.up.isDown) {
        velocityY = -100;
        animationKey = "misa-back-walk";
        moving = true;
    } else if (cursors!.down.isDown) {
        velocityY = 100;
        animationKey = "misa-front-walk";
        moving = true;
    }

    this.player.body.setVelocity(velocityX, velocityY);

    if (moving) {
        this.player.anims.play(animationKey, true);
    } else {
        this.player.body.setVelocity(0);
        this.player.anims.stop();
    }

    if (moving && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(
            JSON.stringify({
                type: "MOVE",
                payload: {
                    userId: this.userId,
                    velocityX,
                    velocityY,
                    xPos : this.player.body.x,
                    yPos : this.player.body.y,
                },
            })
        );
    }
}

  addPlayer(playerId:string,x:number,y:number){
    console.log("Adding new Player at",x,y)
    const newPlayer = this.physics.add.sprite(x,y,"atlas")
    this.players[playerId] = newPlayer
    this.physics.add.collider(this.worldLayer!,newPlayer)
    console.log("Added new player:",playerId)
  }
}


import { Scene } from "phaser";

const avatarId = localStorage.getItem("avatarId") || "pajji"
const roomId = localStorage.getItem("roomId") || "default"
const token = localStorage.getItem("token") || "token"

export default class TestScene extends Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private userId: string | undefined;
  private worldLayer: Phaser.Tilemaps.TilemapLayer | undefined | null;
  private players: Record<string, Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>;
  private labels: Record<string, Phaser.GameObjects.Text>; 
  private socket: WebSocket | null;
  
  constructor() {
    super("garden");
    this.players = {};

    this.labels = {};
    this.socket = null;
  }

  preload() {}
  
  create() {
    this.socket = new WebSocket("ws://localhost:8000");
    this.socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      this.socket?.send(
        JSON.stringify({
          type: "JOIN_SPACE",
          payload: {
            roomId,
            token
          },
        })
      );
    });

    this.socket.addEventListener("message", (message) => {
      const { type, payload } = JSON.parse(message.data);
      switch (type) {
        case "USER_JOINED":
          const { id, x, y,userName,avatarId } = payload;
          this.addPlayer(id, x, y,userName,avatarId);
          break;

        case "SPACE_JOINED":
          console.log("first")
          this.userId = payload.userId;
          if (Array.isArray(payload.users)) {
            payload.users.forEach((e: any) => {
              const { id, x, y,userName,avatarId} = e;
              this.addPlayer(id, x, y,userName,avatarId);
            });
          }
          const label = this.add.text(390, 1260, `YOU`, {
            fontSize: "12px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 4, y: 2 },
          }).setOrigin(1.5);
          console.log("Payload userId")
          console.log(payload.userId)
          this.labels[payload.userId]= label

          break;
        case "MOVEMENT":
          const { userId, x: velocityX, y: velocityY, xPos: targetX, yPos: targetY } = payload;
          const player = this.players[userId];
          if (player) {
            const dis = Phaser.Math.Distance.Between(
              player.body.x + 16,
              player.body.y + 32,
              targetX,
              targetY
            );
            const duration = (dis / 100) * 1000;
            let animationKey = "";
            const texturekey = player.texture.key;
            console.log("Movement ",texturekey)
            if (velocityX < 0) animationKey = `${texturekey}-left`;
            else if (velocityX > 0) animationKey = `${texturekey}-right`;
            else if (velocityY < 0) animationKey = `${texturekey}-back`;
            else if (velocityY > 0) animationKey = `${texturekey}-front`;

            if (!player.anims.isPlaying) {
              player.anims.play(animationKey);
            }

            this.tweens.add({
              targets: player,
              x: targetX + 16,
              y: targetY + 32,
              duration,
              ease: "Linear",
              onComplete: () => {
                player.anims.stop();
              },
            });
          }
          break;
          case "USER_LEFT":
            const { id:userIdToDestroy, userName:userNameLeft } = payload;
          
            const playerToRemove = this.players[userIdToDestroy];
            if (playerToRemove) {
              playerToRemove.destroy(); 
              delete this.players[userIdToDestroy];
            }

            const labelToRemove = this.labels[userIdToDestroy];
            if (labelToRemove) {
              labelToRemove.destroy(); 
              delete this.labels[userIdToDestroy]; 
            }
          
            console.log(`${userNameLeft} has left the space`);
            break;
          
      }
    });

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(
      "tuxmon-sample-32px-extruded",
      "tuxmon-sample-32px-extruded"
    );
    map.createLayer("Below Player", tileset!, 0, 0);
    this.worldLayer = map.createLayer("World", tileset!, 0, 0);
    this.worldLayer!.setCollisionByProperty({ collides: true });
    map.createLayer("Above Player", tileset!, 0, 0);

    this.player = this.physics.add
      .sprite(390, 1260, avatarId, avatarId+"000");
     

    this.physics.add.collider(this.player, this.worldLayer!);

    const anims = this.anims;
    anims.create({
      key: "snowman-left",
      frames: anims.generateFrameNames("snowman", {
        prefix: "left",
        // start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "snowman-right",
      frames: anims.generateFrameNames("snowman", {
        prefix: "right",
        // start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "snowman-front",
      frames: anims.generateFrameNames("snowman", {
        prefix: "front",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "snowman-back",
      frames: anims.generateFrameNames("snowman", {
        prefix: "back",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "pajji-left",
      frames: anims.generateFrameNames("pajji", {
        prefix: "left",
        // start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "pajji-right",
      frames: anims.generateFrameNames("pajji", {
        prefix: "right",
        // start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "pajji-front",
      frames: anims.generateFrameNames("pajji", {
        prefix: "front",
        // start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "pajji-back",
      frames: anims.generateFrameNames("pajji", {
        prefix: "back",
        // start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);
  }

  update() {
    const cursors = this.input.keyboard?.createCursorKeys();
    let moving = false;

    let velocityX = 0;
    let velocityY = 0;
    let animationKey = "";
    if (cursors!.left.isDown) {
      const texturekey = this.player.texture.key
      console.log("Movement ",texturekey)
      velocityX = -100;
      animationKey = `${texturekey}-left`;
      moving = true;
    } else if (cursors!.right.isDown) {
      const texturekey = this.player.texture.key
      console.log("Movement ",texturekey)
      velocityX = 100;
      animationKey = `${texturekey}-right`;
      moving = true;
    }
    
    if (cursors!.up.isDown) {
      const texturekey = this.player.texture.key
      console.log("Movement ",texturekey)
      velocityY = -100;
      animationKey = `${texturekey}-back`;
      moving = true;
    } else if (cursors!.down.isDown) {
      const texturekey = this.player.texture.key
      console.log("Movement ",texturekey)
      velocityY = 100;
      animationKey = `${texturekey}-front`;
      moving = true;
    }

    this.player.body.setVelocity(velocityX, velocityY);

    if (moving) {
      this.player.anims.play(animationKey, true);
      this.labels[this.userId!]?.setPosition(this.player.x,this.player.y)

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
            xPos: this.player.body.x,
            yPos: this.player.body.y,
          },
        })
      );
    }

    // Update label positions
    for (const id in this.players) {
      const player = this.players[id];
      const label = this.labels[id];
      // console.log(label)
      if (player && label) {
        label.setPosition(player.x, player.y - 20);
      }
    }
  }

  addPlayer(playerId: string, x: number, y: number,userName:string,avatarId:string) {
    const newPlayer = this.physics.add.sprite(x, y, avatarId);
    this.players[playerId] = newPlayer;
    // this.physics.add.collider(this.player,newPlayer)
    // Array.from(Object(this.players)).forEach((player:any)=>{
    //   this.physics.add.collider(player,newPlayer)
    // })
    this.physics.add.collider(this.worldLayer!, newPlayer);

    // Add label for the player
    const label = this.add.text(x, y - 20, `${userName}`, {
      fontSize: "12px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);
    this.labels[playerId] = label;
  }
}

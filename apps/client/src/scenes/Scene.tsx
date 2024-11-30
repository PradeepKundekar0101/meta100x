import { Scene } from "phaser";

export default class TestScene extends Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private userId: string | undefined;
  private worldLayer: Phaser.Tilemaps.TilemapLayer | undefined | null;

  private players: Record<string, Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>;
  private labels: Record<string, Phaser.GameObjects.Text>; // For player labels
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
            roomId: "room",
          },
        })
      );
    });

    this.socket.addEventListener("message", (message) => {
      const { type, payload } = JSON.parse(message.data);
      switch (type) {
        case "USER_JOINED":
          const { id, x, y } = payload;
          this.addPlayer(id, x, y);
          break;
        case "SPACE_JOINED":
          this.userId = payload.userId;
          if (Array.isArray(payload.users)) {
            payload.users.forEach((e: any) => {
              const { id, x, y } = e;
              this.addPlayer(id, x, y);
            });
          }
          const label = this.add.text(390, 1260, `YOU`, {
            fontSize: "12px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 4, y: 2 },
          }).setOrigin(0.5);
          this.labels[payload.userId]= label
          console.log(this.labels)
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
            if (velocityX < 0) animationKey = "misa-left-walk";
            else if (velocityX > 0) animationKey = "misa-right-walk";
            else if (velocityY < 0) animationKey = "misa-back-walk";
            else if (velocityY > 0) animationKey = "misa-front-walk";

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
      .sprite(390, 1260, "atlas", "misa-front");

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
      this.labels[this.userId!].setPosition(this.player.x,this.player.y)

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
      console.log(label)
      if (player && label) {
        label.setPosition(player.x, player.y - 20);
      }
    }
  }

  addPlayer(playerId: string, x: number, y: number) {
    const newPlayer = this.physics.add.sprite(x, y, "atlas");
    this.players[playerId] = newPlayer;
    // this.physics.add.collider(this.player,newPlayer)
    // Array.from(Object(this.players)).forEach((player:any)=>{
    //   this.physics.add.collider(player,newPlayer)
    // })
    this.physics.add.collider(this.worldLayer!, newPlayer);

    // Add label for the player
    const label = this.add.text(x, y - 20, `Player ${playerId}`, {
      fontSize: "12px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);
    this.labels[playerId] = label;
  }
}

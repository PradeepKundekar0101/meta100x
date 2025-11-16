import { Scene } from "phaser";
import { createAnimations } from "./utils";
import { WebSocketSingleton } from "@/utils/websocket";
import { toast } from "sonner";
import { LiveKitClient } from "@/lib/livekit";

const avatarId = localStorage.getItem("avatarId") || "pajji";
const roomId = localStorage.getItem("roomId") || "default";

const token = localStorage.getItem("token") || "token";

export default class TestScene extends Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private userId: string | undefined;
  private worldLayer: Phaser.Tilemaps.TilemapLayer | undefined | null;
  private players: Record<
    string,
    Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  >;
  private labels: Record<string, Phaser.GameObjects.Text>;
  private socket: WebSocket | null;
  private playerTweens: Record<string, Phaser.Tweens.Tween>;
  private playerLastAnimations: Record<string, string>;
  private currentPlayerLastAnimation: string;
  // Unsubscribe functions to clean up listeners
  private spaceJoinedUnsubscribe?: () => void;
  private movementUnsubscribe?: () => void;
  private userJoinedUnsubscribe?: () => void;
  private userLeftUnsubscribe?: () => void;

  constructor() {
    super("garden");
    this.players = {};
    this.labels = {};
    this.socket = null;
    this.playerTweens = {};
    this.playerLastAnimations = {};
    this.currentPlayerLastAnimation = "";
  }

  preload() {}

  private setupWebSocket() {
    this.socket = WebSocketSingleton.getInstance();
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "JOIN_SPACE",
          payload: {
            roomId,
            token,
          },
        }),
      );
    } else {
      this.socket.addEventListener("open", () => {
        this.socket?.send(
          JSON.stringify({
            type: "JOIN_SPACE",
            payload: {
              roomId,
              token,
            },
          }),
        );
      });
    }

    // Subscribe to different message types
    this.spaceJoinedUnsubscribe = WebSocketSingleton.subscribe(
      "SPACE_JOINED",
      (msg) => {
        LiveKitClient.setToken(msg.payload.liveKitAccessToken!);
        this.userId = msg.payload.userId;

        if (Array.isArray(msg.payload.users)) {
          msg.payload.users.forEach((e: any) => {
            const { id, x, y, userName, avatarId } = e;
            WebSocketSingleton.setPlayers({ userName, avatarId, userId: id });
            this.addPlayer(id, x, y, userName, avatarId);
          });
        }

        // Add label for current user
        const label = this.add
          .text(450, 1000, `YOU`, {
            fontSize: "12px",
            color: "#000",
            backgroundColor: "#fff",
            padding: { x: 4, y: 2 },
          })
          .setOrigin(1.5);

        this.labels[msg.payload.userId] = label;
        toast("Space joined successfully");
      },
    );

    this.userJoinedUnsubscribe = WebSocketSingleton.subscribe(
      "USER_JOINED",
      (msg) => {
        const { id, x, y, userName, avatarId } = msg.payload;
        WebSocketSingleton.setPlayers({ userName, avatarId, userId: id });
        this.addPlayer(id, x, y, userName, avatarId);
      },
    );

    this.movementUnsubscribe = WebSocketSingleton.subscribe(
      "MOVEMENT",
      (msg) => {
        console.log("MV");
        const {
          userId,
          x: velocityX,
          y: velocityY,
          xPos: targetX,
          yPos: targetY,
        } = msg.payload;
        const player = this.players[userId];

        if (player) {
          let animationKey = "";
          const texturekey = player.texture.key;

          if (velocityX < 0) animationKey = `${texturekey}-left`;
          else if (velocityX > 0) animationKey = `${texturekey}-right`;
          else if (velocityY < 0) animationKey = `${texturekey}-back`;
          else if (velocityY > 0) animationKey = `${texturekey}-front`;

          // always play/update the animation (true allosws it to restart if already playing)
          if (animationKey) {
            player.anims.play(animationKey, true);
            // Store the last animation for this player
            this.playerLastAnimations[userId] = animationKey;
          }

          // check if there's already an active tween for this player
          const existingTween = this.playerTweens[userId];

          if (existingTween && existingTween.isPlaying()) {
            // update the existing tween's target instead of creating a new one
            existingTween.updateTo("x", targetX + 16, true);
            existingTween.updateTo("y", targetY + 32, true);
          } else {
            // create a new tween only if none exists or the previous one completed
            const dis = Phaser.Math.Distance.Between(
              player.body.x + 16,
              player.body.y + 32,
              targetX,
              targetY,
            );
            const duration = (dis / 100) * 1000;

            const newTween = this.tweens.add({
              targets: player,
              x: targetX + 16,
              y: targetY + 32,
              duration,
              ease: "Linear",
              onComplete: () => {
                // stop the animation and show the first frame (idle pose) of the last direction
                const lastAnimation = this.playerLastAnimations[userId];
                player.anims.stop();

                if (lastAnimation) {
                  // extract direction from animation key (e.g., "pajji-left" -> "left")
                  const direction = lastAnimation.split("-")[1];
                  // set to the idle frame (first frame) of that direction
                  const idleFrame = `${direction}000`;
                  player.setFrame(idleFrame);
                }

                player.body.setVelocity(0);
                delete this.playerTweens[userId];
              },
            });

            this.playerTweens[userId] = newTween;
          }
        }
      },
    );

    this.userLeftUnsubscribe = WebSocketSingleton.subscribe(
      "USER_LEFT",
      (msg) => {
        const { id: userIdToDestroy, userName: userNameLeft } = msg.payload;

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

        // clean up the tween if it exists
        const tweenToRemove = this.playerTweens[userIdToDestroy];
        if (tweenToRemove) {
          tweenToRemove.remove();
          delete this.playerTweens[userIdToDestroy];
        }

        // clean up the last animation record
        delete this.playerLastAnimations[userIdToDestroy];

        toast(userNameLeft + " Left");

        WebSocketSingleton.removePlayer(userIdToDestroy);
        console.log(`${userNameLeft} has left the space`);
      },
    );
  }

  create() {
    this.setupWebSocket();

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(
      "tuxmon-sample-32px-extruded",
      "tuxmon-sample-32px-extruded",
    );
    map.createLayer("Below Player", tileset!, 0, 0);
    this.worldLayer = map.createLayer("World", tileset!, 0, 0);
    this.worldLayer!.setCollisionByProperty({ collides: true });
    map.createLayer("Above Player", tileset!, 0, 0);

    this.player = this.physics.add.sprite(
      450,
      1000,
      avatarId,
      avatarId + "000",
    );

    this.physics.add.collider(this.player, this.worldLayer!);

    const anims = this.anims;
    createAnimations(anims);
    this.cameras.main.startFollow(this.player, true);

    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
  }

  update() {
    const cursors = this.input.keyboard?.createCursorKeys();
    let moving = false;

    let velocityX = 0;
    let velocityY = 0;
    let animationKey = "";
    if (cursors!.left.isDown) {
      const texturekey = this.player.texture.key;
      velocityX = -100;
      animationKey = `${texturekey}-left`;
      this.currentPlayerLastAnimation = animationKey;
      moving = true;
    } else if (cursors!.right.isDown) {
      const texturekey = this.player.texture.key;
      velocityX = 100;
      animationKey = `${texturekey}-right`;
      this.currentPlayerLastAnimation = animationKey;
      moving = true;
    }

    if (cursors!.up.isDown) {
      const texturekey = this.player.texture.key;
      velocityY = -100;
      animationKey = `${texturekey}-back`;
      this.currentPlayerLastAnimation = animationKey;
      moving = true;
    } else if (cursors!.down.isDown) {
      const texturekey = this.player.texture.key;
      velocityY = 100;
      animationKey = `${texturekey}-front`;
      this.currentPlayerLastAnimation = animationKey;
      moving = true;
    }

    this.player.body.setVelocity(velocityX, velocityY);

    if (moving) {
      this.player.anims.play(animationKey, true);
      this.labels[this.userId!]?.setPosition(this.player.x, this.player.y);
    } else {
      this.player.body.setVelocity(0);
      this.player.anims.stop();
      if (this.currentPlayerLastAnimation) {
        const direction = this.currentPlayerLastAnimation.split("-")[1];
        const idleFrame = `${direction}000`;
        this.player.setFrame(idleFrame);
      }
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
        }),
      );
    }

    for (const id in this.players) {
      const player = this.players[id];
      const label = this.labels[id];
      if (player && label) {
        label.setPosition(player.x, player.y - 20);
      }
    }
  }

  // Cleanup method to unsubscribe from WebSocket events
  shutdown() {
    if (this.spaceJoinedUnsubscribe) {
      this.spaceJoinedUnsubscribe();
    }
    if (this.movementUnsubscribe) {
      this.movementUnsubscribe();
    }
    if (this.userJoinedUnsubscribe) {
      this.userJoinedUnsubscribe();
    }
    if (this.userLeftUnsubscribe) {
      this.userLeftUnsubscribe();
    }
  }

  addPlayer(
    playerId: string,
    x: number,
    y: number,
    userName: string,
    avatarId: string,
  ) {
    const newPlayer = this.physics.add.sprite(x, y, avatarId);
    this.players[playerId] = newPlayer;
    this.physics.add.collider(this.worldLayer!, newPlayer);
    const label = this.add
      .text(x, y - 20, `${userName}`, {
        fontSize: "12px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5);
    this.labels[playerId] = label;
  }
}

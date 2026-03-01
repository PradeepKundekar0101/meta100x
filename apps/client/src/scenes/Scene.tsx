import { Scene } from "phaser";
import { createAnimations } from "./utils";
import { WebSocketMessage, WebSocketSingleton } from "@/utils/websocket";
import { toast } from "sonner";
import { LiveKitClient } from "@/lib/livekit";
import { SpaceJoinedPayload, UserJoinedPayload, User, MovementPayload, UserLeftPayload } from "@/types";


interface PathNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}

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
  private proximityCircle: Phaser.GameObjects.Graphics | undefined;

  private spaceJoinedUnsubscribe?: () => void;
  private movementUnsubscribe?: () => void;
  private userJoinedUnsubscribe?: () => void;
  private userLeftUnsubscribe?: () => void;

  private lastProximityCheck: number = 0;
  private PROXIMITY_RADIUS = 100;

  private isDragging = false;
  private dragStartPoint: Phaser.Math.Vector2 | null = null;
  private dragStartCam: Phaser.Math.Vector2 | null = null;

  private movePath: Phaser.Math.Vector2[] = [];
  private moveHereText!: Phaser.GameObjects.Text;
  private moveMarker!: Phaser.GameObjects.Graphics;
  private lastClickTime: number = 0;
  private lastClickWorldPos: Phaser.Math.Vector2 | null = null;
  private hoverTimer: ReturnType<typeof setTimeout> | null = null;
  private mapPixelWidth = 0;
  private mapPixelHeight = 0;

  private avatarId = "pajji";
  private roomId = "default";
  private token = "";
  private guestName = "";

  constructor() {
    super("garden");
    this.players = {};
    this.labels = {};
    this.socket = null;
    this.playerTweens = {};
    this.playerLastAnimations = {};
    this.currentPlayerLastAnimation = "";
  }

  preload() { }

  private buildJoinPayload() {
    const base: Record<string, string> = { roomId: this.roomId };
    if (this.token) {
      base.token = this.token;
    } else {
      base.guestName = this.guestName || "Guest";
      base.avatarId = this.avatarId;
    }
    return base;
  }

  private setupWebSocket() {
    this.socket = WebSocketSingleton.getInstance();
    const joinMsg = JSON.stringify({
      type: "JOIN_SPACE",
      payload: this.buildJoinPayload(),
    });
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(joinMsg);
    } else {
      this.socket.addEventListener("open", () => {
        this.socket?.send(joinMsg);
      });
    }

    this.spaceJoinedUnsubscribe = WebSocketSingleton.subscribe(
      "SPACE_JOINED",
      (msg: WebSocketMessage) => {
        const payload = msg.payload as SpaceJoinedPayload;
        LiveKitClient.setToken(payload.liveKitAccessToken!);
        this.userId = payload.userId;

        if (Array.isArray(payload.users)) {
          payload.users.forEach((e: User) => {
            const { id, x, y, userName, avatarId } = e;
            WebSocketSingleton.setPlayers({ userName, avatarId, userId: id });
            this.addPlayer(id, x, y, userName, avatarId);
          });
        }

        const label = this.add
          .text(450, 1000, `YOU`, {
            fontSize: "10px",
            color: "#000",
            backgroundColor: "#fff",
            padding: { x: 4, y: 2 },
          })
          .setOrigin(1.5);

        this.labels[payload.userId] = label;
        toast("Space joined successfully");
      }
    );

    this.userJoinedUnsubscribe = WebSocketSingleton.subscribe(
      "USER_JOINED",
      (msg: WebSocketMessage) => {
        const payload = msg.payload as UserJoinedPayload;
        const { id, x, y, userName, avatarId } = payload;
        WebSocketSingleton.setPlayers({ userName, avatarId, userId: id });
        this.addPlayer(id, x, y, userName, avatarId);
      }
    );

    this.movementUnsubscribe = WebSocketSingleton.subscribe(
      "MOVEMENT",
      (msg: WebSocketMessage) => {
        console.log("MV");
        const payload = msg.payload as MovementPayload;
        const {
          userId,
          x: velocityX,
          y: velocityY,
          xPos: targetX,
          yPos: targetY,
        } = payload;
        const player = this.players[userId];

        if (player) {
          let animationKey = "";
          const texturekey = player.texture.key;

          if (velocityX < 0) animationKey = `${texturekey}-left`;
          else if (velocityX > 0) animationKey = `${texturekey}-right`;
          else if (velocityY < 0) animationKey = `${texturekey}-back`;
          else if (velocityY > 0) animationKey = `${texturekey}-front`;

          if (animationKey) {
            player.anims.play(animationKey, true);
            this.playerLastAnimations[userId] = animationKey;
          }

          const existingTween = this.playerTweens[userId];

          if (existingTween && existingTween.isPlaying()) {
            existingTween.updateTo("x", targetX + 16, true);
            existingTween.updateTo("y", targetY + 32, true);
          } else {
            const dis = Phaser.Math.Distance.Between(
              player.body.x + 16,
              player.body.y + 32,
              targetX,
              targetY
            );
            const duration = (dis / 100) * 1000;

            const newTween = this.tweens.add({
              targets: player,
              x: targetX + 16,
              y: targetY + 32,
              duration,
              ease: "Linear",
              onComplete: () => {
                const lastAnimation = this.playerLastAnimations[userId];
                player.anims.stop();

                if (lastAnimation) {
                  const direction = lastAnimation.split("-")[1];
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
      }
    );

    this.userLeftUnsubscribe = WebSocketSingleton.subscribe(
      "USER_LEFT",
      (msg: WebSocketMessage) => {
        const payload = msg.payload as UserLeftPayload;
        const { id: userIdToDestroy, userName: userNameLeft } = payload;

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

        const tweenToRemove = this.playerTweens[userIdToDestroy];
        if (tweenToRemove) {
          tweenToRemove.remove();
          delete this.playerTweens[userIdToDestroy];
        }

        delete this.playerLastAnimations[userIdToDestroy];

        toast(userNameLeft + " Left");

        WebSocketSingleton.removePlayer(userIdToDestroy);
        console.log(`${userNameLeft} has left the space`);
      }
    );
  }

  create() {
    this.avatarId = localStorage.getItem("avatarId") || "pajji";
    this.roomId = localStorage.getItem("roomId") || "default";
    this.token = localStorage.getItem("token") || "";
    this.guestName = localStorage.getItem("guestName") || "";

    this.setupWebSocket();

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(
      "tuxmon-sample-32px-extruded",
      "tuxmon-sample-32px-extruded"
    );
    map.createLayer("Below Player", tileset!, 0, 0);
    this.worldLayer = map.createLayer("World", tileset!, 0, 0);
    this.worldLayer!.setCollisionByProperty({ collides: true });
    map.createLayer("Above Player", tileset!, 0, 0);

    this.player = this.physics.add.sprite(
      450,
      1000,
      this.avatarId,
      this.avatarId + "000"
    );

    this.proximityCircle = this.add.graphics();
    this.proximityCircle.lineStyle(2, 0xffffff, 0.5);
    this.proximityCircle.strokeCircle(0, 0, this.PROXIMITY_RADIUS);

    this.physics.add.collider(this.player, this.worldLayer!);

    const anims = this.anims;
    createAnimations(anims);
    this.cameras.main.startFollow(this.player, true);

    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.mapPixelWidth = mapWidth;
    this.mapPixelHeight = mapHeight;
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    const cam = this.cameras.main;
    const minZoomX = cam.width / mapWidth;
    const minZoomY = cam.height / mapHeight;
    const fitZoom = Math.max(minZoomX, minZoomY, 1);
    cam.setZoom(fitZoom);
    window.dispatchEvent(
      new CustomEvent("ph-zoom-sync", { detail: { zoom: fitZoom } })
    );

    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      const newMinX = gameSize.width / this.mapPixelWidth;
      const newMinY = gameSize.height / this.mapPixelHeight;
      const newFit = Math.max(newMinX, newMinY, 1);
      const currentZoom = this.cameras.main.zoom;
      if (currentZoom < newFit) {
        this.cameras.main.setZoom(newFit);
      }
      window.dispatchEvent(
        new CustomEvent("ph-zoom-sync", { detail: { zoom: Math.max(currentZoom, newFit) } })
      );
    });

    // "Move here" hover indicator for walkable ground
    this.moveHereText = this.add
      .text(0, 0, "Move here", {
        fontSize: "10px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 6, y: 3 },
        fontStyle: "bold",
      })
      .setOrigin(0.5, 1.5)
      .setVisible(false)
      .setDepth(1000);

    // Target marker shown on double-click destination
    this.moveMarker = this.add.graphics();
    this.moveMarker.setVisible(false);
    this.moveMarker.setDepth(999);

    const zoomHandler = (e: Event) => {
      const zoom = (e as CustomEvent).detail.zoom;
      this.cameras.main.setZoom(zoom);
    };

    window.addEventListener("ph-zoom", zoomHandler);

    this.events.on("shutdown", () => {
      window.removeEventListener("ph-zoom", zoomHandler);
    });

    this.events.on("destroy", () => {
      window.removeEventListener("ph-zoom", zoomHandler);
    });

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.isDragging = true;
        this.cameras.main.stopFollow();
        this.dragStartPoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
        this.dragStartCam = new Phaser.Math.Vector2(
          this.cameras.main.scrollX,
          this.cameras.main.scrollY
        );
        this.input.setDefaultCursor("grabbing");
        // Cancel any pending hover label
        this.moveHereText.setVisible(false);
        if (this.hoverTimer) {
          clearTimeout(this.hoverTimer);
          this.hoverTimer = null;
        }
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging && this.dragStartCam && this.dragStartPoint) {
        const zoom = this.cameras.main.zoom;
        const diffX = (pointer.x - this.dragStartPoint.x) / zoom;
        const diffY = (pointer.y - this.dragStartPoint.y) / zoom;

        this.cameras.main.scrollX = this.dragStartCam.x - diffX;
        this.cameras.main.scrollY = this.dragStartCam.y - diffY;
        this.moveHereText.setVisible(false);
        if (this.hoverTimer) {
          clearTimeout(this.hoverTimer);
          this.hoverTimer = null;
        }
      } else {
        const worldPoint = this.cameras.main.getWorldPoint(
          pointer.x,
          pointer.y
        );
        if (this.isWalkable(worldPoint.x, worldPoint.y)) {
          // Hide immediately on move; start a fresh 1.5s timer
          this.moveHereText.setVisible(false);
          if (this.hoverTimer) clearTimeout(this.hoverTimer);
          this.hoverTimer = setTimeout(() => {
            this.moveHereText
              .setPosition(worldPoint.x, worldPoint.y - 10)
              .setVisible(true);
            this.hoverTimer = null;
          }, 1000);
          this.input.setDefaultCursor("pointer");
        } else {
          this.moveHereText.setVisible(false);
          if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
          }
          this.input.setDefaultCursor("default");
        }
      }
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      const dragDistance = this.dragStartPoint
        ? Phaser.Math.Distance.Between(
          pointer.x,
          pointer.y,
          this.dragStartPoint.x,
          this.dragStartPoint.y
        )
        : 0;
      const wasDrag = this.isDragging && dragDistance > 10;

      if (this.isDragging) {
        this.isDragging = false;
        this.input.setDefaultCursor("default");
      }

      // Double-click detection for click-to-move
      if (!wasDrag) {
        const now = Date.now();
        const worldPoint = this.cameras.main.getWorldPoint(
          pointer.x,
          pointer.y
        );

        if (
          now - this.lastClickTime < 400 &&
          this.lastClickWorldPos &&
          Phaser.Math.Distance.Between(
            worldPoint.x,
            worldPoint.y,
            this.lastClickWorldPos.x,
            this.lastClickWorldPos.y
          ) < 50
        ) {
          // Double-click detected — move player to target
          if (this.isWalkable(worldPoint.x, worldPoint.y)) {
            this.movePlayerToTarget(worldPoint.x, worldPoint.y);
          }
          this.lastClickTime = 0;
          this.lastClickWorldPos = null;
        } else {
          this.lastClickTime = now;
          this.lastClickWorldPos = new Phaser.Math.Vector2(
            worldPoint.x,
            worldPoint.y
          );
        }
      }
    });

    this.input.on("pointerupoutside", () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.input.setDefaultCursor("default");
      }
    });
  }

  update(time: number) {
    const cursors = this.input.keyboard?.createCursorKeys();
    let moving = false;
    if (
      (cursors!.left.isDown ||
        cursors!.right.isDown ||
        cursors!.up.isDown ||
        cursors!.down.isDown) &&
      !this.isDragging
    ) {
      if (!this.cameras.main.deadzone) {
        this.cameras.main.startFollow(this.player, true);
      }
    }
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

    // Click-to-move: if no keyboard input, follow the computed path
    if (!moving && this.movePath.length > 0) {
      const nextWaypoint = this.movePath[0];
      const dx = nextWaypoint.x - this.player.x;
      const dy = nextWaypoint.y - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5) {
        const texturekey = this.player.texture.key;
        const angle = Math.atan2(dy, dx);
        velocityX = Math.cos(angle) * 100;
        velocityY = Math.sin(angle) * 100;

        // Pick walk animation based on dominant direction
        if (Math.abs(dx) > Math.abs(dy)) {
          animationKey =
            dx < 0 ? `${texturekey}-left` : `${texturekey}-right`;
        } else {
          animationKey =
            dy < 0 ? `${texturekey}-back` : `${texturekey}-front`;
        }
        this.currentPlayerLastAnimation = animationKey;
        moving = true;

        if (!this.cameras.main.deadzone) {
          this.cameras.main.startFollow(this.player, true);
        }
      } else {
        // Reached this waypoint, advance to the next one
        this.movePath.shift();
        if (this.movePath.length === 0) {
          // Reached final destination
          this.tweens.killTweensOf(this.moveMarker);
          this.moveMarker.setVisible(false);
        }
      }
    } else if (moving && this.movePath.length > 0) {
      // Keyboard movement overrides click-to-move
      this.movePath = [];
      this.tweens.killTweensOf(this.moveMarker);
      this.moveMarker.setVisible(false);
    }

    this.player.body.setVelocity(velocityX, velocityY);

    if (this.proximityCircle) {
      this.proximityCircle.setPosition(this.player.x, this.player.y);
    }

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
        })
      );
    }

    for (const id in this.players) {
      const player = this.players[id];
      const label = this.labels[id];
      if (player && label) {
        label.setPosition(player.x, player.y - 20);
      }
    }
    if (time > this.lastProximityCheck + 200) {
      this.checkProximity();
      this.lastProximityCheck = time;
    }
  }

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

    // Clean up click-to-move state
    this.movePath = [];
    if (this.moveMarker) {
      this.tweens.killTweensOf(this.moveMarker);
    }
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  addPlayer(
    playerId: string,
    x: number,
    y: number,
    userName: string,
    avatarId: string
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

  private isWalkable(worldX: number, worldY: number): boolean {
    if (!this.worldLayer) return false;
    const map = this.worldLayer.tilemap;
    if (
      worldX < 0 ||
      worldY < 0 ||
      worldX >= map.widthInPixels ||
      worldY >= map.heightInPixels
    ) {
      return false;
    }
    const tile = this.worldLayer.getTileAtWorldXY(worldX, worldY);
    if (tile && tile.properties && tile.properties.collides) {
      return false;
    }
    return true;
  }

  private movePlayerToTarget(x: number, y: number) {
    const path = this.findPath(this.player.x, this.player.y, x, y);
    if (path.length === 0) return; // No valid path found

    this.movePath = path;

    // Draw pulsing target marker rings at destination
    this.tweens.killTweensOf(this.moveMarker);
    this.moveMarker.clear();
    this.moveMarker.lineStyle(2, 0x4ade80, 0.8);
    this.moveMarker.strokeCircle(0, 0, 10);
    this.moveMarker.lineStyle(1, 0x4ade80, 0.4);
    this.moveMarker.strokeCircle(0, 0, 16);
    this.moveMarker.setPosition(x, y);
    this.moveMarker.setAlpha(1);
    this.moveMarker.setVisible(true);

    // Pulse animation on the marker
    this.tweens.add({
      targets: this.moveMarker,
      alpha: { from: 1, to: 0.3 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Re-follow the player with camera
    this.cameras.main.startFollow(this.player, true);
  }

  /**
   * A* pathfinding on the tilemap grid.
   * Returns an array of world-coordinate waypoints from start to end,
   * navigating around any tile with { collides: true }.
   */
  private findPath(
    startWorldX: number,
    startWorldY: number,
    endWorldX: number,
    endWorldY: number
  ): Phaser.Math.Vector2[] {
    if (!this.worldLayer) return [];

    const layer = this.worldLayer;
    const startTileX = layer.worldToTileX(startWorldX)!;
    const startTileY = layer.worldToTileY(startWorldY)!;
    const endTileX = layer.worldToTileX(endWorldX)!;
    const endTileY = layer.worldToTileY(endWorldY)!;

    // Already on the target tile
    if (startTileX === endTileX && startTileY === endTileY) return [];

    const mapWidth = layer.tilemap.width;
    const mapHeight = layer.tilemap.height;

    // Check target is in-bounds and walkable
    if (endTileX < 0 || endTileY < 0 || endTileX >= mapWidth || endTileY >= mapHeight) return [];
    const endTile = layer.getTileAt(endTileX, endTileY);
    if (endTile && endTile.properties && endTile.properties.collides) return [];

    const openSet: PathNode[] = [];
    const closedSet = new Set<string>();

    const heuristic = (ax: number, ay: number, bx: number, by: number) =>
      Math.abs(ax - bx) + Math.abs(ay - by);

    const startNode: PathNode = {
      x: startTileX,
      y: startTileY,
      g: 0,
      h: heuristic(startTileX, startTileY, endTileX, endTileY),
      f: 0,
      parent: null,
    };
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];

    const MAX_ITERATIONS = 2000;
    let iterations = 0;

    while (openSet.length > 0 && iterations < MAX_ITERATIONS) {
      iterations++;

      // Find node with lowest f score (tie-break on h)
      let currentIdx = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (
          openSet[i].f < openSet[currentIdx].f ||
          (openSet[i].f === openSet[currentIdx].f &&
            openSet[i].h < openSet[currentIdx].h)
        ) {
          currentIdx = i;
        }
      }
      const current = openSet[currentIdx];

      // Reached the goal — reconstruct and simplify the path
      if (current.x === endTileX && current.y === endTileY) {
        const raw: Phaser.Math.Vector2[] = [];
        let node: PathNode | null = current;
        const halfW = layer.tilemap.tileWidth / 2;
        const halfH = layer.tilemap.tileHeight / 2;

        while (node) {
          raw.unshift(
            new Phaser.Math.Vector2(
              layer.tileToWorldX(node.x)! + halfW,
              layer.tileToWorldY(node.y)! + halfH
            )
          );
          node = node.parent;
        }
        // Drop the first waypoint (player's current tile)
        if (raw.length > 1) raw.shift();
        return this.simplifyPath(raw);
      }

      openSet.splice(currentIdx, 1);
      closedSet.add(`${current.x},${current.y}`);

      for (const dir of directions) {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;

        if (nx < 0 || ny < 0 || nx >= mapWidth || ny >= mapHeight) continue;
        if (closedSet.has(`${nx},${ny}`)) continue;

        const tile = layer.getTileAt(nx, ny);
        if (tile && tile.properties && tile.properties.collides) continue;

        const g = current.g + 1;
        const h = heuristic(nx, ny, endTileX, endTileY);
        const f = g + h;

        const existingIdx = openSet.findIndex(
          (n) => n.x === nx && n.y === ny
        );
        if (existingIdx !== -1) {
          if (g < openSet[existingIdx].g) {
            openSet[existingIdx].g = g;
            openSet[existingIdx].f = f;
            openSet[existingIdx].parent = current;
          }
          continue;
        }

        openSet.push({ x: nx, y: ny, g, h, f, parent: current });
      }
    }

    return []; // No path found
  }

  /** Remove redundant collinear waypoints for smoother movement */
  private simplifyPath(
    path: Phaser.Math.Vector2[]
  ): Phaser.Math.Vector2[] {
    if (path.length <= 2) return path;
    const simplified: Phaser.Math.Vector2[] = [path[0]];
    for (let i = 1; i < path.length - 1; i++) {
      const prev = simplified[simplified.length - 1];
      const next = path[i + 1];
      const sameX = prev.x === path[i].x && path[i].x === next.x;
      const sameY = prev.y === path[i].y && path[i].y === next.y;
      if (!sameX && !sameY) {
        simplified.push(path[i]);
      }
    }
    simplified.push(path[path.length - 1]);
    return simplified;
  }

  private checkProximity() {
    if (!this.player || !this.userId) return;

    const nearByUserIds: string[] = [];
    for (const [remoteUserId, remoteSprite] of Object.entries(this.players)) {
      if (remoteSprite) {
        const dis = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          remoteSprite.x,
          remoteSprite.y
        );
        if (dis <= this.PROXIMITY_RADIUS) {
          nearByUserIds.push(remoteUserId);
        }
      }
    }
    window.dispatchEvent(
      new CustomEvent("ph-proximity-update", {
        detail: { nearByUserIds },
      })
    );
  }
}

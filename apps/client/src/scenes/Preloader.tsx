import { Scene } from "phaser";
const mapId = localStorage.getItem("mapId") || "default";

export default class Preloader extends Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.image(
      "tuxmon-sample-32px-extruded",
      "../../tuxmon-sample-32px-extruded.png"
    );
    this.load.tilemapTiledJSON("map", `../../${mapId}.json`);
    this.load.atlas(
      "pajji",
      "../../avatars/pajji/pajji.png",
      "../../avatars/pajji/pajji.json"
    );
    this.load.atlas(
      "snowman",
      "../../avatars/snowman/snowman.png",
      "../../avatars/snowman/snowman.json"
    );
    this.load.atlas(
      "cat",
      "../../avatars/cat/cat.png",
      "../../avatars/cat/cat.json"
    );
    this.load.atlas(
      "zombie",
      "../../avatars/zombie/zombie.png",
      "../../avatars/zombie/zombie.json"
    );
    this.load.atlas(
      "bride",
      "../../avatars/bride/bride.png",
      "../../avatars/bride/bride.json"
    );
    this.load.atlas(
      "wolf",
      "../../avatars/wolf/wolf.png",
      "../../avatars/wolf/wolf.json"
    );
    this.load.atlas(
      "gingerbread",
      "../../avatars/gingerbread/gingerbread.png",
      "../../avatars/gingerbread/gingerbread.json"
    );
    this.load.atlas(
      "vampire",
      "../../avatars/vampire/vampire.png",
      "../../avatars/vampire/vampire.json"
    );
  }
  create() {
    this.scene.start("garden");
  }
}

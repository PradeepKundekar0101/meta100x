import {Scene} from "phaser"
const mapId = localStorage.getItem("mapId") || "default";

export default class Preloader extends Scene{
    constructor(){
        super("preloader")
    }
    preload(){
        this.load.image("tuxmon-sample-32px-extruded","../../public/tuxmon-sample-32px-extruded.png")
        this.load.tilemapTiledJSON("map",`../../public/${mapId}.json`)
        this.load.atlas("pajji", "../../public/avatars/pajji/pajji.png", "../../public/avatars/pajji/pajji.json");
        this.load.atlas("snowman", "../../public/avatars/snowman/snowman.png", "../../public/avatars/snowman/snowman.json");
        this.load.atlas("cat", "../../public/avatars/cat/cat.png", "../../public/avatars/cat/cat.json");
        this.load.atlas("zombie", "../../public/avatars/zombie/zombie.png", "../../public/avatars/zombie/zombie.json");
        this.load.atlas("bride", "../../public/avatars/bride/bride.png", "../../public/avatars/bride/bride.json");
        this.load.atlas("wolf", "../../public/avatars/wolf/wolf.png", "../../public/avatars/wolf/wolf.json");
        this.load.atlas("gingerbread", "../../public/avatars/gingerbread/gingerbread.png", "../../public/avatars/gingerbread/gingerbread.json");
        this.load.atlas("vampire", "../../public/avatars/vampire/vampire.png", "../../public/avatars/vampire/vampire.json");
    }
    create(){
        this.scene.start("garden")
    }
}
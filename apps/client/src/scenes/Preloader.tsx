import {Scene} from "phaser"

export default class Preloader extends Scene{
    constructor(){
        super("preloader")
    }
    preload(){
        this.load.image("tuxmon-sample-32px-extruded","../../public/tuxmon-sample-32px-extruded.png")
        this.load.tilemapTiledJSON("map","../../public/tuxemon-town.json")
        this.load.atlas("pajji", "../../public/avatars/pajji/pajji.png", "../../public/avatars/pajji/pajji.json");
        this.load.atlas("snowman", "../../public/avatars/snowman/snowman.png", "../../public/avatars/snowman/snowman.json");
    }
    create(){
        this.scene.start("garden")
    }
}
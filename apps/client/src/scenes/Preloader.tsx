import {Scene} from "phaser"
export default class Preloader extends Scene{
    constructor(){
        super("preloader")
    }
    preload(){
        this.load.image("tuxmon-sample-32px-extruded","tuxmon-sample-32px-extruded.png")
        this.load.tilemapTiledJSON("map","tuxemon-town.json")
        this.load.atlas("atlas", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json");
    }
    create(){
        this.scene.start("garden")
    }
}
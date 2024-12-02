export  const createAnimations = (anims:Phaser.Animations.AnimationManager)=>{
    anims.create({
      key: "snowman-left",
      frames: anims.generateFrameNames("snowman", {
        prefix: "left",
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
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  
  }
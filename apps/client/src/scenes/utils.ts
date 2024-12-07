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

    //----ZOMBIE------
    anims.create({
      key: "zombie-left",
      frames: anims.generateFrameNames("zombie", {
        prefix: "left",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "zombie-right",
      frames: anims.generateFrameNames("zombie", {
        prefix: "right",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "zombie-front",
      frames: anims.generateFrameNames("zombie", {
        prefix: "front",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "zombie-back",
      frames: anims.generateFrameNames("zombie", {
        prefix: "back",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    //----CAT------
    anims.create({
      key: "zombie-left",
      frames: anims.generateFrameNames("zombie", {
        prefix: "left",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "cat-right",
      frames: anims.generateFrameNames("cat", {
        prefix: "right",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "cat-front",
      frames: anims.generateFrameNames("cat", {
        prefix: "front",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "cat-back",
      frames: anims.generateFrameNames("cat", {
        prefix: "back",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "cat-left",
      frames: anims.generateFrameNames("cat", {
        prefix: "left",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  
    //----vampire------
    anims.create({
      key: "zombie-left",
      frames: anims.generateFrameNames("zombie", {
        prefix: "left",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "vampire-right",
      frames: anims.generateFrameNames("vampire", {
        prefix: "right",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "vampire-front",
      frames: anims.generateFrameNames("vampire", {
        prefix: "front",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "vampire-back",
      frames: anims.generateFrameNames("vampire", {
        prefix: "back",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "vampire-left",
      frames: anims.generateFrameNames("vampire", {
        prefix: "left",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    //----bride------
    anims.create({
      key: "zombie-left",
      frames: anims.generateFrameNames("zombie", {
        prefix: "left",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "bride-right",
      frames: anims.generateFrameNames("bride", {
        prefix: "right",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "bride-front",
      frames: anims.generateFrameNames("bride", {
        prefix: "front",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "bride-back",
      frames: anims.generateFrameNames("bride", {
        prefix: "back",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "bride-left",
      frames: anims.generateFrameNames("bride", {
        prefix: "left",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    //----gingerbread------
    anims.create({
      key: "zombie-left",
      frames: anims.generateFrameNames("zombie", {
        prefix: "left",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "gingerbread-right",
      frames: anims.generateFrameNames("gingerbread", {
        prefix: "right",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "gingerbread-front",
      frames: anims.generateFrameNames("gingerbread", {
        prefix: "front",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "gingerbread-back",
      frames: anims.generateFrameNames("gingerbread", {
        prefix: "back",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "gingerbread-left",
      frames: anims.generateFrameNames("gingerbread", {
        prefix: "left",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    //----wolf------
    anims.create({
      key: "zombie-left",
      frames: anims.generateFrameNames("zombie", {
        prefix: "left",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "wolf-right",
      frames: anims.generateFrameNames("wolf", {
        prefix: "right",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "wolf-front",
      frames: anims.generateFrameNames("wolf", {
        prefix: "front",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "wolf-back",
      frames: anims.generateFrameNames("wolf", {
        prefix: "back",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "wolf-left",
      frames: anims.generateFrameNames("wolf", {
        prefix: "left",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  
  }
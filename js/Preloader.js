StarRush.Preloader = function (game) {

};

StarRush.Preloader.prototype = {

	preload: function () {

		this.stage.backgroundColor = '#B4D9E7';
		this.add.sprite(135, 120, 'screen-loading');
		// Setting preloader bar
		var preloadBar = this.add.sprite(244, 392, 'preloader-bar');
		this.load.setPreloadSprite(preloadBar);
		
		// Loading all game assets

		// Load backgrounds
		this.load.image('sky', 'assets/images/backgrounds/sky.png');
    	this.load.image('background', 'assets/images/backgrounds/background.png');
    	this.load.image('levels-background', 'assets/images/backgrounds/levels-background.png');
        this.load.image('graveyard', 'assets/images/backgrounds/graveyard.png');

    	// Load buttons
    	this.load.spritesheet('audio-on', 'assets/images/buttons/button-audio-on.png', 88, 75);
    	this.load.spritesheet('audio-off', 'assets/images/buttons/button-audio-off.png', 88, 75);

    	this.load.spritesheet('button-play', 'assets/images/buttons/button-play.png', 202, 75);
    	this.load.spritesheet('button-how-to-play', 'assets/images/buttons/button-how-to-play.png', 202, 75);
    	this.load.spritesheet('button-back', 'assets/images/buttons/button-back.png', 202, 75);
    	this.load.spritesheet('button-restart', 'assets/images/buttons/button-restart.png', 202, 75);
    	this.load.spritesheet('button-yes', 'assets/images/buttons/button-yes.png', 202, 75);
    	this.load.spritesheet('button-no', 'assets/images/buttons/button-no.png', 202, 75);
    	this.load.spritesheet('button-continue', 'assets/images/buttons/button-continue.png', 202, 75);

    	this.load.spritesheet('button-level-one', 'assets/images/buttons/level-one.png', 67, 69);
    	this.load.spritesheet('button-level-two', 'assets/images/buttons/level-two.png', 67, 69);
    	this.load.spritesheet('button-level-three', 'assets/images/buttons/level-three.png', 67, 69);
    	this.load.spritesheet('button-level-four', 'assets/images/buttons/level-four.png', 67, 69);
    	this.load.spritesheet('button-level-five', 'assets/images/buttons/level-five.png', 67, 69);
    	this.load.spritesheet('button-level-six', 'assets/images/buttons/level-six.png', 67, 69);
    	this.load.spritesheet('button-level-seven', 'assets/images/buttons/level-seven.png', 67, 69);
    	this.load.spritesheet('button-level-eight', 'assets/images/buttons/level-eight.png', 67, 69);
    	this.load.spritesheet('button-level-nine', 'assets/images/buttons/level-nine.png', 67, 69);
    	this.load.spritesheet('button-level-ten', 'assets/images/buttons/level-ten.png', 67, 69);
    	this.load.spritesheet('button-level-eleven', 'assets/images/buttons/level-eleven.png', 67, 69);
    	this.load.spritesheet('button-level-twelve', 'assets/images/buttons/level-twelve.png', 67, 69);

    	this.load.image('level-one-locked', 'assets/images/buttons/level-one-locked.png');
    	this.load.image('level-two-locked', 'assets/images/buttons/level-two-locked.png');
    	this.load.image('level-three-locked', 'assets/images/buttons/level-three-locked.png');
    	this.load.image('level-four-locked', 'assets/images/buttons/level-four-locked.png');
    	this.load.image('level-five-locked', 'assets/images/buttons/level-five-locked.png');
    	this.load.image('level-six-locked', 'assets/images/buttons/level-six-locked.png');
    	this.load.image('level-seven-locked', 'assets/images/buttons/level-seven-locked.png');
    	this.load.image('level-eight-locked', 'assets/images/buttons/level-eight-locked.png');
    	this.load.image('level-nine-locked', 'assets/images/buttons/level-nine-locked.png');
    	this.load.image('level-ten-locked', 'assets/images/buttons/level-ten-locked.png');
    	this.load.image('level-eleven-locked', 'assets/images/buttons/level-eleven-locked.png');
    	this.load.image('level-twelve-locked', 'assets/images/buttons/level-twelve-locked.png');

    	// Touch screen buttons
    	this.load.image('button-left', 'assets/images/buttons/button-left.png');
    	this.load.image('button-right', 'assets/images/buttons/button-right.png');
    	this.load.image('button-up', 'assets/images/buttons/button-up.png');

    	// Load tiles
    	this.load.image('ground', 'assets/images/tiles/level-one/ground.png');
    	this.load.image('ground-1', 'assets/images/tiles/level-one/ground-1.png');
    	this.load.image('ground-2', 'assets/images/tiles/level-one/ground-2.png');
    	this.load.image('ground-3', 'assets/images/tiles/level-one/ground-3.png');
    	this.load.image('ground-4', 'assets/images/tiles/level-one/ground-4.png');
    	this.load.image('ground-5', 'assets/images/tiles/level-one/ground-5.png');
    	this.load.image('ground-6', 'assets/images/tiles/level-one/ground-6.png');
    	this.load.image('ground-7', 'assets/images/tiles/level-one/ground-7.png');
    	this.load.image('ground-8', 'assets/images/tiles/level-one/ground-8.png');
    	this.load.image('ground-9', 'assets/images/tiles/level-one/ground-9.png');
    	this.load.image('ground-10', 'assets/images/tiles/level-one/ground-10.png');
    	this.load.image('ground-11', 'assets/images/tiles/level-one/ground-11.png');
    	this.load.image('ground-12', 'assets/images/tiles/level-one/ground-12.png');
    	this.load.image('water', 'assets/images/tiles/level-one/water.png');
    	this.load.image('obstacle', 'assets/images/tiles/level-one/obstacle.png');
        this.load.image('ground-20', 'assets/images/tiles/level-two/ground-20.png');
        this.load.image('ground-21', 'assets/images/tiles/level-two/ground-21.png');
        this.load.image('ground-22', 'assets/images/tiles/level-two/ground-22.png');
        this.load.image('ground-23', 'assets/images/tiles/level-two/ground-23.png');
        this.load.image('ground-24', 'assets/images/tiles/level-two/ground-24.png');
        this.load.image('ground-25', 'assets/images/tiles/level-two/ground-25.png');
        this.load.image('ground-26', 'assets/images/tiles/level-two/ground-26.png');
        this.load.image('ground-27', 'assets/images/tiles/level-two/ground-27.png');
        this.load.image('ground-28', 'assets/images/tiles/level-two/ground-28.png');
        this.load.image('ground-29', 'assets/images/tiles/level-two/ground-29.png');
        this.load.image('ground-30', 'assets/images/tiles/level-two/ground-30.png');
        this.load.image('ground-31', 'assets/images/tiles/level-two/ground-31.png');
        this.load.image('ground-32', 'assets/images/tiles/level-two/ground-32.png');
        this.load.image('ground-33', 'assets/images/tiles/level-two/ground-33.png');
        this.load.image('ground-34', 'assets/images/tiles/level-two/ground-34.png');
        this.load.image('ground-35', 'assets/images/tiles/level-two/ground-35.png');
        this.load.image('bridge', 'assets/images/tiles/level-two/bridge.png');
        this.load.image('spikes', 'assets/images/tiles/level-two/spikes.png');
        this.load.image('acid', 'assets/images/tiles/level-two/acid.png');

    	// Load objects
    	this.load.image('arrow', 'assets/images/objects/arrow.png');
    	this.load.image('arrow-2', 'assets/images/objects/arrow-2.png');
    	this.load.image('arrow-3', 'assets/images/objects/arrow-3.png');
    	this.load.image('arrow-4', 'assets/images/objects/arrow-4.png');
    	this.load.image('arrow-5', 'assets/images/objects/arrow-5.png');
        this.load.image('arrow-6', 'assets/images/objects/arrow-6.png');
    	this.load.image('arrow-7', 'assets/images/objects/arrow-7.png');
    	this.load.image('tree', 'assets/images/objects/tree.png');
        this.load.image('tree-1', 'assets/images/objects/tree-1.png');
    	this.load.image('tree-2', 'assets/images/objects/tree-2.png');
        this.load.image('bush', 'assets/images/objects/bush.png');
        this.load.image('bush-1', 'assets/images/objects/bush-1.png');
    	this.load.image('bush-2', 'assets/images/objects/bush-2.png');
    	this.load.image('mushroom', 'assets/images/objects/mushroom.png');
    	this.load.image('stone', 'assets/images/objects/stone.png');
        this.load.image('water-drop', 'assets/images/objects/water-drop.png');
    	this.load.image('acid-drop', 'assets/images/objects/acid-drop.png');
    	this.load.image('explosion-spark', 'assets/images/objects/explosion-spark.png');
    	this.load.image('sign', 'assets/images/objects/sign.png');
    	this.load.image('lock', 'assets/images/objects/lock.png');
    	this.load.image('star', 'assets/images/objects/star.png');
    	this.load.image('character', 'assets/images/objects/character.png', 32, 48);
    	this.load.spritesheet('player', 'assets/images/objects/dude.png', 32, 48);
    	this.load.image('text-box', 'assets/images/objects/text-box.png');
    	this.load.image('run', 'assets/images/objects/run.png');
    	this.load.image('learn', 'assets/images/objects/learn.png');
    	this.load.image('lean', 'assets/images/objects/lean.png');
    	this.load.image('talk', 'assets/images/objects/talk.png');
    	this.load.image('scoreboard', 'assets/images/objects/scoreboard.png');
    	this.load.image('locked-door', 'assets/images/objects/locked-door.png');
    	this.load.image('unlocked-door', 'assets/images/objects/unlocked-door.png');
    	this.load.image('highscore', 'assets/images/objects/highscore.png');
    	this.load.image('crate', 'assets/images/objects/crate.png');
    	this.load.image('enemy-1', 'assets/images/objects/enemy-1.png');
    	this.load.image('enemy-2', 'assets/images/objects/enemy-2.png');
    	this.load.image('enemy-3', 'assets/images/objects/enemy-3.png');
    	this.load.image('enemy-4', 'assets/images/objects/enemy-4.png');
        this.load.image('enemy-5', 'assets/images/objects/enemy-5.png');
        this.load.image('tombstone', 'assets/images/objects/tombstone.png');
    	this.load.image('skeleton', 'assets/images/objects/skeleton.png');

    	// Load audio files
    	this.load.audio('click-sound', ['assets/audio/button-click.mp3', 'assets/audio/button-click.ogg']);
    	this.load.audio('background-sound', ['assets/audio/background-sound.mp3', 'assets/audio/background-sound.ogg']);
    	this.load.audio('splash-sound', ['assets/audio/water-splash.mp3', 'assets/audio/water-splash.ogg']);
    	this.load.audio('explosion-sound', ['assets/audio/explosion.mp3', 'assets/audio/explosion.ogg']);
    	this.load.audio('completed-sound', ['assets/audio/level-completed.mp3', 'assets/audio/level-completed.ogg']);
    	this.load.audio('highscore-sound', ['assets/audio/new-highscore.mp3', 'assets/audio/new-highscore.ogg']);
        this.load.audio('level-sound', ['assets/audio/level.mp3', 'assets/audio/level.ogg']);
    	this.load.audio('level-sound-2', ['assets/audio/level-2.mp3', 'assets/audio/level-2.ogg']);
	},

	create: function () {
		this.game.style1 = { font: "bold 20px Kristen ITC", fill: "#FF8B00", boundsAlignH: "center", boundsAlignV: "middle" };
		this.game.style2 = { font: "25px Kristen ITC", fill: "#982C00", boundsAlignH: "center", boundsAlignV: "middle" };
		this.state.start('MainMenu');
	}

};
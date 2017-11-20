StarRush.LevelTwo = function (game) {

    this.ground = null;
    this.acid = null;
    this.stars = null;
    this.player = null;
    this.enemies = null;
    this.spikes = null;
    this.crates = null;
    this.cursors = null;
    this.acidEmitter = null;
    this.explosionEmitter = null;
    this.splashSound = null;
    this.explosionSound = null;
    this.clickSound = null;
    this.buttonBack = null;
    this.completedSound = null;
    this.highscoreSound = null;
    this.levelMusic = null;
    this.buttonRestart = null;
    this.buttonYes = null; 
    this.buttonNo = null;
    this.buttonContinue = null;
    this.buttonAudioOn = null;
    this.buttonAudioOff = null;
    this.areYouSure = null;
    this.scoreText = null;
    this.timeText = null;
    this.startedAt = null;
    this.timeElapsed = null;
    this.timer = null;
    this.exitLocked = null;
    this.exitUnlocked = null;
    this.gameOver = null;
    this.highscoreSign = null;
    // For touch versions
    this.buttonLeft = null;
    this.buttonRight = null;
    this.buttonUp = null;
    this.jump = null;
    this.moveLeft = null;
    this.moveRight = null;
};

StarRush.LevelTwo.prototype = {

    create: function () {

        this.world.setBounds(0, 0, 2560, 1200);
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.decorateLevel();
        this.setSounds();
        this.setExit();
        this.setSpikes();
        this.setAcidTiles();
        this.setGroundTiles();
        this.setStars();
        this.setEnemies();
        this.setCrates();
        this.setEmitters();
        this.setHighscoreSign();
        this.setPlayer();
        this.setScoreBoard();
        this.setButtons();

        this.camera.follow(this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.startedAt = new Date();
        this.gameOver = false;
        this.levelMusic.play();
    },

    update: function () {

        // Move enemies in their areas
        var areas = [
            '1210:730',
            '2150:1970',
            '1900:1315',
            '610:300',
            '900:300',
            '1500:750',
            '1700:1200',
            '920:150'
        ];

        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies.getByName('enemy-' + i);
            var velocity = (i == 7) ? 250 : 200;
            if (i < 7) {
                enemy.body.velocity.x = (enemy.direction == 'left') ? -velocity : velocity;
                enemy.direction = (enemy.x > parseInt(areas[i].split(':')[0])) ? 'left' : (enemy.x < parseInt(areas[i].split(':')[1])) ? 'right' : enemy.direction;
            } else {
                enemy.body.velocity.y = (enemy.direction == 'up') ? -velocity : velocity;
                enemy.direction = (enemy.y > parseInt(areas[i].split(':')[0])) ? 'up' : (enemy.y < parseInt(areas[i].split(':')[1])) ? 'down' : enemy.direction;
            }
        }

        //  Reset the players velocity on x axis
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown || this.moveLeft == true)
        {
            this.player.body.velocity.x = -250;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown || this.moveRight == true)
        {
            this.player.body.velocity.x = 250;
            this.player.animations.play('right');
        }
        else
        {
            this.player.animations.stop();
            this.player.frame = 4;
        }

        var hitGround = this.physics.arcade.collide(this.player, this.ground);
        var hitCrate = this.physics.arcade.collide(this.player, this.crates);

        //  Allow the player to jump if he is on top of the ground, obstacle or crate
        if ((this.cursors.up.isDown || this.jump == true) && this.player.body.touching.down && (hitGround || hitCrate))
        {
            this.player.body.velocity.y = -350;
        }

        this.physics.arcade.collide(this.stars, this.ground);
        this.physics.arcade.overlap(this.player, this.acid, this.killedByAcid, null, this);
        this.physics.arcade.overlap(this.player, this.enemies, this.killedByEnemyOrSpikes, null, this);
        this.physics.arcade.overlap(this.player, this.spikes, this.killedByEnemyOrSpikes, null, this);
        this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.arcade.overlap(this.player, this.exitUnlocked, this.levelWon, null, this);

        this.timer = Math.abs(this.time.elapsedSecondsSince(this.startedAt));
        var date = new Date(null);
        date.setSeconds(this.timer);
        this.timeElapsed = date.toISOString().substr(11, 8);
        if (!this.gameOver) {
            this.timeText.setText('Time: ' + this.timeElapsed);
        }

        if (this.stars.countDead() == 6) {
            this.exitUnlocked.visible = true;
            this.exitLocked.visible = false;
        }
    },

    particleBurst: function (pointer, type) {
        var emitter = type == 'acid' ? this.acidEmitter : this.explosionEmitter;
        emitter.x = pointer.x;
        emitter.y = pointer.y;
        emitter.start(true, 3000, null, 10);
        this.time.events.add(3000, this.destroyEmitter, { emitter: emitter });
    },

    destroyEmitter: function () {
        this.emitter.destroy();
    },

    collectStar: function (player, star) {
        star.kill();
        this.scoreText.setText('Stars: ' + this.stars.countDead() + '/6');
    },

    killedByAcid: function (player, river) {
        var sound = this.splashSound;
        var particleType = 'acid';
        this.killPlayer(player, particleType, sound);
    },

    killedByEnemyOrSpikes: function (player, enemy) {
        var sound = this.explosionSound;
        var particleType = 'explosion';
        this.killPlayer(player, particleType, sound);
    },

    killPlayer: function (player, particleType, sound) {
        var point = {
            x: player.x + player.width/2,
            y: player.y + player.height/2
        };
        player.kill();
        this.particleBurst(point, particleType);
        sound.play();
        this.gameOver = true;
        var thiz = this;
        setTimeout(function () { 
            thiz.setButtonVisibility(true, true, false, false, false);
        }, 600);
    },

    setAcidTiles: function () {
        this.acid = this.add.group();
        this.acid.enableBody = true;

        var height1 = this.world.height - 128;
        var height2 = this.world.height - 1024;

        for (var i = 10; i < 14; i++) {
            this.acid.create(i * 128, height1, 'acid');         
        }

        for (var i = 4; i < 8; i++) {
            this.acid.create(i * 128 + 24, height2, 'acid');
        }

        this.acid.forEach(function (item) {
            item.body.setSize(128, 60, 0, 68);
        }, this);
    },

    setGroundTiles: function () {
        this.ground = this.add.group();
        this.ground.enableBody = true;

        var height1 = this.world.height - 128;
        var height2 = this.world.height - 896;
        var height3 = this.world.height - 462;
        var height4 = this.world.height - 1024;
        var height5 = this.world.height - 768;

        for (var i = 0; i < 4; i++) {
            this.ground.create(1920 + (i * 70), height1, 'bridge');  
        }
        for (var i = 0; i < 3; i++) {
            this.ground.create(1792 + (i * 70), height3, 'bridge');
        }
        for (var i = 5; i < 10; i++) {
            this.ground.create(i * 128, height1, 'ground-20');
        }
        for (var i = 8; i < 12; i++) {
            this.ground.create(i * 128 + 280, height2, 'ground-20');
        }
        for (var i = 2; i < 11; i++) {
            this.ground.create(2456, this.world.height - (i * 128), 'ground-24');
        }
        for (var i = 0; i < 5; i++) {
            this.ground.create(2376, this.world.height - 286 - (i * 160), 'ground-28');
        }     
        for (var i = 0; i < 5; i ++) {
            this.ground.create(2201, this.world.height - 366 - (i * 160), 'ground-28');
        }
        for (var i = 0; i < 13; i++) {
            this.ground.create(i * 128, height3, 'ground-31');     
        }
        for (var i = 1; i < 14; i++) {
            this.ground.create(i * 128 + 280, height5, 'ground-33');
        }
        for (var i = 1; i < 6; i++) {
            this.ground.create(i * 128 + 280, height2, 'ground-35');
        }

        this.ground.create(0, height1, 'ground-20');
        this.ground.create(408, height4, 'ground-20');
        this.ground.create(512, height1, 'ground-21');
        this.ground.create(1664, height1, 'ground-21');
        this.ground.create(2200, height1, 'ground-21');
        this.ground.create(1944, this.world.height - 552, 'ground-21');
        this.ground.create(920, height4, 'ground-21');
        this.ground.create(280, height4, 'ground-21');
        this.ground.create(1944, height4, 'ground-21');
        this.ground.create(128, height1, 'ground-22');
        this.ground.create(1280, height1, 'ground-22');
        this.ground.create(1792, height1, 'ground-22');
        this.ground.create(1048, height4, 'ground-22');
        this.ground.create(2072, height4, 'ground-22');
        this.ground.create(536, height4, 'ground-22');
        this.ground.create(2072, this.world.height - 552, 'ground-22');
        this.ground.create(2456, height1, 'ground-23');
        this.ground.create(1944, height2, 'ground-23');
        this.ground.create(280, height2, 'ground-24');
        this.ground.create(2328, height1, 'ground-25');
        this.ground.create(1816, height2, 'ground-25');
        this.ground.create(2072, this.world.height - 424, 'ground-26');           
        this.ground.create(2072, height5, 'ground-26');
        this.ground.create(2072, height2, 'ground-27');
        this.ground.create(1176, height2, 'ground-29');
        this.ground.create(1664, height3, 'ground-30');
        this.ground.create(280, height3, 'ground-31');  
        this.ground.create(1944, this.world.height - 424, 'ground-32');
        this.ground.create(280, height5, 'ground-32');
        this.ground.create(1048, height2, 'ground-34');

        this.ground.forEach(function (item) {
            item.body.immovable = true;
        }, this);      
    },

    setStars: function () {
        this.stars = this.add.group();
        this.stars.enableBody = true;

        this.stars.create(1000, this.world.height - 150, 'star');
        this.stars.create(2400, this.world.height - 150, 'star');
        this.stars.create(1650, this.world.height - 918, 'star');
        this.stars.create(470, this.world.height - 1046, 'star');
        this.stars.create(550, this.world.height - 484, 'star');
        this.stars.create(1400, this.world.height - 484, 'star');
    },

    setPlayer: function () {
        this.player = this.add.sprite(32, this.world.height - 176, 'player');
        this.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 650;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(12, 40, 10, 8);

        //  Animations for walking left and right
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    },

    setSpikes: function () {
        this.spikes = this.add.group();
        this.spikes.enableBody = true;

        this.spikes.create(2 * 128, this.world.height - 128, 'spikes');
        this.spikes.create(3 * 128, this.world.height - 128, 'spikes');

        this.spikes.forEach(function (item) {
            item.body.setSize(128, 64, 0, 64);
        }, this);
    },

    setCrates: function () {
        this.crates = this.add.group();
        this.crates.enableBody = true;

        var height1 = this.world.height - 205;

        this.crates.create(563, height1, 'crate');
        this.crates.create(640, height1, 'crate');
        this.crates.create(1260, height1, 'crate');
        this.crates.create(2256, height1, 'crate');
        this.crates.create(1224, this.world.height - 973, 'crate');
        this.crates.create(2112, this.world.height - 629, 'crate');

        for (var i = 0; i < 10; i++) {
            this.crates.create(0, this.world.height - 539 - (i * 77), 'crate');        
        }

        this.crates.forEach(function (item) {
            item.body.immovable = true;
        }, this);
    },

    setEnemies: function () {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
    
        // Ground enemies
        this.enemies.create(725, this.world.height - 192, 'enemy-3');
        this.enemies.create(1960, this.world.height - 1064, 'enemy-1');
        this.enemies.create(1305, this.world.height - 960, 'enemy-3');
        this.enemies.create(300, this.world.height - 1064, 'enemy-1');
        this.enemies.create(300, this.world.height - 526, 'enemy-3');
        this.enemies.create(1000, this.world.height - 526, 'enemy-3');
        this.enemies.create(1700, this.world.height - 526, 'enemy-3');
        this.enemies.create(2310, this.world.height - 1050, 'enemy-4');

        var i = 0;
        this.enemies.forEach(function (item) {
            item.name = 'enemy-' + i;
            item.direction = i == 5 ? 'left' : i == 7 ? 'down' : 'right';
            if (i == 1 || i == 3) {
                item.body.setSize(32, 27, 0, 13);
            } else if (i != 7) {
                item.body.setSize(32, 51, 0, 13);
            } else {
                item.body.setSize(20, 20, 11, 10);
            }
            item.body.immovable = true;
            i++;
        }, this);        
    },

    setButtons: function () {
        this.buttonBack = this.add.button(this.game.width - 225, 67, 'button-back', this.backToMainMenu, this, 1, 0, 2, 0);
        this.buttonRestart = this.add.button(this.game.width/2, this.game.height/2, 'button-restart', this.restartGame, this, 1, 0, 2, 0);
        this.buttonYes = this.add.button(this.game.width/2 - 104, this.game.height/2, 'button-yes', this.quitGame, this, 1, 0, 2, 0);
        this.buttonNo = this.add.button(this.game.width/2 + 104, this.game.height/2, 'button-no', this.stayOnLevel, this, 1, 0, 2, 0);   
        this.buttonContinue = this.add.button(this.game.width/2, this.game.height/2, 'button-continue', this.backToLevels, this, 1, 0, 2, 0);
        this.buttonAudioOn = this.add.button(this.game.width - 70, 67, 'audio-on', this.turnMusicOnOff, this, 1, 0);
        this.buttonAudioOff = this.add.button(this.game.width - 70, 67, 'audio-off', this.turnMusicOnOff, this, 1, 0);

        this.buttonAudioOn.visible = this.sound.mute == false ? true : false;
        this.buttonAudioOff.visible = !this.buttonAudioOn.visible;

        var buttons = [this.buttonBack, this.buttonAudioOn, this.buttonAudioOff, this.buttonRestart, this.buttonYes, this.buttonNo, this.buttonContinue];

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].fixedToCamera = true;
            buttons[i].onDownSound = this.clickSound;
            buttons[i].anchor.setTo(0.5, 0.5);

            if (i > 2) {
                buttons[i].visible = false;
            }
        }

        // Begin for mobile versions
        if (!this.game.device.desktop) {
            this.buttonLeft = this.add.sprite(50, this.game.height - 100, 'button-left');
            this.buttonRight = this.add.sprite(160, this.game.height - 100, 'button-right');
            this.buttonUp = this.add.sprite(this.game.width - 130, this.game.height - 100, 'button-up');

            var touchButtons = [this.buttonLeft, this.buttonRight, this.buttonUp];
            for (var i = 0; i < touchButtons.length; i++) {
                touchButtons[i].fixedToCamera = true;
                touchButtons[i].inputEnabled = true;
                touchButtons[i].input.pixelPerfectClick = true;
            }

            var thiz = this;
            this.buttonLeft.events.onInputDown.add(function () { thiz.moveLeft = true; });
            this.buttonLeft.events.onInputUp.add(function () { thiz.moveLeft = false; });
            this.buttonRight.events.onInputDown.add(function () { thiz.moveRight = true; });
            this.buttonRight.events.onInputUp.add(function () { thiz.moveRight = false; });
            this.buttonUp.events.onInputDown.add(function () { thiz.jump = true; });
            this.buttonUp.events.onInputUp.add(function () { thiz.jump = false; });
        }
        // End for mobile versions

        this.areYouSure = {};
        this.areYouSure.sign = this.add.sprite(this.game.width/2, this.game.height - 93, 'sign');
        this.areYouSure.sign.anchor.x = 0.5;
        this.areYouSure.sign.fixedToCamera = true;
        this.areYouSure.sign.visible = false;

        var sure = 'Are you\n  sure?';
        this.areYouSure.text = this.add.text(this.game.width/2 - 40, this.game.height - 82, sure, this.game.style1);
        this.areYouSure.text.fixedToCamera = true;
        this.areYouSure.text.visible = false;
    },

    setScoreBoard: function () {
        var scoreboard = this.add.sprite(30, 0, 'scoreboard');
        scoreboard.fixedToCamera = true;
        var score = 'Stars: 0/6';
        this.scoreText = this.add.text(55, 30, score, this.game.style1);
        this.scoreText.fixedToCamera = true;
        var time = 'Time : 00:00:00';
        this.timeText = this.add.text(55, 60, time, this.game.style1);
        this.timeText.fixedToCamera = true;
    },

    setEmitters: function () {
        this.acidEmitter = this.add.emitter(0, 0, 10);
        this.acidEmitter.makeParticles('acid-drop');
        this.acidEmitter.gravity = 200;
        this.explosionEmitter = this.add.emitter(0, 0, 10);
        this.explosionEmitter.makeParticles('explosion-spark');
        this.explosionEmitter.gravity = 200;
    },

    setExit: function () {
        this.exitLocked = this.add.sprite(14 * 128 + 280 - 50, this.world.height - 4 * 128 - 128, 'locked-door');
        this.exitUnlocked = this.add.sprite(14 * 128 + 280 - 50, this.world.height - 4 * 128 - 128, 'unlocked-door');
        this.physics.arcade.enable(this.exitUnlocked);
        this.exitUnlocked.body.setSize(2, 60, 31, 28);
        this.exitUnlocked.visible = false;
    },

    setHighscoreSign: function () {
        this.highscoreSign = this.add.sprite(this.game.width/2, this.game.height/2 + 100, 'highscore');
        this.highscoreSign.fixedToCamera = true;
        this.highscoreSign.anchor.x = 0.5;
        this.highscoreSign.visible = false;
    },

    setSounds: function () {
        this.clickSound = this.add.audio('click-sound');
        this.splashSound = this.add.audio('splash-sound');
        this.explosionSound = this.add.audio('explosion-sound');
        this.completedSound = this.add.audio('completed-sound');
        this.highscoreSound = this.add.audio('highscore-sound');
        this.highscoreSound.volume = 0.3;
        this.levelMusic = this.add.audio('level-sound-2');
        this.levelMusic.loop = true;
        this.levelMusic.volume = 0.4;
    },

    setButtonVisibility: function (back, restart, yes, no, sign) {
        this.buttonBack.visible = back;
        this.buttonRestart.visible = restart
        this.buttonYes.visible = yes;
        this.buttonNo.visible = no;
        this.areYouSure.sign.visible = sign;
        this.areYouSure.text.visible = sign;
    },

    decorateLevel: function () {
        var sky = this.add.sprite(0, 0, 'graveyard');
        sky.scale.setTo(1.28, 1.05);
        this.add.sprite(150, this.world.height - 536, 'bush-2');
        this.add.sprite(100, this.world.height - 183, 'tombstone');
        this.add.sprite(150, this.world.height - 517, 'tombstone');
        this.add.sprite(150, this.world.height - 215, 'arrow-7');
        this.add.sprite(1800, this.world.height - 946, 'skeleton');
        this.add.sprite(600, this.world.height - 367, 'tree-2');
        this.add.sprite(1500, this.world.height - 1134, 'tree-2');
        this.add.sprite(1700, this.world.height - 218, 'bush-1');
        this.add.sprite(1300, this.world.height - 552, 'bush-1');
        this.add.sprite(2180, this.world.height - 202, 'bush-2');
        this.add.sprite(1760, this.world.height - 202, 'bush-2');
        this.add.sprite(500, this.world.height - 1098, 'bush-2');
    },

    turnMusicOnOff: function () {
        this.sound.mute = !this.sound.mute;
        this.buttonAudioOn.visible = !this.buttonAudioOn.visible;
        this.buttonAudioOff.visible = !this.buttonAudioOff.visible;
    },

    backToMainMenu: function () {
        this.setButtonVisibility(false, false, true, true, true);
    },

    stayOnLevel: function () {
        this.setButtonVisibility(true, !this.player.alive, false, false, false);
    },

    backToLevels: function () {
        this.state.start('Levels');
    },

    quitGame: function () {
        this.levelMusic.stop();
        this.state.start('MainMenu');
    },

    restartGame: function () {
        this.levelMusic.stop();
        this.state.start(this.game.state.current);
    },

    levelWon: function () {
        this.levelMusic.stop();
        var hms = this.timeElapsed;
        var str = hms.split(':');
        var seconds = (+str[0] * 60 * 60 + (+str[1]) * 60 + (+str[2]));
        var highscore = localStorage.getItem('level_2');
        if (highscore == 0 || seconds < highscore) {
            localStorage.setItem('level_2', seconds);
            this.highscoreSign.visible = true;
            this.highscoreSound.play();
        } else {
            this.completedSound.play();
        }
        this.player.kill();
        this.gameOver = true;
        this.buttonContinue.visible = true;
        this.scoreText.setText('Level passed');
        this.setButtonVisibility(false, false, false, false, false);
    }

};
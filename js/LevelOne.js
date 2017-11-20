StarRush.LevelOne = function (game) {

    this.ground = null;
    this.river = null;
    this.stars = null;
    this.player = null;
    this.obstacle = null;
    this.enemies = null;
    this.crates = null;
    this.cursors = null;
    this.waterEmitter = null;
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

StarRush.LevelOne.prototype = {

    create: function () {

        this.world.setBounds(0, 0, 2560, 1320);
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.decorateLevel();
        this.setSounds();
        this.setExit();
        this.setRiverTiles();
        this.setGroundTiles();
        this.setStars();
        this.setObstacles();
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

        this.obstacle.body.velocity.y = (this.obstacle.direction == 'up') ? -100 : 100;
        this.obstacle.direction = (this.obstacle.y > 1170) ? 'up' : (this.obstacle.y < 1050) ? 'down' : this.obstacle.direction;

        // Move enemies in their areas
        var areas = [
            '980:832',
            '1620:1433',
            '2516:2317',
            '1440:1242',
            '212:12',
            '1730:790',
            '1730:790',
            '1190:1060',
            '980:830',
            '750:600',
            '280:120'
        ];

        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies.getByName('enemy-' + i);
            var velocity = (i == 5 || i == 6) ? 250 : 150;
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
        var hitObstacle = this.physics.arcade.collide(this.player, this.obstacle);
        var hitCrate = this.physics.arcade.collide(this.player, this.crates);

        //  Allow the player to jump if he is on top of the ground, obstacle or crate
        if ((this.cursors.up.isDown || this.jump == true) && this.player.body.touching.down && (hitGround || hitObstacle || hitCrate))
        {
            this.player.body.velocity.y = -350;
        }

        this.physics.arcade.collide(this.stars, this.ground);
        this.physics.arcade.overlap(this.player, this.river, this.killedByWater, null, this);
        this.physics.arcade.overlap(this.player, this.enemies, this.killedByEnemy, null, this);
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
        var emitter = type == 'water' ? this.waterEmitter : this.explosionEmitter;
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

    killedByWater: function (player, river) {
        var sound = this.splashSound;
        var particleType = 'water';
        this.killPlayer(player, particleType, sound);
    },

    killedByEnemy: function (player, enemy) {
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

    setRiverTiles: function () {
        this.river = this.add.group();
        this.river.enableBody = true;
        var positions = [2, 3, 4, 5, 12, 13, 14, 15];

        for(var i = 2; i <= 15; i++) {
            if (positions.indexOf(i) >= 0) {
                var riverTile = this.river.create(i * 128, this.world.height - 99, 'water');
                riverTile.body.immovable = true;
                riverTile.body.setSize(128, 65, 0, 34);
            }
        }
    },

    setGroundTiles: function () {
        this.ground = this.add.group();
        this.ground.enableBody = true;

        var height1 = this.world.height - 128;
        var height2 = this.world.height - 256;
        var height3 = this.world.height - 600;
        var height4 = this.world.height - 672;
        var height5 = this.world.height - 544;
        var height6 = this.world.height - 930;

        // Ground first level of tiles
        this.ground.create(0, height1, 'ground');
        this.ground.create(128, height1, 'ground');
        this.ground.create(768, height1, 'ground');
        this.ground.create(1408, height1, 'ground');
        this.ground.create(2048, height1, 'ground');
        this.ground.create(256, height1, 'ground-2');
        this.ground.create(1536, height1, 'ground-2');
        this.ground.create(640, height1, 'ground-1');
        this.ground.create(1920, height1, 'ground-1');
        this.ground.create(1024, height1, 'ground-3');
        this.ground.create(2304, height1, 'ground-3');
        this.ground.create(1152, height1, 'ground-4');
        this.ground.create(1280, height1, 'ground-5');
        this.ground.create(896, height1, 'ground-6');
        this.ground.create(2176, height1, 'ground-6');
        this.ground.create(2432, height1, 'ground-7');

        // Ground second level of tiles
        this.ground.create(2432, height2, 'ground');
        this.ground.create(1024, height2, 'ground-1');
        this.ground.create(2304, height2, 'ground-1');
        this.ground.create(1152, height2, 'ground-2');

        // Platforms
        this.ground.create(1984, this.world.height - 340, 'ground-8');
        this.ground.create(1664, this.world.height - 380, 'ground-8');
        this.ground.create(1229, height3, 'ground-1');
        this.ground.create(1357, height3, 'ground-2');
        this.ground.create(1229, this.world.height - 472, 'ground-9');
        this.ground.create(1357, this.world.height - 472, 'ground-10');
        this.ground.create(1536, this.world.height - 530, 'ground-12');
        this.ground.create(896, height3, 'ground-12');
        this.ground.create(640, height3, 'ground-12');
        this.ground.create(0, this.world.height - 800, 'ground');
        this.ground.create(128, this.world.height - 800, 'ground-2');
        this.ground.create(0, height4, 'ground-7');
        this.ground.create(128, height4, 'ground-4');
        this.ground.create(256, height4, 'ground-5');
        this.ground.create(3 * 128, height4, 'ground-2');
        this.ground.create(0, height5, 'ground-11');
        this.ground.create(128, height5, 'ground-11');
        this.ground.create(256, height5, 'ground-11');
        this.ground.create(384, height5, 'ground-10');
        this.ground.create(384, this.world.height - 880, 'ground-8');
        this.ground.create(640, this.world.height - 970, 'ground-12');
        this.ground.create(768, this.world.height - 1058, 'ground-1');
        this.ground.create(768, height6, 'ground-9');

        for (var i = 7; i < 13; i++) {
            this.ground.create(i * 128, this.world.height - 1058, 'ground');
            this.ground.create(i * 128, height6, 'ground-11');
        }

        this.ground.create(1664, this.world.height - 1058, 'ground-2');
        this.ground.create(1664, height6, 'ground-10');
        this.ground.create(2048, height6, 'ground-1');
        this.ground.create(2048, this.world.height - 802, 'ground-9');

        for (var i = 17; i < 20; i++) {
            this.ground.create(i * 128, height6, 'ground');
            this.ground.create(i * 128, this.world.height - 802, 'ground-11');
        }

        this.ground.forEach(function (item) {
            item.body.immovable = true;
        }, this);
    },

    setStars: function () {
        this.stars = this.add.group();
        this.stars.enableBody = true;

        this.stars.create(896, this.world.height - 150, 'star');
        this.stars.create(1472, this.world.height - 150, 'star');
        this.stars.create(2496, this.world.height - 278, 'star');
        this.stars.create(1344, this.world.height - 622, 'star');
        this.stars.create(64, this.world.height - 822, 'star');
        this.stars.create(1280, this.world.height - 1080, 'star');    
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

    setObstacles: function () {
        this.obstacle = this.add.sprite(512, this.world.height - 190, 'obstacle');
        this.obstacle.scale.setTo(0.5, 1);
        this.obstacle.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.obstacle);
        this.obstacle.body.immovable = true;
        this.obstacle.direction = 'up';
    },

    setCrates: function () {
        this.crates = this.add.group();
        this.crates.enableBody = true;

        var height1 = this.world.height - 205;

        this.crates.create(740, height1, 'crate');
        this.crates.create(1344, height1, 'crate');
        this.crates.create(2225, height1, 'crate');
        this.crates.create(1702, this.world.height - 457, 'crate');
        this.crates.create(270, this.world.height - 749, 'crate');

        this.crates.forEach(function (item) {
            item.body.immovable = true;
        }, this);
    },

    setEnemies: function () {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
    
        // Ground enemies
        this.enemies.create(832, this.world.height - 168, 'enemy-1');
        this.enemies.create(1434, this.world.height - 168, 'enemy-2');
        this.enemies.create(2317, this.world.height - 320, 'enemy-3');
        this.enemies.create(1242, this.world.height - 640, 'enemy-1');
        this.enemies.create(12, this.world.height - 840, 'enemy-2');
        this.enemies.create(790, this.world.height - 1122, 'enemy-3');
        this.enemies.create(1730, this.world.height - 1122, 'enemy-3');

        // Flying enemies
        this.enemies.create(1771, this.world.height - 260, 'enemy-4');
        this.enemies.create(1907, this.world.height - 340, 'enemy-5');
        this.enemies.create(803, this.world.height - 600, 'enemy-4');
        this.enemies.create(1899, this.world.height - 1058, 'enemy-5');

        var i = 0;
        this.enemies.forEach(function (item) {
            item.name = 'enemy-' + i;
            item.direction = i == 6 ? 'left' : i < 6 ? 'right' : 'down';
            if (i != 2 && i != 5 && i != 6 && i < 7) {
                item.body.setSize(32, 27, 0, 13);
            } else if (i < 7) {
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
        this.waterEmitter = this.add.emitter(0, 0, 10);
        this.waterEmitter.makeParticles('water-drop');
        this.waterEmitter.gravity = 200;
        this.explosionEmitter = this.add.emitter(0, 0, 10);
        this.explosionEmitter.makeParticles('explosion-spark');
        this.explosionEmitter.gravity = 200;
    },

    setExit: function () {
        this.exitLocked = this.add.sprite(this.world.width - 150, this.world.height - 1018, 'locked-door');
        this.exitUnlocked = this.add.sprite(this.world.width - 150, this.world.height - 1018, 'unlocked-door');
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
        this.levelMusic = this.add.audio('level-sound');
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
        var sky = this.add.sprite(0, 0, 'sky');
        sky.scale.setTo(3.2, 2.2);
        this.add.sprite(this.world.width - 400, this.world.height - 994, 'arrow');
        this.add.sprite(128, this.world.height - 338, 'tree');
        this.add.sprite(1408, this.world.height - 338, 'tree');
        this.add.sprite(2048, this.world.height - 550, 'tree');
        this.add.sprite(1024, this.world.height - 466, 'tree');
        this.add.sprite(64, this.world.height - 1010, 'tree');
        this.add.sprite(1280, this.world.height - 1268, 'tree');
        this.add.sprite(this.world.width - 150, this.world.height - 1140, 'tree');
        this.add.sprite(100, this.world.height - 193, 'bush');
        this.add.sprite(2368, this.world.height - 321, 'bush');
        this.add.sprite(1280, this.world.height - 665, 'bush');
        this.add.sprite(678, this.world.height - 169, 'mushroom');
        this.add.sprite(1318, this.world.height - 1099, 'mushroom');
        this.add.sprite(1126, this.world.height - 310, 'stone');
        this.add.sprite(2048, this.world.height - 172, 'tree-1');
        this.add.sprite(1152, this.world.height - 1102, 'tree-1');
        this.add.sprite(1536, this.world.height - 1102, 'tree-1');
        this.add.sprite(294, this.world.height - 183, 'arrow-2');
        this.add.sprite(1549, this.world.height - 183, 'arrow-2');
        this.add.sprite(2317, this.world.height - 311, 'arrow-6');
        this.add.sprite(1229, this.world.height - 655, 'arrow-5');
        this.add.sprite(192, this.world.height - 855, 'arrow-3');
        this.add.sprite(1728, this.world.height - 1113, 'arrow-4');
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
        var highscore = localStorage.getItem('level_1');
        if (highscore == 0 || seconds < highscore) {
            localStorage.setItem('level_1', seconds);
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

        // Unlock level 2 if it is not unlocked yet
        if (localStorage.getItem('level_2') == null) {
            localStorage.setItem('level_2', 0);
        }
    }

};
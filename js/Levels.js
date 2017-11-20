StarRush.Levels = function (game) {

};

StarRush.Levels.prototype = {

    create: function () {

        if (!this.game.backgroundSound.isPlaying) {
            this.game.backgroundSound.play();
        }

        var clickSound = this.add.audio('click-sound');
        this.add.sprite(0, 0, 'levels-background');
        this.add.sprite(170, 50, 'lean');
        this.add.sprite(40, 47, 'sign');

        var buttonBack = this.add.button(this.game.width - 131, 67, 'button-back', this.backToMainMenu, this, 1, 0, 2, 0);
        buttonBack.anchor.setTo(0.5, 0.5);
        buttonBack.onDownSound = clickSound;

        var selectLevel = 'Select\n level';
        this.instructions = this.add.text(60, 58, selectLevel, this.game.style1);

        // Set level buttons and scores

        var lock = null;
        var score = null;
        var scoreText = null;

        // Init level_1 data when the game runs for the first time
        var level_1 = localStorage.getItem('level_1');
        if (level_1 == null) {
            localStorage.setItem('level_1', 0);
        }

        var levels = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

        for (var i = 0, j = 0; i < levels.length; i++, j++) {
            var levelNumber = i + 1;
            if (i == 4 || i == 8) {
                j = 0;
            }
            var k = (i < 4) ? 0 : (i >= 4 && i < 8) ? 1 : 2;
            var levelScore = localStorage.getItem('level_' + levelNumber);
            if (levelScore != null) {
                this.add.button(60 + (j * 204), 190 + (k * 128), 'button-level-' + levels[i], this.startLevel, { game: this.game, state: this.state, levelIndex: levelNumber - 1 }, 1, 0, 2, 0);
                scoreText = this.getScore(levelScore);
                score = this.add.text(93 + (j * 204), 268 + (k * 128), scoreText, this.game.style1);
                score.anchor.x = 0.5;
            } else {
                this.add.sprite(60 + (j * 204), 190 + (k * 128), 'level-' + levels[i] + '-locked');
                lock = this.add.sprite(93 + (j * 204), 268 + (k * 128), 'lock');
                lock.anchor.x = 0.5;
            }
        }
    },

    startLevel: function () {
        this.game.backgroundSound.stop();
        var levels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
        this.state.start('Level' + levels[this.levelIndex]);
    },

    backToMainMenu: function () {
        this.state.start('MainMenu');
    },

    getScore: function (levelScore) {
        var date = new Date(null);
        date.setSeconds(levelScore);
        return levelScore == 0 ? 'Best: N/A' : 'Best: ' + date.toISOString().substr(11, 8);
    }

};
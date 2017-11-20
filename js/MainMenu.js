StarRush.MainMenu = function (game) {

	this.buttonPlay = null;
	this.buttonHowToPlay = null;
	this.buttonAudioOn = null;
	this.buttonAudioOff = null;
};

StarRush.MainMenu.prototype = {

	create: function () {

		if (typeof this.game.backgroundSound == 'undefined') {
			this.game.backgroundSound = this.add.audio('background-sound');
			this.game.backgroundSound.loop = true;
		}

		if (!this.game.backgroundSound.isPlaying) {
			this.game.backgroundSound.play();
		}

		var clickSound = this.add.audio('click-sound');
		this.add.sprite(0, 0, 'background');
		this.add.sprite(170, this.game.height - 227, 'run');
		this.add.sprite(615, this.game.height - 263, 'talk');
		this.add.sprite(660, this.game.height - 260, 'star');
		this.add.sprite(this.game.width/2 + 50, 116, 'character');

		this.buttonPlay = this.add.button(this.game.width/2, 200, 'button-play', this.selectLevel, this, 1, 0, 2, 0);
		this.buttonHowToPlay = this.add.button(this.game.width/2, 280, 'button-how-to-play', this.howToPlay, this, 1, 0, 2, 0);
		this.buttonAudioOn = this.add.button(this.game.width - 70, 67, 'audio-on', this.turnMusicOnOff, this, 1, 0);
		this.buttonAudioOff = this.add.button(this.game.width - 70, 67, 'audio-off', this.turnMusicOnOff, this, 1, 0);
	
		var buttons = [this.buttonPlay, this.buttonHowToPlay, this.buttonAudioOn, this.buttonAudioOff];

		for (var i = 0; i < buttons.length; i++) {
			buttons[i].anchor.setTo(0.5, 0.5);
			buttons[i].onDownSound = clickSound;
		}

		this.buttonAudioOn.visible = this.sound.mute == false ? true : false;
		this.buttonAudioOff.visible = !this.buttonAudioOn.visible;
	},

	selectLevel: function () {
        this.state.start('Levels');
    },

    howToPlay: function () {
    	this.state.start('HowToPlay');
    },

    turnMusicOnOff: function () {
		this.sound.mute = !this.sound.mute;
		this.buttonAudioOn.visible = !this.buttonAudioOn.visible;
		this.buttonAudioOff.visible = !this.buttonAudioOff.visible;
	}

};
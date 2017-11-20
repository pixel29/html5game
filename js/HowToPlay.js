StarRush.HowToPlay = function (game) {

};

StarRush.HowToPlay.prototype = {

	create: function () {

		var clickSound = this.add.audio('click-sound');
		this.add.sprite(0, 0, 'background');

	 	var buttonBack = this.add.button(this.game.width - 131, 67, 'button-back', this.backToMainMenu, this, 1, 0, 2, 0);
	 	var textBoxBackground = this.add.sprite(this.game.width/2, this.game.height/2 + 100, 'text-box');
	 	var howToText = 'The goal of each level is to collect all stars\n and then reach the exit as '
		+ 'fast as possible.\n You have only one life. Controls:\n← Move left\n→ Move right\n ↑  Jump';
	 	var instructions = this.add.text(this.game.width/2, this.game.height/2 + 100, howToText, this.game.style2);

	 	var items = [buttonBack, textBoxBackground, instructions];

	 	for (var i = 0; i < items.length; i++) {
	 		items[i].anchor.setTo(0.5, 0.5);

	 		if (i == 0) {
	 			items[i].onDownSound = clickSound;
	 		}
	 	}

		this.add.sprite(120, 80, 'learn');
	},

	backToMainMenu: function () {
		this.state.start('MainMenu');
	}

};
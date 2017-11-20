var StarRush = {};

StarRush.Boot = function (game) {

};

StarRush.Boot.prototype = {

    init: function () {
        
        if (this.game.device.desktop)
        {
            // Scaling type that maintains proportions
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(400, 300, 800, 600);
        }
        else
        {
            // Scaling type that stretches picture to full screen
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        }

        this.scale.pageAlignVertically = true;
        this.scale.pageAlignHorizontally = true;
    },

    preload: function () {
        this.load.image('preloader-bar', 'assets/images/objects/loading-bar.png');
        this.load.image('screen-loading', 'assets/images/objects/screen-loading.png');
    },

    create: function () {
        // Start Preloader state
        this.state.start('Preloader');
    }

};
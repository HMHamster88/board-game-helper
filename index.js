class Player {
    constructor(name, color) {
        this.id = "id" + Math.random().toString(16).slice(2)
        this.name = name;
        this.color = color;
        this.score = 0;
    }
}

var app = new Vue({
    el: '#app',
    data: {
        game: {
                players: [
                    new Player("Red Player", "#ff0000"),
                    new Player("Green Player", "#2dff00"),
                    new Player("Blue Player", "#0038ff")
                ]
            }
    },
    mounted() {
        this.$nextTick(function () {
            let savedGame = JSON.parse(localStorage.getItem('game'));
            if (savedGame) {
                this.game = savedGame;
            }
        })
    },
    methods: {
        resetScore: function () {
            this.game.players.forEach(player => player.score = 0);
        },
        saveGame: function () {
            localStorage.setItem('game', JSON.stringify(this.game, null, 2));
        },
        addPlayer: function () {
            this.game.players.push(new Player("Player", "#" + Math.floor(Math.random()*16777215).toString(16)));
        },
        removePlayer: function (player) {
            this.game.players = this.game.players.filter(item => item !== player);
        }
    },
    watch: {
        game: {
            deep: true,
            handler: function (val, oldVal) {
                this.saveGame();
            }
        }
    }
})
class Player {
    constructor(name, color) {
        this.id = "id" + Math.random().toString(16).slice(2)
        this.name = name;
        this.color = color;
        this.score = 0;
    }
}

function createEnum(values) {
  const enumObject = {};
  for (const val of values) {
    enumObject[val] = val;
  }
  return Object.freeze(enumObject);
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const KeyboardState = createEnum(["EnterFrom", "EnterTo", "EnterValue"]);

var app = new Vue({
    el: '#app',
    data: {
        game: {
                playerIdFrom: null,
                playerIdTo: null,
                players: [
                    new Player("Red Player", "#ff0000"),
                    new Player("Green Player", "#2dff00"),
                    new Player("Blue Player", "#0038ff")
                ],
                scoreMoveValue: 1,
                withoutFromPlayer: false
        },
        keyboardState: KeyboardState.EnterFrom,
        settings: {
            keyboardMode: true,
            clearScoreValue: true
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.loadGame();
            this.loadSettings();
        })
    },
    created() {
          window.addEventListener('keyup', this.keyHandler);
        },
        beforeDestroy() {
          window.removeEventListener('keyup', this.keyHandler);
    },
    computed: {
        playerFrom: function () {
            if (this.game.withoutFromPlayer) {
                return null;
            }
            return this.getPlayerById(this.game.playerIdFrom);
        },
        playerTo: function () {
            return this.getPlayerById(this.game.playerIdTo);
        },
    },
    methods: {
        moveScore: function() {
            if (this.playerTo) {
                this.playerTo.score += this.game.scoreMoveValue;
            }
            if (this.playerFrom) {
                this.playerFrom.score -= this.game.scoreMoveValue;
            }
        },
        getPlayerById: function (searchId) {
            if (!searchId) {
                return null;
            }
            return this.game.players.find(player => player.id == searchId);
        },
        keyHandler: function (e) {
            if (this.settings.keyboardMode) {
                console.log('KEYPRESS EVENT', e);
                var key = e.key;
                switch(this.keyboardState) {
                    case KeyboardState.EnterFrom:
                        if (isNumeric(key)) {
                            var player = this.game.players[parseInt(key) - 1];
                            if (player) {
                                this.game.playerIdFrom = player.id;
                                this.keyboardState = KeyboardState.EnterTo;
                            }
                        }
                        break;
                    case KeyboardState.EnterTo:
                        if (isNumeric(key)) {
                            var player = this.game.players[parseInt(key) - 1];
                            if (player) {
                                this.game.playerIdTo = player.id;
                                if (this.settings.clearScoreValue) {
                                    this.game.scoreMoveValue = 0;
                                }
                                this.keyboardState = KeyboardState.EnterValue;
                            }
                        }
                        break;
                    case KeyboardState.EnterValue:
                       if (isNumeric(key)) {
                            var newNumber = Number(this.game.scoreMoveValue + key);
                             if (newNumber) {
                                this.game.scoreMoveValue = newNumber;
                             }

                       } else if (key == 'Backspace') {
                            var newNumber = Number(this.game.scoreMoveValue.toString().slice(0, -1));
                             if (newNumber) {
                                this.game.scoreMoveValue = newNumber;
                             } else {
                                this.game.scoreMoveValue = 0;
                             }
                       } else if (key == '-') {
                            this.game.scoreMoveValue = -this.game.scoreMoveValue;
                       } else if (key == 'Enter') {
                            this.moveScore();
                            this.keyboardState = this.game.withoutFromPlayer ? KeyboardState.EnterTo : KeyboardState.EnterFrom;
                       }
                       break;
                }
            }
        },
        resetScore: function () {
            this.game.players.forEach(player => player.score = 0);
        },
        saveGame: function () {
            localStorage.setItem('game', JSON.stringify(this.game, null, 2));
        },
        loadGame: function () {
            let savedGame = JSON.parse(localStorage.getItem('game'));
            if (savedGame) {
                this.game = savedGame;
            }
        },
        addPlayer: function () {
            this.game.players.push(new Player("Player", "#" + Math.floor(Math.random()*16777215).toString(16)));
        },
        removePlayer: function (player) {
            this.game.players = this.game.players.filter(item => item !== player);
        },
        saveSettings: function () {
            localStorage.setItem('settings', JSON.stringify(this.settings, null, 2));
        },
        loadSettings: function () {
            let savedSettings = JSON.parse(localStorage.getItem('settings'));
            if (savedSettings) {
                this.settings = savedSettings;
            }
        },
    },
    watch: {
        game: {
            deep: true,
            handler: function (val, oldVal) {
                this.saveGame();
            }
        },
        settings: {
            deep: true,
            handler: function (val, oldVal) {
                this.saveSettings();
            }
        }
    }
})
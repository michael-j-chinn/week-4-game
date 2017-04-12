$(document).ready(function() {
	function Person() {
		this.selected = false;
		this.select = function () {
			this.selected = true;
		}
		this.deselect = function() {
			this.selected = false;
		}
		this.html = {};
	}

	function Player(name, img, position, yardsPerPlay, bigPlayModifier) {
		this.name = name;
		this.img = img;
		this.position = img;
		this.yardsPerPlay = yardsPerPlay;
		this.bigPlayModifier = bigPlayModifier;
	}

	function Opponent(name, img, turnoverModifier, defenseModifier) {
		this.name = name;
		this.img = img;
		this.turnoverModifier = turnoverModifier;
		this.defeated = false;
		this.defenseModifier = defenseModifier;
	}

	Player.prototype = new Person();
	Opponent.prototype = new Person();

	function Play() {
		this.yardsGained = 0;
		this.bigPlay = false;
		this.turnover = false;
		this.touchdown = false;
	}

	var game = {
		gameBoardId: 'game-board',
		gameBoard: {},
		seriesBoardId: 'series',
		seriesBoard: {},
		series: {
			yardsRemaining: 100,
			downsRemaining: 10,
			prevPlays: []
		},
		opponents: [
			new Opponent('Falcons', 'falcons_logo.png', 7, 1),
			new Opponent('Saints', 'saints_logo.png', 5, .5),
			new Opponent('Panthers', 'panthers_logo.png', 10, 2)
		],
		players: [
			new Player('Jameis Winston', 'winston_headshot.png', 'Quarterback', 25, 4),
			new Player('Mike Evans', 'evans_headshot.png', 'Wide Receiver', 25, 3),
			new Player('Doug Martin', 'martin_headshot.png', 'Running Back', 15, 2),
			new Player('Roberto Aguayo', 'aguayo_headshot.png', 'Kicker', 5, 1)
		],
		player: {},
		currentOpponent: {},
		start: function () {
			this.gameBoard = $('#' + this.gameBoardId);
			this.addStartGameButton();
		},
		end : function() {
			// Show game result

			// Change button to either next opponent, celebrate, or play again.
		},
		reset: function () {
			this.gameBoard.empty();
		},
		addStartGameButton: function() {
			var startButton = $('<button class="btn btn-warning btn-lg font-massive full-center">').text('Start Game!');

			startButton.on('click', game.addGamePieces);

			game.gameBoard.append(startButton);
		},
		removeStartGameButton: function() {
			game.reset();
		},
		addGamePieces: function() {
			game.removeStartGameButton();
			game.addPlayerChoices();
		},
		addPlayerChoices: function () {
			var playerCntr = $('<div id="players">').addClass('game-content');

			var instructionRow = game.createBootstrapRow([{class:"col-lg-12"}]);
			var playerHeadshotRow = game.createBootstrapRow([{class:"col-sm-3"},{class:"col-sm-3"},{class:"col-sm-3"},{class:"col-sm-3"}]);

			// Add in the instructions about select opponents
			var instructionsCntr = $('<div id="playerSelectInstructions" class="jumbotron">').append($('<h1>').text('Player Selection'));
			instructionsCntr.append($('<p>').text('Each player has different yards per play and big play chances. Choose wisely!'));
			instructionRow.columns[0].append(instructionsCntr);

			// Player chooses a football player. Either runner, passer, kicker, receiver
			game.players.forEach(function(playerObj, index) {
				var btn = $('<a>').attr('data-index', index);
				var cntr = $('<div class="thumbnail">');
				var caption = $('<div class="caption text-center">');
				var img = $('<img class="img-thumbnail">').attr('src', './assets/images/' + playerObj.img).addClass('logo');

				caption.html('<h3>' + playerObj.name + '</h3>');
				btn.append(cntr.append(img, caption));

				btn.on('click', function () {
					game.selectPlayer($(this).attr('data-index'));
					game.addOpponentChoices(); 
				});

				playerHeadshotRow.columns[index].append(btn);

				// Add this to the player object for use later on.
				playerObj.html = cntr;
			});

			game.gameBoard.append(playerCntr.append(instructionRow.row, playerHeadshotRow.row));
		},
		selectPlayer: function (selectedID) {
			var player = game.players[selectedID];
			player.select();
			game.player = player;
		},
		selectOpponent: function (selectedID) {
			var opponent = game.opponents[selectedID];
			opponent.select();
			game.currentOpponent = opponent;
		},
		getSelectedOpponent: function () {
			var selectedOpponent;

			game.opponents.forEach(function(opponentObj, index) {
				if (opponentObj.selected) {
					selectedOpponent = $('#opponents > a[data-index="' + index + '"]');
				}
			});

			return selectedOpponent;
		},
		removeSelectedOpponent: function() {
			$('#opponents > p').remove();

			game.opponents.forEach(function(opponentObj, index) {
				if (opponentObj.selected) {
					$('#opponents > a[data-index="' + index + '"]').remove();
				}
			});
		},
		addOpponentChoices: function () {
			var opponentCntr = $('<div id="opponents">').addClass('game-content');

			var instructionRow = game.createBootstrapRow([{class:"col-sm-12"}]);
			var vsRow = game.createBootstrapRow([{class:"col-sm-4"},{class:"col-sm-4"},{class:"col-sm-4"}]);
			var opponentsRow = game.createBootstrapRow([{class:"col-sm-4"},{class:"col-sm-4"},{class:"col-sm-4"}]);

			// Add instructions on how to choose an opponent
			var instructionsCntr = $('<div id="opponentSelectInstructions" class="jumbotron">').append($('<h1>').text('Opponent Selection'));
			instructionsCntr.append($('<p>').text('Each opponent has different defensive toughness and turnover chance. Choose wisely!'));
			instructionRow.columns[0].append(instructionsCntr);

			// Add in each opponent so player can choose who to play
			game.opponents.forEach(function(opponentObj, index) {
				var btn = $('<a>').attr('data-index', index);
				var cntr = $('<div class="thumbnail">');
				var caption = $('<div class="caption text-center">');
				var img = $('<img class="img-thumbnail">').attr('src', './assets/images/' + opponentObj.img).addClass('logo');

				caption.html('<h3>' + opponentObj.name + '</h3>');
				btn.append(cntr.append(img, caption));

				btn.on('click', function () {
					game.selectOpponent($(this).attr('data-index'));
					game.initializeSeries();
				});

				opponentsRow.columns[index].append(btn);

				// Add this to the opponent object for use later on.
				opponentObj.html = cntr;
			});

			game.reset();
			game.gameBoard.append(opponentCntr.append(instructionRow.row, opponentsRow.row));
		},
		initializeSeries: function () {
			var seriesCntr = $('<div id="series">').addClass('game-content');

			var vsRow = game.createBootstrapRow([{class:"col-sm-4"},{class:"col-sm-4"},{class:"col-sm-4"}]);
			var statsRow = game.createBootstrapRow([{class:"col-sm-4"},{class:"col-sm-4"},{class:"col-sm-4"}]);
			var prevPlaysRow = game.createBootstrapRow([{class:"col-sm-12"}]);

			// Add the player and selected opponent
			vsRow.columns[0].append(game.player.html);
			vsRow.columns[1].append($('<img>').attr('src', './assets/images/vs.png'));
			vsRow.columns[2].append(game.currentOpponent.html);

			// Add the player and selected opponent to column 1
			statsRow.columns[0].append($('<h3>').text('Yards Remaining'), $('<p id="yards-remaining">').text('100'));
			statsRow.columns[1].append(game.addHikeButton());
			statsRow.columns[2].append($('<h3>').text('Downs Remaining'), $('<p id="downs-remaining">').text('10'));

			// Add the previous plays tracker
			prevPlaysRow.columns[0].append(game.initializePreviousPlaysTracker());

			game.reset();
			game.gameBoard.append(seriesCntr.append(vsRow.row, statsRow.row, prevPlaysRow.row));
		},
		addHikeButton: function () {
			var hikeButtonContainer = $('<div class="text-center">');
			var hikeButton = $('<button class="btn btn-primary">').text('Hike!');

			hikeButton.on('click', function () {
				game.hike();
			});

			hikeButtonContainer.append(hikeButton);

			return hikeButtonContainer;
		},
		initializePreviousPlaysTracker: function () {
			return $('<div id="tracker">').append($('<div>').addClass('play'));
		},
		hike: function() {
			var play = new Play();
			var yardsGained = 0;
			var bigPlayYards = 0;
			var player = game.player;
			var opponent = game.currentOpponent;

			// No matter what a down is lost
			game.series.downsRemaining--;

			// Start with the base yardsPerPlay (ex. 6)
			yardsGained = player.yardsPerPlay;

			// Roll dice on whether or not a big play will happen (ex. 3% chance)
			if (game.getRandomNumber(100) <= player.bigPlayModifier) {
				play.bigPlay = true;
				// If a big play happens, double yardsPerPlay
				bigPlayYards = yardsGained * player.bigPlayModifier;
			}

			// Now see how many yards the opponent limits the player.
			// If the amount is negative, roll for a turnover. If no turnover, the player fails their down,
			// otherwise, game over.
			yardsGained = (yardsGained + bigPlayYards) - game.getRandomNumber(yardsGained * opponent.defenseModifier);

			if (yardsGained < 0) {
				yardsGained = 0;

				if (game.getRandomNumber(100) <= opponent.turnoverModifier || game.series.downsRemaining <= 0) {
					play.turnover = true;
				}
			} else {
				if (yardsGained <= game.series.yardsRemaining)
					game.series.yardsRemaining -= yardsGained;
				else {
					yardsGained = game.series.yardsRemaining;
					game.series.yardsRemaining = 0;
				}

				if (game.series.downsRemaining > 0) {
					play.turnover = false;

					if (game.series.yardsRemaining <= 0) {
						game.series.yardsRemaining = 0;
						play.touchdown = true;
					}
				} else {
					play.turnover = true; // turnover on downs
				}
			}

			play.yardsGained = yardsGained;

			game.series.prevPlays.unshift(play);

			// Update game board
			game.updateBallPositionTracker();
		},
		getRandomNumber: function(cieling) {
			return (Math.floor(Math.random() * cieling) + 1);
		},
		updateBallPositionTracker: function() {
			var trackerCntr = $('#tracker').empty();

			game.series.prevPlays.forEach(function(playObj) {
				var play = $('<div>').addClass('play text-center');
				var playDetails='';

				if (!playObj.turnover) {
					playDetails += "Yards gained: " + playObj.yardsGained;

					if (playObj.touchdown) {
						playDetails += ". You scored a touchdown. You win!";
					} 

					if (playObj.bigPlay) {
						playDetails += ". Big play alert!!!";
					}
				} else {
					playDetails += "Your opponent got a turnover. You lose.";
				}

				trackerCntr.append(play.html(playDetails));
			});

			$('#yards-remaining').text(game.series.yardsRemaining);
			$('#downs-remaining').text(game.series.downsRemaining);
		},
		createBootstrapRow: function(columns) {
			var rowInfo = {
				row: $('<div class="row">'),
				columns: []
			};

			columns.forEach(function(col, index) {
				var col = $('<div>').addClass(col.class);
				rowInfo.row.append(col);
				rowInfo.columns.push(col);
			});

			return rowInfo;
		}
	}



	// Player starts the game

	// Player chooses a football player. Either runner, passer, kicker, receiver

	// Player must then defeat the 3 other teams in NFC South (Atlanta Falcons, New Orleans Saints, Carolina Panthers)
	// Player chooses which one to play against first by clicking on their logo

	// Opponent logo is moved the opposing side of the field

	// Player can now click the "Hike!" button
	// TODO

	// Player continues to hit "Hike!" until they score a touchdown or turnover the ball

	// Each player has base yards per play, big play modifier, and downs remaining

	// Each opponent has % chance to get a turnover which is affected by the players
	// big play modifier. The higher the big play, the less chance for a turnover.

	// Player wins the division title by defeating all opposing teams

	game.start();
});
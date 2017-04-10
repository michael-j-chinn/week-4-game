$(document).ready(function() {
	function Person() {
		this.selected = false;
		this.select = function () {
			this.selected = true;
		}
		this.deselect = function() {
			this.selected = false;
		}
	}

	function Player(img, position, yardsPerPlay, bigPlayModifier) {
		this.img = img;
		this.position = img;
		this.yardsPerPlay = yardsPerPlay;
		this.bigPlayModifier = bigPlayModifier;
	}

	function Opponent(img, turnoverModifier, defenseModifier) {
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
			new Opponent('falcons_logo.png', 7, 1),
			new Opponent('saints_logo.png', 5, .5),
			new Opponent('panthers_logo.png', 10, 2)
		],
		players: [
			new Player('winston_headshot.png', 'Quarterback', 25, 4),
			new Player('evans_headshot.png', 'Wide Receiver', 25, 3),
			new Player('martin_headshot.png', 'Running Back', 15, 2),
			new Player('aguayo_headshot.png', 'Kicker', 5, 1)
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
			var startButtonContainer = $('<div class="text-center">');
			var startButton = $('<button class="btn btn-primary">').text('Start Game!');

			startButton.on('click', game.addGamePieces);
			startButtonContainer.append(startButton);

			game.gameBoard.append(startButtonContainer);
		},
		removeStartGameButton: function() {
			game.reset();
		},
		addGamePieces: function() {
			// Get rid of the start button
			game.removeStartGameButton();

			game.addPlayerChoices();
		},
		addPlayerChoices: function () {
			var playerCntr = $('<div id="players">');

			// Add in the instructions about select opponents
			playerCntr.append($('<p>').text('Select a player...'));

			// Player chooses a football player. Either runner, passer, kicker, receiver
			game.players.forEach(function(playerObj, index) {
				var btn = $('<a>').attr('data-index', index);
				var img = $('<img>').attr('src', './assets/images/' + playerObj.img).addClass('logo');
				btn.append(img);

				btn.on('click', function () {
					game.selectPlayer($(this).attr('data-index'));
					game.removeNonSelectedPlayers();
					game.addOpponentChoices(); 
				});

				playerCntr.append(btn);
			});

			game.gameBoard.append(playerCntr);
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
		removeNonSelectedPlayers: function() {
			$('#players > p').remove();

			game.players.forEach(function(playerObj, index) {
				if (!playerObj.selected) {
					$('#players > a[data-index="' + index + '"]').remove();
				}
			});
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
			var opponentCntr = $('<div id="opponents">');

			// Add in the instructions about select opponents
			opponentCntr.append($('<p>').text('Select an opponent...'));

			// Add in each opponent so player can choose who to play
			game.opponents.forEach(function(opponentObj, index) {
				var btn = $('<a>').attr('data-index', index);
				var img = $('<img>').attr('src', './assets/images/' + opponentObj.img).addClass('logo');
				btn.append(img);

				btn.on('click', function () {
					game.selectOpponent($(this).attr('data-index'));
					game.initializeSeries();
				});

				opponentCntr.append(btn);
			});

			game.gameBoard.append(opponentCntr);
		},
		initializeSeries: function () {
			// Create grid system for the series
			game.seriesBoard = $('<div id="series">');
			var seriesRow = $('<div class="row">');
			var seriesCol1 = $('<div class="col-lg-4">')
			var seriesCol2 = $('<div class="col-lg-4">')
			var seriesCol3 = $('<div class="col-lg-4">')

			// Get the current container for players and opponents
			var playersCntr = $('#players');
			var opponentsCntr = $('#opponents');

			// Pull the selected opponent out
			var selectedOpponent = game.getSelectedOpponent();
			var currentOpponentCntr = $('<div id="current-opponent">');
			currentOpponentCntr.append(selectedOpponent);

			// Add the player and selected opponent to column 1
			seriesCol1.append(playersCntr, currentOpponentCntr);

			// Add the "Hike!" button to column 2
			seriesCol2.append(game.addHikeButton());

			// Add the series tracker to column 3
			seriesCol3.append(game.addBallPositionTracker());

			// Add the columns back to their row
			seriesRow.append(seriesCol1, seriesCol2, seriesCol3);
			game.seriesBoard.append(seriesRow);

			// Add the remaing opponents back and the series container
			game.gameBoard.append(opponentsCntr, game.seriesBoard);

			game.removeSelectedOpponent();
		},
		moveSelectedOpponent: function () {
			//TODO
		},
		moveSelectedPlayer: function () {

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
		addBallPositionTracker: function () {
			var trackerCntr = $('<div id="tracker">');

			var html = "<table>" +
				"<tr><th>Yards Remaining</th><th>Downs Remaining</th></tr>" +
				"<tr><td>100</td><td>4</td></tr>" +
				"</table>";

			trackerCntr.html(html);

			return trackerCntr;
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
			var trackerCntr = $('#tracker');

			var playHistory = '';

			game.series.prevPlays.forEach(function(playObj) {
				if (!playObj.turnover) {
					if (playObj.touchdown) {
						playHistory += "You scored a touchdown. You win!<br>";
					} 

					playHistory += "Yards gained: " + playObj.yardsGained;

					if (playObj.bigPlay) {
						playHistory += ". Big play alert!!!";
					}
				} else {
					playHistory += "Your opponent got a turnover. You lose.";
				} 

				playHistory += "<br>";
			});

			var html = "<table>" +
				"<tr><th>Yards Remaining</th><th>Downs Remaining</th></tr>" +
				"<tr><td>" + game.series.yardsRemaining + "</td><td>" + game.series.downsRemaining + "</td></tr>" +
				"<tr><td colspan='2'>" + playHistory + "</td></tr>" +
				"</table>";

			trackerCntr.html(html);
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
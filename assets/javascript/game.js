$(document).ready(function() {

	var game = {
		gameBoardId: 'game-board',
		gameBoard: {},
		series: {},
		opponents: [
			new Opponent('Falcons', 'falcons_logo.png', 7, 1),
			new Opponent('Saints', 'saints_logo.png', 5, .5),
			new Opponent('Panthers', 'panthers_logo.png', 10, 1.25)
		],
		players: [
			new Player('Winston', 'winston_headshot.png', 'jameis_touchdown.gif', 'jameis_turnover.gif', 'Quarterback', 25, 6),
			new Player('Evans', 'evans_headshot.png', 'evans_touchdown.gif', 'evans_turnover.gif', 'Wide Receiver', 25, 5),
			new Player('Martin', 'martin_headshot.png', 'martin_toughdown.gif', 'martin_turnover.gif', 'Running Back', 17, 5),
			new Player('Aguayo', 'aguayo_headshot.png', 'aguayo_fieldgoal.gif', 'aguayo_missed_fg.gif', 'Kicker', 15, 3)
		],
		start: function () {
			// Grab a reference to the static game board container and make sure it's empty.
			game.gameBoard = $('#' + game.gameBoardId);
			game.gameBoard.empty();

			// Reset the references to selected player, selected opponent, as well as all player and opponent selected/defeated values.
			game.opponents.forEach(function(o) { o.reset(); });
			game.players.forEach(function(p) { p.reset(); });

			// Add the start button so player can initiate the game
			game.addStartGameButton();
		},
		end : function() {
			// The game is over but we want to give visual feed back rather than immediately restarting.
			game.gameBoard.empty();
			game.series.reset();

			// Add a Play Again button on top of black backdrop thats see through
			var screen = $('<div>').addClass('screen');

			var playAgainBtn = $('<button id="playAgain">').addClass('btn btn-warning btn-lg font-massive full-center').text('Play Again?');
			playAgainBtn.on('click', game.start);

			game.gameBoard.append(screen.append(playAgainBtn));

			// If we arrived here because the player won, show a winning images
			if (game.remainingOpponentsCount() == 0) {
				game.gameBoard.append($('<img>').addClass('img-responsive center-block').attr('src', './assets/images/win.jpg'));
			}

			timer.reset();
		},
		remainingOpponentsCount: function() {
			var count = 0;
			game.opponents.forEach(function(o){ if (!o.defeated) { count++; }});
			return count;
		},
		addStartGameButton: function() {
			var startButton = $('<button class="btn btn-warning btn-lg font-massive full-center">').text('Start Game!');

			startButton.on('click', game.addPlayerChoices);

			game.gameBoard.append(startButton);
		},
		addPlayerChoices: function () {
			game.gameBoard.empty();

			var playerCntr = $('<div id="players">').addClass('game-content');

			var instructionRow = bootHelper.createRow([{class:"col-lg-12"}]);
			var playerHeadshotRow = bootHelper.createRow([{class:"col-sm-3 col-xs-6"},{class:"col-sm-3 col-xs-6"},{class:"col-sm-3 col-xs-6"},{class:"col-sm-3 col-xs-6"}]);

			// Add in the instructions about select players
			var instructionsCntr = $('<div id="playerSelectInstructions" class="well well-sm">').append($('<h1>').text('Player Selection'));
			instructionsCntr.append($('<p>').text('Each player has different yards per play and big play chances. Choose wisely!'));
			instructionRow.columns[0].append(instructionsCntr);

			// Player chooses a football player. Either runner, passer, kicker, receiver
			game.players.forEach(function(playerObj, index) {
				var btn = $('<a>').attr('data-index', index);
				var cntr = $('<div class="thumbnail">');
				var caption = $('<div class="caption text-center">');
				var img = $('<img class="img-thumbnail">').attr('src', './assets/images/' + playerObj.img).addClass('logo');

				caption.html('<strong>' + playerObj.name + '</strong>');
				btn.append(cntr.append(img, caption));

				btn.on('click', function () {
					game.selectPlayer($(this).attr('data-index'));
					game.addOpponentChoices(); 
				});

				playerHeadshotRow.columns[index].append(btn);
			});

			game.gameBoard.empty();
			game.gameBoard.append(playerCntr.append(instructionRow.row, playerHeadshotRow.row));
		},
		addOpponentChoices: function () {
			var opponentCntr = $('<div id="opponents">').addClass('game-content');

			var instructionRow = bootHelper.createRow([{class:"col-lg-12"}]);
			var opponentsRow = bootHelper.createRow([{class:"col-xs-6 col-sm-4"},{class:"col-xs-6 col-sm-4"},{class:"col-xs-6 col-sm-4"}]);

			// Add instructions on how to choose an opponent
			var instructionsCntr = $('<div id="opponentSelectInstructions" class="well well-sm">').append($('<h1>').text('Opponent Selection'));
			instructionsCntr.append($('<p>').text('Each opponent has different defensive toughness and turnover chance. Choose wisely!'));
			instructionRow.columns[0].append(instructionsCntr);

			// Add in each opponent so player can choose who to play
			game.opponents.forEach(function(opponentObj, index) {
				if (!opponentObj.defeated) {
					var btn = $('<a>').attr('data-index', index);
					var cntr = $('<div class="thumbnail">');
					var caption = $('<div class="caption text-center">');
					var img = $('<img class="img-thumbnail">').attr('src', './assets/images/' + opponentObj.img).addClass('logo');

					caption.html('<strong>' + opponentObj.name + '</strong>');
					btn.append(cntr.append(img, caption));

					btn.on('click', function () {
						game.selectOpponent($(this).attr('data-index'));
						game.initializeSeries();
					});

					opponentsRow.columns[index].append(btn);
				}
			});

			game.gameBoard.empty();
			game.gameBoard.append(opponentCntr.append(instructionRow.row, opponentsRow.row));
		},
		selectPlayer: function (selectedID) {
			game.deselectAllPlayers();
			var player = game.players[selectedID];
			player.select();
		},
		selectOpponent: function (selectedID) {
			game.deselectAllOpponents();
			var opponent = game.opponents[selectedID];
			opponent.select();
		},
		deselectAllPlayers: function() {
			game.players.forEach(function(p) { p.deselect(); })
		},
		deselectAllOpponents: function() {
			game.opponents.forEach(function(o) { o.deselect(); })
		},
		getSelectedPlayer: function() {
			var player;

			for (var i = 0; i < game.players.length; i++) {
				if (game.players[i].selected) {
					player = game.players[i];
					break;
				}
			}

			return player;
		},
		getSelectedOpponent: function() {
			var opponent;

			for (var i = 0; i < game.opponents.length; i++) {
				if (game.opponents[i].selected) {
					opponent = game.opponents[i];
					break;
				}
			}

			return opponent;
		},
		initializeSeries: function () {
			game.series = new Series(game.getSelectedPlayer(), game.getSelectedOpponent(), game);
			game.gameBoard.empty();
			game.gameBoard.append(game.series.container);
		},
		nextOpponent: function() {
			timer.reset();

			if (game.remainingOpponentsCount() > 0) {
				game.series.reset();
				game.addOpponentChoices();
			}
			else {
				game.end();
			}
		},
		getRandomNumber: function(cieling) {
			return (Math.floor(Math.random() * cieling) + 1);
		}
	};

	game.start();
});
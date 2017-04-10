$(document).ready(function() {

	var game = {
		gameBoardId: 'game-board',
		gameBoard: {},
		opponents: [
			{ imgSrc: 'falcons_logo.png', selected: false, defeated: false }
			,{ imgSrc: 'saints_logo.png', selected: false, defeated: false }
			,{ imgSrc: 'panthers_logo.png', selected: false, defeated: false }
		],
		players: [
			{ imgSrc: 'winston_headshot.png', selected: false, position: 'Quarterback' }
			,{ imgSrc: 'evans_headshot.png', selected: false, position: 'Wide Receiver' }
			,{ imgSrc: 'martin_headshot.png', selected: false, position: 'Running Back' }
			,{ imgSrc: 'aguayo_headshot.png', selected: false, position: 'Kicker' }
		],
		start: function () {
			this.gameBoard = $('#' + this.gameBoardId);
			this.addStartGameButton();
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
				var img = $('<img>').attr('src', './assets/images/' + playerObj.imgSrc).addClass('logo');
				btn.append(img);

				btn.on('click', function () {
					game.toggleEntitySelection(game.players, $(this).attr('data-index'));
					game.removeNonSelectedPlayers();
					game.addOpponentChoices(); 
				});

				playerCntr.append(btn);
			});

			game.gameBoard.append(playerCntr);
		},
		toggleEntitySelection: function (entityArray, selectedID) {
			entityArray[selectedID].selected = !entityArray[selectedID].selected;
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
		removeSelectedOpponents: function() {
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
				var img = $('<img>').attr('src', './assets/images/' + opponentObj.imgSrc).addClass('logo');
				btn.append(img);

				btn.on('click', function () {
					var index = $(this).attr('data-index');

					game.toggleEntitySelection(game.opponents, index);
					game.initializeSeries();
				});

				opponentCntr.append(btn);
			});

			game.gameBoard.append(opponentCntr);
		},
		initializeSeries: function () {
			var seriesCntr = $('<div id="series">');
			var playersCntr = $('#players');
			var opponentsCntr = $('#opponents');
			var selectedOpponent = game.getSelectedOpponent();
			var currentOpponentCntr = $('<div id="current-opponent">');

			currentOpponentCntr.append(selectedOpponent);
			game.removeSelectedOpponents();
			seriesCntr.append(playersCntr, currentOpponentCntr);
			game.gameBoard.append(opponentsCntr, seriesCntr);


			game.moveSelectedOpponent();
			game.moveSelectedPlayer();
			game.addHikeButton();
			game.addBallPositionTracker();
		},
		moveSelectedOpponent: function () {
			//TODO
		},
		moveSelectedPlayer: function () {

		},
		addHikeButton: function () {

		},
		addBallPositionTracker: function () {

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

	// When the player scores a touchdown, the opposing team is TODO

	// Player wins the division title by defeating all opposing teams

	game.start();
});
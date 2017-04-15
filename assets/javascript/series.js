function Series(player, opponent, game) {
	this.game = game;
	this.player = player;
	this.opponent = opponent;
	this.yardsRemaining = 100;
	this.downsRemaining = 10;
	this.prevPlays = [];
	this.container = {};

	this.reset = function () {
		this.player = {};
		this.opponent = {};
		this.yardsRemaining = 100;
		this.downsRemaining = 10;
		this.prevPlays = [];
		this.container = {};
	}		
	this.playerLost = function() {
		return this.prevPlays[0].turnover;
	}
	this.playerWon = function() {
		return this.prevPlays[0].touchdown;
	}
	this.isOver = function() {
		return this.playerLost() || this.playerWon();
	}
	this.showTouchdownGif = function() {
		$('#tracker').prepend($('<div>').append($('<img>').attr('src', './assets/images/' + this.player.touchdownGif).addClass('img-responsive center-block')));

		var nextButton = $('<button id="next" class="btn btn-warning btn-action btn-responsive">').text('Next Opponent');
		nextButton.click(game.nextOpponent);

		$('#hike').parent().empty().append(nextButton);
	}
	this.showTurnoverGif = function() {
		$('#tracker').prepend($('<div>').append($('<img>').attr('src', './assets/images/' + this.player.turnoverGif).addClass('img-responsive center-block')));

		var endBtn = $('<button id="end" class="btn btn-warning btn-action btn-responsive">').text('End');
		endBtn.click(game.end);

		$('#hike').parent().empty().append(endBtn);
	}
	this.updatePlayHistory = function() {
		var trackerCntr = $('#tracker').empty();

		this.prevPlays.forEach(function(playObj) {
			trackerCntr.append(playObj.getDetailHtml());
		});

		$('#yards-remaining').text(this.yardsRemaining);
		$('#downs-remaining').text(this.downsRemaining);
	}
	this.hike = function() {
		var play = new Play();
		var bigPlayYards = 0;

		// No matter what, a down is lost
		this.downsRemaining--;

		// Start with the base yardsPerPlay (ex. 6)
		play.yardsGained = this.player.yardsPerPlay;

		// Roll dice on whether or not a big play will happen (ex. 3% chance)
		if (game.getRandomNumber(100) <= this.player.bigPlayModifier) {
			play.bigPlay = true;
			// If a big play happens, multiply yards gained times big play modifier
			bigPlayYards = play.yardsGained * this.player.bigPlayModifier;
		}

		// Now see how many yards the opponent limits the player.
		// If the amount is negative, roll for a turnover. If no turnover, the player fails their down,
		// otherwise, game over.
		play.yardsGained = (play.yardsGained + bigPlayYards) - game.getRandomNumber(play.yardsGained * this.opponent.defenseModifier);

		// If the defense caused a loss of yards or player has no more downs remaining
		if (play.yardsGained < 0 || this.downsRemaining <= 0) {
			// Reset to zero since that's just mean
			play.yardsGained = 0;

			// Roll dice to see if the defense causes a turnover, which will end the game. Also, if the 
			// that's also considered a turnover.
			if (this.downsRemaining <= 0 || game.getRandomNumber(100) <= this.opponent.turnoverModifier) {
				play.turnover = true;
			}
		} else {
			// Check if the player gained more yards than are remaining. If so, it's a touchdown and player wins.
			if (play.yardsGained < this.yardsRemaining) {
				this.yardsRemaining -= play.yardsGained;
			} else {
				play.touchdown = true;
				this.opponent.defeated = true;
				this.yardsRemaining = play.yardsGained = this.yardsRemaining;
			}
		}

		// Add play to the list so user can see it later
		this.prevPlays.unshift(play);

		// Update game board
		this.updatePlayHistory();

		// Check if the game is over and what to do about it
		if (this.isOver()) {
			timer.stop();

			if (this.playerWon()) {
				this.showTouchdownGif();
			} else if (this.playerLost()) {
				this.showTurnoverGif();
			}
		}
	},

	// Create the container for everything series related
	this.container = $('<div id="series">').addClass('game-content');

	var statsRow = bootHelper.createRow([{class:"col-xs-6 col-sm-4"},{class:"col-xs-6 col-sm-4 col-sm-push-4"},{class:"col-xs-12 col-sm-4 col-sm-pull-4"}]);
	var statsSubRow = bootHelper.createRow([{class:"col-xs-12"},{class:"col-xs-6 col-md-6"},{class:"col-xs-6 col-md-6"}]);
	var actionRow = bootHelper.createRow([{class:"col-xs-12"}]);
	var prevPlaysRow = bootHelper.createRow([{class:"col-xs-12"}]);

	// Add the player and selected opponent
	statsRow.columns[0].append($('<div>').addClass('text-center').append($('<h2>').text('Home'), $('<img>').addClass('thumbnail img-responsive center-block logo').attr('src', './assets/images/' + this.player.img), $('<h3>').text(this.player.name)));
	statsRow.columns[1].append($('<div>').addClass('text-center').append($('<h2>').text('Away'), $('<img>').addClass('thumbnail img-responsive center-block logo').attr('src', './assets/images/' + this.opponent.img), $('<h3>').text(this.opponent.name)));
	statsRow.columns[2].append(statsSubRow.row);

	statsSubRow.columns[0].append($('<div id="game-clock">').addClass('text-center').append($('<span>').text('05:00')));
	statsSubRow.columns[1].append($('<div>').addClass('text-center number-container').append($('<h3>').text('To Go'), $('<div id="yards-remaining">').text('100')));
	statsSubRow.columns[2].append($('<div>').addClass('text-center number-container').append($('<h3>').text('Downs'), $('<div id="downs-remaining">').text('10')));

	// Add hike button
	var hikeButton = $('<button id="hike" class="btn btn-warning btn-action btn-responsive">').text('Hike!');
	hikeButton.on('click', function () { game.series.hike(); });
	actionRow.columns[0].append(hikeButton);

	// Add the previous plays tracker
	prevPlaysRow.columns[0].append($('<div id="tracker">'));

	this.container.append(statsRow.row, actionRow.row, prevPlaysRow.row);

	timer.start();
}

function Play() {
	this.yardsGained = 0;
	this.bigPlay = false;
	this.turnover = false;
	this.touchdown = false;
	this.getDetailHtml = function() {
		var play = $('<div>').addClass('play text-center');
		var playDetails='';

		if (!this.turnover) {
			if (this.touchdown) {
				playDetails += "<h1>Touchdown!</h1>";
			} 

			playDetails += "Yards gained: " + this.yardsGained;

			if (this.bigPlay) {
				playDetails += ". Big play alert!!!";
			}
		} else {
			playDetails += "Your opponent got a turnover. You lose.";
		}

		play.html(playDetails);

		return play;
	}
}
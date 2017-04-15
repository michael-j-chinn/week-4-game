var timer = (function() {
	var timerIntervalId;
	return 	 {
		time: 300,
		start: function() {
			timerIntervalId = setInterval(timer.count, 1000);
		},
		stop: function() {
			clearInterval(timerIntervalId);
		},
		reset: function() {
			timer.stop();
			timer.time = 300;
			$('#game-clock > span').text('05:00');
		},
		count: function() {
			timer.time--;

			$('#game-clock > span').text(timer.formatTime(timer.time));

			if (timer.time === 0){
				timer.stop();
			}
		},
		formatTime: function(t) {
			var mins = Math.floor(t / 60);
			var secs = t - (mins * 60);

			if (secs < 10) {
		      secs = "0" + secs;
		    }

		    if (mins === 0) {
		      mins = "00";
		    }
		    else if (mins < 10) {
		      mins = "0" + mins;
		    }

		    return mins + ":" + secs;
		}
	};
})();
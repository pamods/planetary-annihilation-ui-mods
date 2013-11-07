window.reminderTimer = {
	init: function() {
	
		//Create div, add to page, knockout bind it
		this.element = $('<div id="in_game_timer" data-bind="text: currentTime">Sync</div>');
		$('body').append(this.div);
		ko.applyBindings(this, this.element[0]);

		//On click we try sync
		this.element.click($.proxy(this.syncFunction, this));
	
		//Hack in to the method that is called when [Start Annihilation] is clicked
		var oldAck = model.ackMessage;
		model.ackMessage = $.proxy(function() {
			oldAck();
			this.beginSync();
		}, this);
	},

	currentTime: ko.observable('Sync'),
	
	updateTime: function() {
		var newTime = this.timeOffset + (new Date().getTime() / 1000);
		var time = parseInt(newTime);
		
		var seconds = time % 60;
		var minutes = parseInt(time / 60) % 60;
		var hours = parseInt(time / 60 / 60);

		var str = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		if (hours > 0) {
			str = hours + ":" + str;
		}
		this.currentTime(str);
	},

	beginSync: function() {
		clearInterval(this.syncInterval);
		clearInterval(this.trySyncInterval);

		this.syncStartTime = model.currentTimeInSeconds();
		api.time.control();
		//if you set and unset immediately then current time doesn't work, so use a wait for time to change thingy
		this.attemptSyncInterval = setInterval($.proxy(this.attemptSync, this), 100);
	},

	attemptSync: function () {
		var newTime = model.currentTimeInSeconds();
		if (newTime == this.syncStartTime) {
			//time hasn't changed, keep waiting...
			//console.log('waiting');
			return;
		}

		clearInterval(this.attemptSyncInterval);
		api.time.resume();

		this.timeOffset = newTime - (new Date().getTime() / 1000);

		//console.log('got it!' + newTime + ' ' + timeOffset);

		this.updateTime();
		this.syncInterval = setInterval($.proxy(this.updateTime, this), 1000);
	}
};
window.reminderTimer.init();
$('body').append('<div id="in_game_timer">Sync</div>');


var element = $('#in_game_timer');
var syncInterval;
var timeOffset;

function updateTime() {
	var newTime = timeOffset + (new Date().getTime() / 1000);
	var time = parseInt(newTime);
	
	var seconds = time % 60;
	var minutes = parseInt(time / 60) % 60;
	var hours = parseInt(time / 60 / 60);

	var str = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
	if (hours > 0) {
		str = hours + ":" + str;
	}
	element.html(str);
}

element.click(function() {
	//console.log('sync');
	clearInterval(syncInterval);
	clearInterval(trySyncInterval);

	var startTime = model.currentTimeInSeconds();
	api.time.control();
	//if you set and unset immediately then current time doesn't work, so use a wait for time to change thingy
	var trySyncInterval = setInterval(function() {
		var newTime = model.currentTimeInSeconds();
		if (newTime == startTime) {
			//time hasn't changed, keep waiting...
			//console.log('waiting');
			return;
		}
		
		clearInterval(trySyncInterval);
		api.time.resume();
		
		timeOffset = newTime - (new Date().getTime() / 1000);
		
		//console.log('got it!' + newTime + ' ' + timeOffset);
		
		updateTime();
		syncInterval = setInterval(updateTime, 1000);
	}, 50);
});
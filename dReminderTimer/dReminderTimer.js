var reminderDef = function (name, time, repeat, audio, visible, hasConfirm) {
	this.name = ko.observable(name);
	this.time = ko.observable(time);
	this.repeat = repeat;
	this.audio = audio;
	this.visible = visible;
	this.hasConfirm = hasConfirm;
};

model.reminderTimer = {
	init: function() {
	
		//Create div, add to page
		this.manage = $(
			'<div id="remindertimer_manage">' +
				'<h1>Manage Reminders</h1>' +
				'<table>' +
					'<tr><th>Select Reminder</th><td><select><option>Reminder A</option></select></td></tr>' +
					'<tr><th>Name</th><td><input /></td></tr>' +
					'<tr><th>Time</th><td><input type="number" />:<input type="number" /> (mm:ss)</td></tr>' +
					'<tr><td colspan="2">When this timer expires, do the following</td></tr>' +
					'<tr><th>Repeat</th><td><input type="checkbox" /> Repeat</td></tr>' +
					'<tr><th>Visible</th><td><input type="checkbox" /> Show a message</td></tr>' +
					'<tr><th>Confirm</th><td><input type="checkbox" /> Ask for confirmation it has been acted</td></tr>' +
					'<tr><th>Audio</th><td><input type="checkbox" /> Play an audio queue</td></tr>' +
					'<tr><th></th><td><button>Save</button> <button>Delete</button></td></tr>' +
				'</table>' +
			'</div>');

		this.timersEl = $(
			'<div id="remindertimers">' +
				'<div class="timer">(mm:ss) Scout More</div>' +
				'<div class="timer">(mm:ss) Check Nuke</div>' +
				'<div class="timer">(mm:ss) Hide Comm</div>' +

				'<div class="managebutton">Manage</div>' +

				'<div class="quicktimer">' +
					'Quick <input type="text" /><br/>' +
					'<button>1m</button>' +
					'<button>2m</button>' +
					'<button>3m</button>' +
					'<button>4m</button>' +
					'<button>5m</button>' +
				'</div>' +
			'</div>');

		//$('body').append(this.manage);
		$('.div_player_list_panel').append(this.timersEl);

		//Try really hard not to retain focus so we don't break keyboard shortcuts
		$('select', this.container).change(this.blurAll);
		$(':checkbox', this.container).click(this.blurAll);
		$(document).keydown($.proxy(function (e) {
			if (e.keyCode == 27) {
				this.blurAll();
			}
		}, this));
	},

	blurAll: function () {
		$(document.activeElement).blur();
	},
};
model.reminderTimer.init();
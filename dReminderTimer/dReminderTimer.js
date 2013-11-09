var formatSeconds = function (seconds) {
	var s = seconds % 60;
	if (s < 9) {
		s = '0' + s;
	}
	return parseInt(seconds / 60) + ':' + s;
};

var ReminderDef = function (name, time, repeat, visible, hasConfirm, audio) {
	this.name = ko.observable(name || 'New Timer');
	this.time = ko.observable(time || 0);
	this.repeat = ko.observable(repeat);
	this.visible = ko.observable(visible);
	this.hasConfirm = ko.observable(hasConfirm);
	this.audio = ko.observable(audio);

	this.isActive = ko.observable(false);
	this.currentTime = ko.observable(0);

	this.timeMins = ko.observable(parseInt(this.time() / 60));
	this.timeSecs = ko.observable(this.time() % 60);

	this.text = ko.computed(function () {
		if (!this.isActive()) {
			return '[' + formatSeconds(this.time()) + '] ' + this.name();
		}
		return '(' + formatSeconds(this.currentTime()) + ') ' + this.name();
	}, this);

	this.timeMins.subscribe(this.recalcTime, this);
	this.timeSecs.subscribe(this.recalcTime, this);
	this.isActive.subscribe(function (val) { this.currentTime(val ? this.time() : 0); }, this);
};
ReminderDef.prototype.recalcTime = function () {
	this.time(this.timeMins() * 60 + this.timeSecs());
};
ReminderDef.prototype.toJson = function () {
	return {
		name: this.name(),
		time: this.time(),
		repeat: this.repeat(),
		visible: this.visible(),
		hasConfirm: this.hasConfirm(),
		audio: this.audio()
	};
};
ReminderDef.prototype.tick = function () {
	this.currentTime(this.currentTime() - 1);

	if (this.currentTime() <= 0) {
		//Trigger!
		if (this.repeat()) {
			this.currentTime(this.time());
		} else {
			this.isActive(false);
		}

		if (this.audio()) {
			if (this.audio)
				model.reminderTimer.sound.play();
		}
		if (this.visible()) {
			if (this.hasConfirm()) {
				var div = $(
					'<div class="message">' +
						'<span class="text">' + this.name() + '</span>' +
						'<button>Close</button>' +
					'</div>');
				model.reminderTimer.messageContainer.prepend(div);
				$('button', div).click(function () {
					div.remove();
				});
			} else {
				var div = $('<div class="message"><span class="text">' + this.name() + '</span></div>');
				model.reminderTimer.messageContainer.prepend(div);
				setTimeout(function () {
					div.remove();
				}, 3000);
			}
		}

		console.log('trigger: ' + this.name());
	}
};

model.reminderTimer = {

	timers: ko.observableArray(),
	quickTimers: ko.observableArray(),

	selectedTimer: ko.observable(),

	manageVisible: ko.observable(false),

	quickTimerText: ko.observable('Do Something!'),

	sound: new Audio('../../mods/dReminderTimer/sound.wav'),

	init: function () {
		this.load();
		if (this.timers().length > 0) {
			this.selectedTimer(this.timers()[0]);
		}

		//Proxy these so they work right with ko callbacks
		this.toggleManage = $.proxy(this.toggleManage, this);
		this.addTimer = $.proxy(this.addTimer, this);
		this.removeTimer = $.proxy(this.removeTimer, this);

		this.messageContainer = $('<div class="remindertimer_messages"></div>');

		//Create div, add to page
		this.manage = $(
			'<div id="remindertimer_manage" data-bind="visible: model.reminderTimer.manageVisible">' +
				'<div class="close" data-bind="click: model.reminderTimer.toggleManage">X</div>' +
				'<h1>Manage Reminders</h1>' +
				'<table>' +
					'<tr><th>Select Reminder</th><td>' +
					'<select data-bind="options: model.reminderTimer.timers, optionsText: \'name\', value: model.reminderTimer.selectedTimer"></select>' +
					'<button data-bind="click: model.reminderTimer.addTimer">+</button>' +
					'<button data-bind="click: model.reminderTimer.removeTimer">-</button>' +
					'</td></tr>' +
					'<!-- ko if: model.reminderTimer.selectedTimer -->' +
						'<tr><th>Name</th><td><input data-bind="value: model.reminderTimer.selectedTimer().name" /></td></tr>' +
						'<tr><th>Time</th><td>' +
							'<input data-bind="value: model.reminderTimer.selectedTimer().timeMins" type="number" min="0"/>:' +
							'<input  data-bind="value: model.reminderTimer.selectedTimer().timeSecs" type="number" min="0" max="59" step="10" /> (mm:ss)</td></tr>' +
						'<tr><td colspan="2">When this timer expires, do the following</td></tr>' +
						'<tr><th>Repeat</th><td><input data-bind="checked: model.reminderTimer.selectedTimer().repeat" type="checkbox" /> Repeat</td></tr>' +
						'<tr><th>Visible</th><td><input data-bind="checked: model.reminderTimer.selectedTimer().visible" type="checkbox" /> Show a message</td></tr>' +
						'<tr><th>Confirm</th><td><input data-bind="checked: model.reminderTimer.selectedTimer().hasConfirm" type="checkbox" /> Show message until confirmed</td></tr>' +
						'<tr><th>Audio</th><td><input data-bind="checked: model.reminderTimer.selectedTimer().audio" type="checkbox" /> Play an audio queue</td></tr>' +
					'<!-- /ko -->' +
				'</table>' +
			'</div>');

		this.timersEl = $(
			'<div id="remindertimers">' +

				'<!-- ko foreach: model.reminderTimer.timers -->' +
					'<div data-bind="click: model.reminderTimer.clickTimer, text: text" class="timer">FIXME</div>' +
				'<!-- /ko -->' +

				'<div class="managebutton" data-bind="click: model.reminderTimer.toggleManage">Manage</div>' +
				'<div class="quicktimer">' +
					'Quick <input type="text" data-bind="value: model.reminderTimer.quickTimerText" /><br/>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(1); }">1m</button>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(2); }">2m</button>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(3); }">3m</button>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(4); }">4m</button>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(5); }">5m</button>' +
				'</div>' +
				'<!-- ko foreach: model.reminderTimer.quickTimers -->' +
					'<div data-bind="click: model.reminderTimer.clickQuickTimer, text: text" class="timer">FIXME</div>' +
				'<!-- /ko -->' +
			'</div>');

		this.timersEl.prepend(this.manage);
		$('.div_player_list_panel').append(this.timersEl);
		$(document.body).append(this.messageContainer);

		//Try really hard not to retain focus so we don't break keyboard shortcuts
		$('select', this.container).change(this.blurAll);
		$(':checkbox', this.container).click(this.blurAll);
		$(document).keydown($.proxy(function (e) {
			if (e.keyCode == 27) {
				this.blurAll();
			}
		}, this));

		setInterval($.proxy(this.timerTick, this), 1000);
	},

	timerTick: function () {
		this.timers().forEach(function (timer) {
			if (timer.isActive()) {
				timer.tick();
			}
		}, this);


		this.quickTimers().forEach(function (timer) {
			if (timer.isActive()) {
				timer.tick();
			}

			if (!timer.isActive()) {
				this.quickTimers.remove(timer);
			}
		}, this);
	},

	toggleManage: function () {
		this.manageVisible(!this.manageVisible());

		if (!this.manageVisible()) {
			this.save();
		}
	},
	addTimer: function () {
		var timer = new ReminderDef();
		this.timers.push(timer);
		this.selectedTimer(timer);
	},
	removeTimer: function () {
		this.timers.remove(this.selectedTimer());
		if (this.timers().length > 0) {
			this.selectedTimer(this.timers()[0]);
		} else {
			this.selectedTimer(false);
		}
	},

	clickTimer: function (e) {
		e.isActive(!e.isActive());
	},

	clickQuickTimer: function (e) {
	},
	clickQuick: function (time) {
		var timer = new ReminderDef(this.quickTimerText(), time * 60, false, true, false, true);
		timer.isActive(true);
		this.quickTimers.push(timer);
	},

	save: function () {
		var data = this.timers.slice();
		for (var i = 0; i < data.length; i++) {
			data[i] = data[i].toJson();
		}

		window.localStorage.setItem('dReminderTimer_timers', JSON.stringify(data));
	},
	load: function () {
		var data = window.localStorage.getItem('dReminderTimer_timers');
		if (!data) {
			//set a default
			this.timers.push(new ReminderDef('Scout More!!!', 120));
			return;
		}

		data = JSON.parse(data);
		data.forEach(function (item) {
			this.timers.push(new ReminderDef(item.name, item.time, item.repeat, item.visible, item.hasConfirm, item.audio));
		}, this);
	},

	blurAll: function () {
		$(document.activeElement).blur();
	}
};
model.reminderTimer.init();
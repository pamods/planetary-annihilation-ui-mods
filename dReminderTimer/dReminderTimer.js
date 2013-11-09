var ReminderDef = function (name, time, repeat, visible, hasConfirm, audio) {
	this.name = ko.observable(name || 'New Timer');
	this.time = ko.observable(time || 0);
	this.repeat = ko.observable(repeat || false);
	this.visible = ko.observable(visible || true);
	this.hasConfirm = ko.observable(hasConfirm || true);
	this.audio = ko.observable(audio || false);

	this.timeMins = ko.observable(parseInt(this.time() / 60));
	this.timeSecs = ko.observable(this.time() % 60);

	this.timeMins.subscribe(this.recalcTime, this);
	this.timeSecs.subscribe(this.recalcTime, this);
};
ReminderDef.prototype.recalcTime = function () {
	this.time(this.timeMins() * 60 + this.timeSecs());
};


model.reminderTimer = {

	timers: ko.observableArray([
		new ReminderDef('Scout More', 123),
		new ReminderDef('Check Nuke', 54),
		new ReminderDef('Hide Comm', 179)
	]),

	selectedTimer: ko.observable(),

	init: function () {

		this.selectedTimer(this.timers()[0]);

		//Create div, add to page
		this.manage = $(
			'<div id="remindertimer_manage">' +
				'<h1>Manage Reminders</h1>' +
				'<table>' +
					'<tr><th>Select Reminder</th><td>' +
					'<select data-bind="options: model.reminderTimer.timers, optionsText: \'name\', value: model.reminderTimer.selectedTimer"></select>' +
					'<button>+</button>' +
					'</td></tr>' +
					'<!-- ko if: model.reminderTimer.selectedTimer -->' +
						'<tr><th>Name</th><td><input data-bind="value: model.reminderTimer.selectedTimer().name" /></td></tr>' +
						'<tr><th>Time</th><td>' +
							'<input data-bind="value: model.reminderTimer.selectedTimer().timeMins" type="number" />:' +
							'<input  data-bind="value: model.reminderTimer.selectedTimer().timeSecs" type="number" /> (mm:ss)</td></tr>' +
						'<tr><td colspan="2">When this timer expires, do the following</td></tr>' +
						'<tr><th>Repeat</th><td><input data-bind="checked: model.reminderTimer.selectedTimer().repeat" type="checkbox" /> Repeat</td></tr>' +
						'<tr><th>Visible</th><td><input data-bind="checked: model.reminderTimer.selectedTimer().visible" type="checkbox" /> Show a message</td></tr>' +
						'<tr><th>Confirm</th><td><input data-bind="checked: model.reminderTimer.selectedTimer().hasConfirm" type="checkbox" /> Show message until confirmed</td></tr>' +
						'<tr><th>Audio</th><td><input data-bind="checked: model.reminderTimer.selectedTimer().audio" type="checkbox" /> Play an audio queue</td></tr>' +
						'<tr><th></th><td><button>Delete</button></td></tr>' +
					'<!-- /ko -->' +
				'</table>' +
			'</div>');

		this.timersEl = $(
			'<div id="remindertimers">' +

				'<!-- ko foreach: model.reminderTimer.timers -->' +
					'<div data-bind="click: model.reminderTimer.clickTimer, text: name" class="timer">FIXME</div>' +
				'<!-- /ko -->' +

				'<div class="managebutton">Manage</div>' +
				'<div class="quicktimer">' +
					'Quick <input type="text" /><br/>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(1); }">1m</button>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(2); }">2m</button>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(3); }">3m</button>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(4); }">4m</button>' +
					'<button data-bind="click: function() { model.reminderTimer.clickQuick(5); }">5m</button>' +
				'</div>' +
			'</div>');

		$('body').append(this.manage);
		$('.div_player_list_panel').append(this.timersEl);


		this.selectedTimer.subscribe(this.selectChanged, this);

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

	clickTimer: function (e) {
		console.log('click');
		console.log(e);
	},

	clickQuick: function (e) {
		console.log('quick ' + e);
	},

	selectChanged: function (e, e2, e3) {
		console.log('selectChanged');
		console.log(e);
	}
};
model.reminderTimer.init();
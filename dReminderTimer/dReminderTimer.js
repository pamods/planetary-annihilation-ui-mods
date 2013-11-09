var reminderDef = function (name, time, repeat, audio, visible, hasConfirm) {
	this.name = ko.observable(name);
	this.time = ko.observable(time);
	this.repeat = repeat;
	this.audio = audio;
	this.visible = visible;
	this.hasConfirm = hasConfirm;
};

model.reminderTimer = {

	timers: ko.observableArray([
		{ name: "Scout More", time: 123, active: ko.observable(true), text: ko.observable('(mm:ss) Scout More') },
		{ name: "Check Nuke", time: 143, active: ko.observable(false), text: ko.observable('(mm:ss) CN') },
		{ name: "Hide Comm", time: 179, active: ko.observable(false), text: ko.observable('(mm:ss) fpoksf') }
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
					'<select data-bind="options: model.reminderTimer.timers, optionsText: \'name\', value: model.reminderTimer.selectedTimer">' +
//					'<!-- ko foreach:  -->' +
	//					'<option data-bind="text: name, value: $index">Reminder A</option>' +
		//			'<!-- /ko -->' +
					'</select>' +
					'<button>+</button>' +
					'</td></tr>' +
					'<!-- ko if: model.reminderTimer.selectedTimer -->' +
						'<tr><th>Name</th><td><input /></td></tr>' +
						'<tr><th>Time</th><td><input type="number" value="0" />:<input type="number" value="0"/> (mm:ss)</td></tr>' +
						'<tr><td colspan="2">When this timer expires, do the following</td></tr>' +
						'<tr><th>Repeat</th><td><input type="checkbox" /> Repeat</td></tr>' +
						'<tr><th>Visible</th><td><input type="checkbox" /> Show a message</td></tr>' +
						'<tr><th>Confirm</th><td><input type="checkbox" /> Show message until confirmed</td></tr>' +
						'<tr><th>Audio</th><td><input type="checkbox" /> Play an audio queue</td></tr>' +
						'<tr><th></th><td><button>Save</button> <button>Delete</button></td></tr>' +
					'<!-- /ko -->' +
				'</table>' +
			'</div>');

		this.timersEl = $(
			'<div id="remindertimers">' +

				'<!-- ko foreach: model.reminderTimer.timers -->' +
					'<div data-bind="click: model.reminderTimer.clickTimer, text: text" class="timer">FIXME</div>' +
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
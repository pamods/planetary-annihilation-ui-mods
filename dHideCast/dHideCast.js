model.hideCast = {

	init: function () {
		this.el = $('<span id="hidecast" data-bind="click: model.hideCast.toggleHideCast">Hide for Cast</span>');
		
		$('body').append(this.el);
	},

	toggleHideCast: function () {
		$('body').toggleClass('hide-for-cast');
		model.hideCast.el.css('opacity', '0');
	}
};
model.hideCast.init();
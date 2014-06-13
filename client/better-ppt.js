Slides = new Meteor.Collection("Slides");

Router.map(function() {
	this.route('home', {
		path: '/',
		template: 'fancyhome',
		waitOn: function () {
			return Meteor.subscribe('allslides');
		},
		action: function () {
			if (this.ready())
				this.render();
			else
				this.render('loading');
		}
	}),
	this.route('deck', {
		path: '/:slug',
		template: 'slideTemplate',
		waitOn: function () {
			return Meteor.subscribe('deck', this.params.slug);
		},
		data: function() {
			return Slides.findOne();
		},
		action: function () {
			if (this.ready())
				this.render();
			else 
				this.render('loading');
		},	
	})
});

Template.slideTemplate.rendered = function() {
	// set up ace editor
	editor = ace.edit("editor");
	editor.getSession().setMode('ace/mode/html');
	editor.setTheme('ace/theme/monokai');
	editor.getSession().setUseWrapMode(true);
	editor.commands.addCommand({
		name: "customSave",
		bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
		exec: function(env,args,request) {
			$('.save-control').trigger('click');
		} 
	});
	// set data in editor
	editor.setValue(this.data.html);
	// initialize Reveal
	Reveal.initialize({
		embedded: true,
		history: true,
		theme: this.data.theme
	});
	Reveal.slide();
	// save id in session
	Session.set('edit_id', this.data._id);
};

Template.slideTemplate.theme = function () {
	return ['solarized','sky','default','beige','moon','simple','night','blood','serif'];
}

Template.slideTemplate.activetheme = function () {
	var currenttheme = Router.getData().theme;
	if (String(this) === currenttheme) {
		return 'active-theme';
	};
}

Template.slideTemplate.events({
	'click .edit-control': function (e,t) {
		$('.editor-panel').toggleClass('hide');
		$('.theme-options').addClass('hide');
		$('.reveal').toggleClass('reveal-wide');
		var current = Reveal.getIndices();
		Meteor.setTimeout(function() {
			Reveal.slide(current.h,current.v,current.f);
			editor.resize();
		},520);
	},
	'click .save-control': function (e,t) {
		var newhtml = editor.getValue();
		var current = Reveal.getIndices();
		console.log(newhtml);
		console.log(this);
		Meteor.call('updateslide', this._id, newhtml, function (err, result) {
			Deps.flush();
			Reveal.slide(current.h,current.v,current.f);
		});	
	},
	'click .theme-control': function (e,t) {
		$('.theme-options').toggleClass('hide');
	},
	'click .theme-option': function (e,t) {
		var value = $(e.target).data('value');
		Meteor.call('settheme', Session.get('edit_id'), value, function (err, result) {
			Reveal.configure({theme:value});
		});
	}
});

Template.fancyhome.slidedeck = function () {
	return Slides.find();
}


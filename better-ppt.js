Slides = new Meteor.Collection("Slides")

if (Meteor.isClient) {

	Router.map(function() {
		this.route('home', {
			path: '/',
			template: 'appTemplate',
			data: function() {
				return Slides.findOne();
			}	
		})
	});
	
	Template.slideTemplate.html = function() {
		return this.html;
		console.log(this);
		//if (Slides.findOne()) {
		//	return Slides.findOne().html;
		//}
	}	

	Template.codeEditorTemplate.rendered = function() {
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
	};

	Template.codeEditorTemplate.value = function() {
		if (Slides.findOne()) {
			var slideSet = Slides.findOne();
			var slidehtml = slideSet.html;
			Session.set('edit_id', slideSet._id);
			if (typeof(editor) !== "undefined") {
				editor.setValue(slidehtml);
			}
			var notnull = document.querySelector('.reveal .slides');
		  if (notnull = null) {console.log('hi')}
			else {
				Reveal.initialize({
					embedded: true,
					history: true,
				});
			}
		}
	}

	Template.codeEditorTemplate.events({
		'click .edit-control': function (e,t) {
			$('.editor-panel').toggleClass('hide');
			$('.reveal').toggleClass('reveal-wide');
			var current = Reveal.getIndices();
			Meteor.setTimeout(function() {
				Reveal.slide(current.h,current.v,current.f);
				editor.resize();
			},520);
		},
		'click .save-control': function (e,t) {
			var tmp = editor.getValue();
			var current = Reveal.getIndices();
			console.log(Session.get('edit_id'));
			console.log(tmp);
			Slides.update(Session.get('edit_id'), 
			{$set: 
				{
					html: tmp
				} 
			});
			Deps.flush();
			Reveal.slide(current.h,current.v,current.f);
		},
		'click .theme-control': function (e,t) {
			console.log('clicked?');
			$('.theme-options').toggleClass('hide');
		},
		'click .theme-option': function (e,t) {
			var value = $(e.target).data('value');
			console.log(value);
			Reveal.configure({theme:value});
		}
	});

}

if (Meteor.isServer) {
  
	Meteor.startup(function () {
		if (Slides.find().count() === 0) {
			Slides.insert({
					order: 1,
					theme: 'default',
					html: "<section>Single Horizontal Slide</section><section><section>Vertical Slide 1</section><section>Vertical Slide 2</section></section>"
			});
	  }
  });
}

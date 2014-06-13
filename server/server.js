Slides = new Meteor.Collection("Slides");

Meteor.startup(function () {
	if (Slides.find().count() === 0) {
		Slides.insert({
				order: 1,
				theme: 'default',
				title: 'Week 1',
				slug: 'test',
				html: "<section>Single Horizontal Slide</section><section><section>Vertical Slide 1</section><section>Vertical Slide 2</section></section>"
		});
  }
});

Meteor.publish('deck', function (slug) {
	return Slides.find({slug: slug});
});

Meteor.publish('allslides', function() {
	return Slides.find();
})

Meteor.methods ({
	updateslide: function (id, newhtml) {
		Slides.update(id, 
		{$set: 
			{
				html: newhtml
			} 
		});
	},
	settheme: function (id, theme) {
		Slides.update(id,
		{$set: 
			{
				theme: theme
			}
		})
	}
});
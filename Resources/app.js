/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}
else if (Ti.Platform.osname === 'mobileweb') {
	alert('Mobile web is not yet supported by this template');
}
else {
	//require and open top level UI component
	
	var win = Titanium.UI.createWindow({backgroundColor: '#FFFFFF'});
	var RadialMenu = require("common/radial_menu");
	var tbuttons = [];
	for (var i = 0; i < 4; i++) {
		var temp = Titanium.UI.createButton({
		    title: '',
		    backgroundImage: "KS_nav_views.png",
	        width: 40,
	        height: 40
	    });
	    temp.addEventListener(
	    	"click",
	    	(function(x) {
	    		return function(ev) { alert("Clicked " + x + "!"); };
	    	})(i+1)
	    );
	    tbuttons.push(temp);
	}
	var menu = new RadialMenu({bottom: 0, right: 0, radius: {outer: 150, inner: 100}, angle: 135, items: tbuttons, backgroundImage: 'ui/radial_menu_background.png'});
	win.add(menu);
	win.open();
	//var ArcGestureTest = require("ui/ArcGestureTest");
	//new ArcGestureTest().open({fullscreen: true});
	//var ApplicationWindow = require('ui/ApplicationWindow');
	//new ApplicationWindow().open();
}
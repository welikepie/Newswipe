//Application Window Component Constructor
function ApplicationWindow() {
	
	var Article = require('ui/Article');
	var wiki = require('common/wiki');
	var wiky = require('common/wiky');
	
	Titanium.API.debug("Instantiating main window...");
		
	//create component instance
	var self = Ti.UI.createWindow({
	    title: 'Newswipe',
		backgroundColor:'#ffffff',
		navBarHidden:false,
		exitOnClose:true
	});
	
	Titanium.API.debug("Instantiating article view...");
		
	//construct UI
	var article = new Article();
	Titanium.API.debug("Adding article view to window...");
	self.add(article.view);
	Titanium.API.debug("Article view added to window.");

    var actInd = Ti.UI.createActivityIndicator({
        message: 'Loading article...',
        color: '#fff'
    });
    
    Titanium.API.debug("Indicator has been set up.");
    
    var refresh = function() {
        
        Titanium.API.debug("Initiating the article refresh...");
        actInd.show();
        Titanium.API.debug("Starting the external request...");
        wiki.random({
            
            'success': function(content) {
                
                Titanium.API.info("Content delivered: " + this.responseText);
                content.content = wiky.process(content.content);
                Titanium.API.debug("Parsed data: " + content.content);
                article.setArticle(content);
                Titanium.API.info("Updated the parameters with: " + content);
                
            },
            'error': function(ev) {
                
                Titanium.API.error(ev.error);
                alert("Error happened!\n" + this.statusText + "\n" + ev.error);
                
            },
            'complete': function() { actInd.hide(); }
            
        });
        
    };
    
    Titanium.API.debug("Refresh function defined.");
    
    var ev_refresh = function(ev) {
        Titanium.API.debug("Fired event: " + ev.type);
        refresh();
    };
    
    Titanium.API.debug("Event refresh set up.");

    self.addEventListener('dblclick', ev_refresh);
    self.addEventListener('doubletap', ev_refresh);
    self.addEventListener('open', ev_refresh);
    
    Titanium.API.debug("Events of the window bound.");
    
	return self;

}

//make constructor function the public component interface
module.exports = ApplicationWindow;

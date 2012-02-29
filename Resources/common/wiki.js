/* WIKIPEDIA ACCESS
 * This module here exposes the functions used to return the content from Wikipedia.
 * The module pattern as seen here: http://developer.appcelerator.com/blog/2011/10/how-to-create-a-javascript-module-for-commonjs-ti-include-or-the-browser.html
 */

var jsuri = require('common/jsuri');
var wiky  = require('common/wiky');
var utils = require('common/utils');

var wiki = {};
(function (exports) {

    // CONSTANTS
    // -----------------
    var API_URL = 'http://en.wikipedia.org/w/api.php';
    var API_FORMAT = 'json';
    var USER_AGENT = 'RandomWikiArticle/1.0 AppleWebKit/531.21.10 (KHTML, like Gecko)';
    
    exports.random = function(o) {
        
        var defaults = {
            'complete': null,
            'success': null,
            'error': null
        }; var params = utils.merge(defaults, o);
        
        Titanium.API.debug("random() called with: " + JSON.stringify(params));
        
        // Build URL for accessing the data
        var uri = new jsuri.Uri(API_URL)
            .addQueryParam('format', API_FORMAT)
            .addQueryParam('action', 'query')
            .addQueryParam('generator', 'random')
            .addQueryParam('grnlimit', 1)
            .addQueryParam('grnnamespace', 0)
            .addQueryParam('prop', 'revisions')
            .addQueryParam('rvprop', 'content')
            .toString();
        
        Titanium.API.debug("URL called: " + uri);
        
        var xhr = Titanium.Network.createHTTPClient({
            'onload': function(ev) {
                
                Titanium.API.debug("Success AJAX.");
                Titanium.API.debug("Response: " + this.responseText);
                Titanium.API.debug("PARAMS: " + JSON.stringify(params));
                
                // Extract article from response
                var result = JSON.parse(this.responseText);
                var content = {};
                for (var x in result.query.pages) {
                    if (result.query.pages.hasOwnProperty(x)) {
                        
                        content.title = result.query.pages[x].title;
                        content.content = result.query.pages[x].revisions[0]['*'];
                        break;
                        
                    }
                }
                
                Titanium.API.debug("The content: " + content.toString());
                
                try {
                if (params.success) { Titanium.API.debug("Firing success func."); params.success.bind(this)(content); }
                if (params.complete) { Titanium.API.debug("Firing complete func."); params.complete.bind(this)(ev, content); }
                } catch(e) { Titanium.API.error(e); }
            
            },
            'onerror': function(ev) {
                
                Titanium.API.debug("Failed AJAX.");
                Titanium.API.debug("Status: " + this.statusText);
                
                if (params.error) { Titanium.API.debug("Firing error func."); params.error.bind(this)(ev); }
                if (params.complete) { Titanium.API.debug("Firing complete func."); params.complete.bind(this)(ev); }
            }
        });
        Titanium.API.debug("Starting XHR..."); 
        xhr.open('GET', uri);
        xhr.setRequestHeader('User-Agent', USER_AGENT);
        Titanium.API.debug("Sending request..."); 
        xhr.send();
        Titanium.API.debug("Request sent."); 
        
    };

}(typeof exports === 'object' && exports || wiki));

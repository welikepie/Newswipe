/* RADIAL MENU
 * **********************************
 * Custom UI component which can be used to handle a wheel-like
 * menu that appears at the edge of the screen. The menu holds
 * several buttons and can be "wheeled on" and "wheeled off"
 * the screen, as well as transition into another menu.
 * 
 * Parameters:
 * - radius  - Pertaining radius of the radial menu.
 *   - outer - The general radius, i.e. how big the whole menu is.
 *   - inner - The radius at which the buttons should be put in.
 * - angle   - The angle at which the radial menu should be rotated
 *             (decimal degrees should be used to specify).
 * - degrees - Array of degrees at which the buttons will be placed.
 *             Should be between 0 and 180 and with at least the same
 *             amount of elements as the 'items' parameter.
 * - items   - Array of actual buttons/views/whatever should end up
 *             in the radial menu. Shouldn't be longer than 'degrees'.
 * - hidden  - Whether the menu is hidden off-screen (rotated 180 degrees,
 * 	           assuming it's placed at the edge of the screen).
 */

var Sylvester = require('common/sylvester');
var utils = require('common/utils');

var RadialMenu = function(props) {
	
	// PROCESS PARAMETERS
	// ----------------------------
	// Ensure there's an object available even
	// if we're doing straight default run.
	if (typeof props !== "object") { props = {}; }
	
	// Ensure the additional parameters are present
	// in the properties dictionary (easier to define
    // now than to do the checks everytime they're used).
	if (typeof props.radius === 'object') {
		props.radius.outer = ('outer' in props.radius ? parseInt(props.radius.outer, 10) : 150);
		props.radius.inner = ('inner' in props.radius ? parseInt(props.radius.inner, 10) : 100);
	} else {
		props.radius = {'outer': 150, 'inner': 100};
	}
	props.angle = ('angle' in props ? utils.round(parseFloat(props.angle), 2) : 0);
	if ((typeof props.degrees !== 'object') || !Array.isArray(props.degrees)) { props.degrees = [ 22.5,  67.5, 112.5, 157.5 ]; }
	if ((typeof props.items !== 'object') || !Array.isArray(props.items)) { props.items = []; }
	if (typeof props.hidden !== 'undefined') { props.hidden = !!props.hidden; } else { props.hidden = false; }
	
	// Add (or modify) some standard parameters than need to
	// have specific values for radial menu
	props.anchorPoint = {'x': 0.5, 'y': 0};
    props.width = props.radius.outer * 2;
    props.height = props.radius.outer;
    
    // Create the base view
    var self = Titanium.UI.createView(utils.prune(props,
    	'radius', 'angle',
    	'degrees', 'items',
    	'hidden'
    ));
    
    // ITEM PLACEMENT
    // ----------------------------
    // Place the items on the radial menu according to degree specs.
    var translate = Sylvester.Vector.create([props.radius.outer, 0]);
    
    // If the non-zero angle has been specified, define the rotation matrices
    // for the parent view (to rotate it as needed) and the menu items (negative
    // angle to offset the view rotation, hence making the items upright in any setup).
    var menu_matrix = (props.angle !== 0 ? Titanium.UI.create2DMatrix({rotate: props.angle}) : null);
    var item_matrix = (props.angle !== 0 ? Titanium.UI.create2DMatrix({rotate: -props.angle}) : null);
    
    // Place the menu items in the menu, by calculating
    if (props.items) {
    	for (var i = 0; i < props.items.length; i++) {
    		
    		// Calculate the position based on the degrees angle
    		var pos = Sylvester.Vector.create([props.radius.inner, 0])
    		          .rotate(Math.PI * props.degrees[i] / 180, Sylvester.Vector.Zero(2))
    		          .add(translate);
    		
    		// Set the item position within the view (and rotate it, if necessary)
    		props.items[i].setLeft(pos.e(1) - (props.items[i].getWidth() / 2));
    		props.items[i].setTop(pos.e(2) - (props.items[i].getHeight() / 2));
    		if (item_matrix) { props.items[i].setTransform(item_matrix); }
    		
    		self.add(props.items[i]);
    		
    	}
    }
    
    // Rotate the actual menu, if necessary
    if (menu_matrix) { self.setTransform(menu_matrix); }
    
    return self;
    
};

if (typeof module !== "undefined") {
    if ("exports" in module) {
        module.exports = RadialMenu; 
    }
}
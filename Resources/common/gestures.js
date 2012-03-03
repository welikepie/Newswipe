/* ADCANCED GESTURES
 * **********************************
 * Advanced gesture detection - this module contains JavaScript code used
 * to automatically process touch events and extract complex gestures from
 * them.
 * Each of the functions attaches several touch event handlers to the specified
 * UI object - these handlers will process the gesture data and fire an appropriate
 * synthesized event if the gesture has been successfully recognized.
 *
 * All the events follow the name format of "gesture.[name of the gesture]".
 * Callback event object will always contain following properties in addition to
 * gesture-specific properties:
 *
 * - gesture     - name of the gesture
 * - boundingBox - specifies the rectangle area containing the entire gesture
 */
var Sylvester = require('common/sylvester');

if (!Math.TAU) { Math.TAU = 2 * Math.PI; }

var gestures = {};
(function (exports) {

	// AUXILIARY FUNCTIONS
	// ----------------------------------
	
	// Function used to determine whether point lies inside of the specified polygon.
	// Useful for determining whether gesture was contained in an arbitrary area.
	var isPointInPoly = function(pt, poly) {
		for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
			((poly[i].e(2) <= pt.e(2) && pt.e(2) < poly[j].e(2)) || (poly[j].e(2) <= pt.e(2) && pt.e(2) < poly[i].e(2)))
			&& (pt.e(1) < (poly[j].e(1) - poly[i].e(1)) * (pt.e(2) - poly[i].e(2)) / (poly[j].e(2) - poly[i].e(2)) + poly[i].e(1))
			&& (c = !c);
		}
		return c;
	};

	exports.arc = function(obj, min_distance, min_threshold) {
	
		// Touch data will be contained here
		var touch_movement = [];
		
		obj.addEventListener("touchstart", function(ev) {
		    // Reset point data
		    touch_movement = [Sylvester.Vector.create([ev.x, ev.y])];
		});
		obj.addEventListener("touchmove", function(ev) {
		    touch_movement.push(Sylvester.Vector.create([ev.x, ev.y]));
		});
		obj.addEventListener("touchend", function(ev) {
		    
		    var i, j, x, y;
		    
		    // Calculate the translation vector, then translate all the points
		    var translate = touch_movement[0].add(touch_movement[touch_movement.length-1]).multiply(0.5);
		    var points = []; for (var i = 0; i < touch_movement.length; i++) {
		        points.push(touch_movement[i].subtract(translate));
		    }
		    
		    // Calculate proceedins
		    var proceeding = [];
		    proceeding.push({"origin": points[0].rotate(Math.PI/2, Sylvester.Vector.Zero(2))});
		    proceeding.push({"origin": points[0].rotate(-Math.PI/2, Sylvester.Vector.Zero(2))});
		    
		    // Verify each proceeding
		    for (i = 0; i < 2; i++) {
		        
		        // Specify bounding area
		        proceeding[i].area = [
                    points[0],
                    points[points.length - 1],
                    points[points.length - 1].add(proceeding[i].origin),
                    points[0].add(proceeding[0].origin)         
                ];
                // Calculate the total number of points contained
                proceeding[i].count = 0;
                for (j = 0; i < points.length; j++) {
                    if (isPointInPoly(points[j], proceeding[i].area)) {
                        proceeding[i].count++;
                    }
                }
		        
		    }
		    
		    // Decide on correct proceeding
		    if ( (proceeding[0].count > proceeding[1].count) &&
		       ( (proceeding[0].count / (points.length - 1)) > min_threshold ) ) { i = 1; }
		    else if ( (proceeding[1].count / (points.length - 1)) > min_threshold ) { i = 0; }
		    else { i = null; }
		    
		    // Emit arc gesture
		    if (i !== null) {
		        
		        var event_dict = {"name": "arc"};
		        
		        // Calculate the bounding box
		        event_dict.boundingBox = [
		            touch_movement[0].e(1),
		            touch_movement[0].e(2),
		            touch_movement[touch_movement.length - 1].e(1),
		            touch_movement[touch_movement.length - 1].e(2)
		        ];
		        for (j = 0; j < touch_movement.length; j++) {
		            x = touch_movement.e(1);
		            y = touch_movement.e(2);
		            if (x < event_dict.boundingBox[0]) { event_dict.boundingBox[0] = x; }
		            if (x > event_dict.boundingBox[2]) { event_dict.boundingBox[2] = x; }
		            if (y < event_dict.boundingBox[1]) { event_dict.boundingBox[1] = y; }
                    if (y > event_dict.boundingBox[3]) { event_dict.boundingBox[3] = y; }
		        }
		        
		        event_dict.origin = proceeding[i].origin.add(translate.inspect());
		        event_dict.radius = proceeding[i].origin.distanceFrom(points[0]);
		        event_dict.angle = (Math.atan2(proceeding[i].origin.e(1), proceeding[i].origin.e(2)) + Math.TAU) % Math.TAU;
		        
		        obj.fireEvent("gestures.arc", event_dict);
		        
		    }
		    
		});
	
	};

}(typeof exports === 'object' && exports || wiki));
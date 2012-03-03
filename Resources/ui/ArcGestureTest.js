function ArcGestureTest() {

    var gestures = require("common/gestures");
    
    var self = Titanium.UI.createWindow({ backgroundColor: '#336699' });
    var label = Titanium.UI.createLabel({
        id:'test',
        text:'',
        top:0,
        height:170,
        textAlign:'left'
    });
    self.add(label);
    
    // Assign the events
    gestures.arc(self, 40, 0.75);
    self.addEventListener("touchstart", function() { label.setText(""); });
    self.addEventListener("gestures.arc", function(ev) {
        label.setText(
            "Bounding box: [" + ev.boundingBox[0] + "," + ev.boundingBox[1] + "] to [" + ev.boundingBox[2] + "," + ev.boundingBox[3] + "]\n" +
            "Origin: " + ev.origin[0] + ", " + ev.origin[1] + "\n" +
            "Angle: " + (ev.degree / Math.PI * 180) + "\n" +
            "Radius: " + ev.radius
        );
    });
    
    return self;

}

//make constructor function the public component interface
module.exports = ArcGestureTest;
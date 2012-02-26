/* UTILITY FUNCTIONS
 * **********************************
 * Collection of all the different JavaScript functions with
 * no discernable allegiance. A drop-box for useful bits and bobs.
 */

var utils = {};
(function (exports) {

    exports.merge = function(/* variable arguments */) {
        
        /* This function is used to create a new object which merges
         * the properties of all the provided objects. It can be used,
         * for example, to provide defaults in dictionary-driven functions.
         * 
         * The function can be used with any number of objects. The result
         * will be the single object with each property with the last encountered
         * value (while source objects are traversed first to last).
         * 
         * var first = {"a": 1, "b": 2};
         * var second = {"a": 3, "c", 4};
         * var final = utils.merge(first, second);
         * 
         * final: {"a": 3, "b": 2, "c": 4}
         */
        
        var result = {};
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i]) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        result[prop] = arguments[i][prop];
                    }
                }
            }
        }
        
        return result;
        
    };
    
    exports.prune = function(obj /* , variable arguments */) {
        
        /* This function is used to prune particular properties from the
         * specified object, for example before sending it for serialization.
         * The returned value is the new object, the source one is not modified
         * in any way.
         * 
         * The function accepts from two to unlimited number of arguments.
         * First argument is always the object to be pruned. The list of properties
         * to prune can either be a single array of strings or a variable number of
         * string arguments.
         * 
         * var test = {"a": 1, "b": 2, "c": 3, "d": 4};
         * var final = utils.prune(test, 'a', 'c');
         * 
         * final: {"b": 2, "d": 4}
         */
        
        // Normalize the arguments - either use only the second
        // provided argument, if it's the array, or create the array
        // of all the arguments past the first one.
        var properties;
        if (arguments.length === 2 && 'length' in arguments[1]) {
            properties = Array.prototype.slice.call(arguments, 1);
        } else {
            properties = [];
            for (var i = 1; i < arguments.length; i++) {
                properties.push(arguments[i].toString());
            }
        }
        
        // Prune the properties
        var result = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && (properties.indexOf(prop) !== -1)) {
                result[prop] = obj[prop];
            }
        }
        
        return result;
        
    };

}(typeof exports === 'object' && exports || utils));
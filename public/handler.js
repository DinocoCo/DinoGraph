/**                                                                                                                                
 * handler.js                                                                                                                           
 *                                                                                                                                 
 * Defines functionality for handling user input.                                                                     
 *                                                                                                                                 
 */


//Create namespace
var dino = dino || {};
dino.handle = {};

dino.handle = function() {

    var dino.handle.all = -1;
    var criteria;
    var dino.handle.criteriaMaxLen = [5, 5, 12];
    var dino.handle.majorMaxLen = 5;
    var dino.handle.yearMaxLen = 5;
    var dino.handle.schoolMaxLen = 5;

    dino.handle.fetch = function() {
        
        // Take each selected element's ID and convert to an int array
        var majors = dino.help.parseToIntArr($('#major').val());
        var years = dino.help.parseToIntArr($('#year').val());
        var schools = dino.help.parseToIntArr($('#school').val());

        // Put each array into another array
        criteria = [majors, years, schools];

    };

    dino.handle.submit = function() {
        
        // Grab an array of the selected elements in the lists
        dino.handle.fetch();
        
        // Pass the input tho the controller
        dino.viz.vizController(criteria);
    };

    dino.handle.init = function() {
        
		// Grab the 'Submit' button element, identified by the
		// 'submit-btn' id.
		var button = document.getElementById('submit-btn');

		// From this point forward, when the button is clicked, the
		// fetch function shall be invoked.
		button.onclick = dino.handle.sumbit;


	};

};

dino.handle();
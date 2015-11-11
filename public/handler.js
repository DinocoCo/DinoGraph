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

    window.onload = function()
	{
		console.log('Initialize Handler');
		// Grab the 'Submit' button element, identified by the
		// 'submit-btn' id.
		var button = document.getElementById('submit-btn');
		
		//grab the different selection lists
		var options = ['year', 'major', 'school'];
		var select = [];
		for(var i = 0; i < options.length; i++)
		{
			select[i] = document.getElementById(options[i]);
		}
		

		// From this point forward, when the button is clicked, the
		// fetch function shall be invoked.
		button.onclick = function()
		{
			console.log('Someone hit submit');
			
			// Grab an array of the selected elements in the lists
			// Take each selected element's ID and convert to an int array
			
			var criteria = [];
			
			for(var i = 0; i < options.length; i++)
			{
				var optionVals = [];
				for(var j = 0; j < select[i].length; j++)
				{
					if(select[i].options[j].selected)
					{
						var optionInt = dino.help.convertToInt(select[i].options[j].text,i);
						optionVals.push(optionInt);
					}
				}
				criteria.push(optionVals);
			}
			console.log("Criteria:"+criteria);
			// Pass the input tho the controller
			dino.viz.vizController(criteria);
		};

	};

};

dino.handle();
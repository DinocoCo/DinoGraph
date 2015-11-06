/*
 * viz.js
 *
 * Defines:
 *
 * @author: Anthony Donaldson
 * @author: Ken Kobayashi
 * @author: Justin Ohta
 * @since: November 3, 2015
 */

//Extend namespace
var dino = dino || {};
dino.viz = {};

//Start module
dino.viz = function() {
 
	google.load('visualization', '1', {packages: ['bar']});

	google.setOnLoadCallback(vizInit);

	// Define the variables to hold the entire fusion table,
	// and a collection of views, one for each year.
	var data;
	var rawData;
	var totals = {};
	
	//Default criteria to narrow graph (Show UP versus 3 other schools)
	var criteria = [[1,2,3],[1,3],[1]];
	for(var i = 0; i < 4; i++) {
		criteria.push([-1]);
	}

	// Define the variable to hold the chart.                                                                              
	var chart;                                                                         

	// Set the options for the chart to be drawn.  This include the
	// width, height, title, horizontal axis, vertical axis.  Finally
	// turn off the legend.
	var options = {
		width: 700,
		height: 400,
		chart: {
			title: 'Confidence with Research',
		},
		bars: 'vertical',
		//axes: {
		//	x: {
		//		criteria: {label: 'Criteria'}
		//	},
		//	y: {
		//		confidence: {label: 'Confidence'}
		//	}
		//},
		

		legend: { 
			position: 'none' 
		},
		animation: {
			"startup" : true,
			"duration" : 500
		}
	};

	function vizInit()
	{
		console.log("Initializing vis");
		
		// Create a new viz object using the google API -- specifically,
		// we are going to make a column chart inside the div called ex0                                                   
		// in the html file.
		chart = new google.charts.Bar(document.getElementById('ex0'));


		// 9/19/2015 Corrected typo
		// Make the initial query to get the whole Fusion table. The Fusion
		// table’s ID is listed in red.                                                            
		var query = "SELECT Year, Major, School, Type, AveConfidence FROM 1-OBa3j2heK1znLQ2jb3EpqYZ90i4ahW6Z6wih8Pd";


		var opts = {sendMethod: 'auto'};
		var queryObj = new google.visualization.Query('https://www.google.com/fusiontables/gvizdata?tq=', opts);


		// Send the query and handle the response by logging the data
		// to the console.                                                                
		queryObj.setQuery(query);
		queryObj.send(function(e) {

			console.log("Sending query");
			rawData = e.getDataTable();

			data = new google.visualization.DataTable();
			//data.addColumn('string', 'Grade');
			//data.addColumn('string', 'Major');
			//data.addColumn('string', 'School');
			data.addColumn('string', 'BarName');
			data.addColumn('number', 'Average Confidence');
			
			console.log("Adding columns to new table");

			var groupedData = google.visualization.data.group(rawData,[1,2,3,4],
			[{'column': 4, 'aggregation': google.visualization.data.avg, 'type': 'number'}]);
			var length = groupedData.getNumberOfRows();
			for(var i=0; i<length; i++)
			{
				var grade = groupedData.getValue(i,1);
				var major = groupedData.getValue(i,2);
				var school = groupedData.getValue(i,3);
				var avg = groupedData.getValue(i,4);
				var gradeStr = dino.help.intToGrade(grade);
				var majorStr = dino.help.intToMajor(major);
				var schoolStr = dino.help.intToSchool(school);
				var barName = gradeStr+" in "+majorStr+" at "+schoolStr;
				data.addRows([[barName, avg]]);
			}
			
			
			console.log("Creating DataView");
			// Next, create the object and get the rows 
			// corresponding to grade, major, and school.                                   
			var view = new google.visualization.DataView(data);
			
			//view.setRows();

			// Get a subset of the columns.                                                                            
			view.setColumns([0,1]);

			// Draw the chart for the initial academic year.                                                           
			chart.draw(view.toDataTable(), options);
		});
	}

	dino.viz.vizController = function(criteria) {
		      
        var view = new google.visualization.DataView(data);
        
        view.setRows(views[thisYear].getFilteredRows([{column: 2, value: thisYear}]));

        // Get a subset of the columns.                                                                            
        view.setColumns([0, 3]);

		var lastYear = thisYear.split('-')[1];
		options.title =  'Session Hours Provided by University of Portland Librarians in '.concat(lastYear);
		chart.draw(views[thisYear].toDataTable(), options);
	};
};

dino.viz();
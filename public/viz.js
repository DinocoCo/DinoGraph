/*
 * viz.js
 *
 * Defines:
 * - The data to be visualized in the chart.
 * - The options for the look of the chart to be drawn.
 * - How to draw the chart.
 *
 * @author: Tanya L. Crenshaw
 * @since: Jan 6, 2015
 */

//Extend namespace
var librs = librs || {};
librs.viz = {};

//Start module
librs.viz = function() {
 
	google.load('visualization', '1', {packages: ['corechart']});

	google.setOnLoadCallback(vizInit);

	// Define the variables to hold the entire fusion table,
	// and a collection of views, one for each year.
	var data;
	var totals = {};
	
	//Default criteria to narrow graph (show everything)
	var criteria = [];
	for(int i=0;i<4;i++) {
		criteria.push([librs.handle.all]);
	}

	// Define the variable to hold the chart.                                                                              
	var chart;                                                                         

	// Set the options for the chart to be drawn.  This include the
	// width, height, title, horizontal axis, vertical axis.  Finally
	// turn off the legend.
	var options = {
		width: 700,
		height: 400,
		title: 'Confidence with Research',
		hAxis: {
			title: 'Month',
			gridlines: {count: 12}
		},
		vAxis: {
			title: 'Confidence'
		},
		legend: { 
			position: 'none' 
		},
		animation: {
			"startup" : true,
			"duration" : 500
		}
	};

	function vizInit() {

		// Create a new viz object using the google API -- specifically,
		// we are going to make a column chart inside the div called ex0                                                   
		// in the html file.
		chart = new google.visualization.ColumnChart(document.getElementById('ex0'));


		// 9/19/2015 Corrected typo
		// Make the initial query to get the whole Fusion table. The Fusion
		// table’s ID is listed in red.                                                            
		var query = "SELECT Year, Major, School, Type, AveConfidence, Sessions FROM 1-OBa3j2heK1znLQ2jb3EpqYZ90i4ahW6Z6wih8Pd";

		var opts = {sendMethod: 'auto'};
		var queryObj = new google.visualization.Query('https://www.google.com/fusiontables/gvizdata?tq=', opts);


		// Send the query and handle the response by logging the data
		// to the console.                                                                
		queryObj.setQuery(query);
		queryObj.send(function(e) {
			data = e.getDataTable();

			console.log(data);

			// Create a view for academic year 2013-2014 that                                                          
			// is the first two columns of the data, just the                                                          
			// rows that have 2013-2014 for the value.                                                                 

			// First, get the textualized range of the year.                                                           
			

			// Next, create the object and get the rows 
			// corresponding to "thisYear".                                   
			var view = new google.visualization.DataView(data);
			for(int i=0;i<librs.handle.years.length;i++) {
				for(int j=0;j<librs.handle.majors.length;j++) {
					for(int k=0;k<librs.handle.schools.length;k++) {
						for(int l=0;l<librs.handle.types.length;l++) {
							var rows = view.getFilteredRows([
							{column: 1, value: librs.handle.years[i]},
							{column: 2, value: librs.handle.majors[j]},
							{column: 3, value: librs.handle.schools[k]},
							{column: 4, value: librs.handle.types[l]}]);
							
						}
					}
				}
			}
			

		    
			view.setRows();

			// Get a subset of the columns.                                                                            
			view.setColumns([0, 3]);

			// Draw the chart for the initial academic year.                                                           
			chart.draw(view.toDataTable(), options);
		});
	}

	librs.viz.vizController = function(thisYear) {
		console.log('Passed to visController: '.concat(thisYear));
		if(typeof views[thisYear] == 'undefined') {
			console.log('undefined year: '.concat(thisYear));
			// Next, create the object and get the rows 
			// corresponding to "thisYear".                                   
			views[thisYear] = new google.visualization.DataView(data);
		   
			views[thisYear].setRows(views[thisYear].getFilteredRows([{column: 2, value: thisYear}]));

			// Get a subset of the columns.                                                                            
			views[thisYear].setColumns([0, 3]);
			console.log('now defined year: '.concat(thisYear));
		}
		var lastYear = thisYear.split('-')[1];
		options.title =  'Session Hours Provided by University of Portland Librarians in '.concat(lastYear);
		chart.draw(views[thisYear].toDataTable(), options);
	};
};

librs.viz();
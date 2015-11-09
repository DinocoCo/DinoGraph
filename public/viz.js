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
	var criteria = [[1],[1],[11]];

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
		var query = "SELECT Year, Major, School, AveConfidence FROM 1XaesDw8HBPe2Uvx27FOlmzIzK94Fs6Ot6porY1u1";


		var opts = {sendMethod: 'auto'};
		var queryObj = new google.visualization.Query('https://www.google.com/fusiontables/gvizdata?tq=', opts);


		// Send the query and handle the response by logging the data
		// to the console.                                                                
		queryObj.setQuery(query);
		queryObj.send(function(e) {

			console.log("Sending query");
			rawData = e.getDataTable();

			console.log("Received "+rawData.getNumberOfRows()+" entries.");
			
			data = new google.visualization.DataTable();
			data.addColumn('string', 'Grade');
			data.addColumn('string', 'Major');
			data.addColumn('string', 'School');
			data.addColumn('string', 'BarName');
			data.addColumn('number', 'Average Confidence');

			var groups = [];
			if(criteria[0][0] == -1) {
				groups.push(0);
			}
			if(criteria[1][0] == -1) {
				groups.push(1);
			}
			if(criteria[2][0] == -1) {
				groups.push(2);
			}
			groups.push(3);
			console.log(rawData.getColumnLabel(0)+" "+rawData.getColumnLabel(1)+" "+rawData.getColumnLabel(2)+" "+rawData.getColumnLabel(3));
			var groupedData;
			if(groups.length > 1) {
				groupedData = google.visualization.data.group(rawData,groups,
				[{'column': 3, 'aggregation': google.visualization.data.avg, 'type': 'number'}]);
			}
			else {
				groupedData = rawData;
			}
			
			
			var allFilteredRows = [];
			var filteredRows = groupedData.getFilteredRows([{column: 2, value: 1},{column: 0, value: 1}]);
			
			/*for(var j=0; j<criteria[1].length; j++) {
				
				var filters = [];
				
				if(criteria[0][0] > 0) {
					filters.push({column: 0, value: criteria[0][0]});
				}
				if(criteria[1][j] > 0) {
					filters.push({column: 1, value: criteria[1][j]});
				}
				if(criteria[2][0] > 0) {
					filters.push({column: 2, value: criteria[2][0]});
				}
				
				if(filters.length > 0) {
					console.log(filters[0].column+" "+filters[1].column);
					var filteredRows = groupedData.getFilteredRows(filters);
					allFilteredRows = allFilteredRows.concat(filteredRows);
					console.log(filteredRows);
				}
			}
			allFilteredRows.sort();
			console.log("hi again");*/
			//if(allFilteredRows.length == 0)
			//{
			//	allFilteredRows[0] = 0;
			//}
			//
			//
			//var filteredRows = groupedData.getFilteredRows();
			var length = groupedData.getNumberOfRows();
			console.log("Received "+length+" unique rows. Have "+allFilteredRows.length+" rows after filter.");
			console.log(groupedData.getColumnLabel(0)+" "+groupedData.getColumnLabel(1)+" "+groupedData.getColumnLabel(2));

			
			for(var i=0; i<length; i++)
			{
				var grade = groupedData.getValue(i,0);
				var major = groupedData.getValue(i,1);
				var school = groupedData.getValue(i,2);
				var avg = groupedData.getValue(i,3);
				//var grade = groupedData.getValue(allFilteredRows[i],0);
				//var major = groupedData.getValue(allFilteredRows[i],1);
				//var school = groupedData.getValue(allFilteredRows[i],2);
				//var avg = groupedData.getValue(allFilteredRows[i],3);
				var gradeStr = dino.help.intToGrade(grade);
				var majorStr = dino.help.intToMajor(major);
				var schoolStr = dino.help.intToSchool(school);
				var barName = gradeStr+" in "+majorStr+" at "+schoolStr;
				data.addRows([[gradeStr,majorStr,schoolStr,barName, avg]]);
				//console.log(barName);
			}
			
			
			console.log("Creating DataView");
			// Next, create the object and get the rows 
			// corresponding to grade, major, and school.                                   
			var view = new google.visualization.DataView(data);
			
			//view.setRows();

			// Get a subset of the columns.                                                                            
			view.setColumns([3,4]);

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
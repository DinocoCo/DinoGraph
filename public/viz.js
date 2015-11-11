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

    var criteria = [[-1],[1,2,3,4,5],[11]];

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
        //  x: {
        //      criteria: {label: 'Criteria'}
        //  },
        //  y: {
        //      confidence: {label: 'Confidence'}
        //  }
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
        queryObj.send(function(e)
        {

            console.log("Sending query");
            rawData = e.getDataTable();

            console.log("Received "+rawData.getNumberOfRows()+" entries.");

            dino.viz.vizController(criteria);
			
        });
    };

    dino.viz.vizController = function(crit)
	{
		criteria = crit;
		
		var groups = [];
		
		// Group the rows where all is selected
		for(var i=0;i<criteria.length;i++)
		{
			if(criteria[i][0] !== -1) //Not sorted by all
			{
				groups.push(i);
			}
		}
		var groupedData = google.visualization.data.group(rawData,groups,
			[{'column': 3, 'aggregation': google.visualization.data.avg, 'type': 'number'}]);

		// Create new table with strings for display
		data = new google.visualization.DataTable();
		data.addColumn('string', 'BarName');
		data.addColumn('number', 'Average Confidence');
		
		var words = [""," in "," at "];
		var skipRow = false;
		
		for(var i=0; i<groupedData.getNumberOfRows(); i++)
		{
			var barName = "";
			var col = 0;
			
			for(var j=0; j<criteria.length; j++)
			{
				//Only consider a criteria if it wasn't grouped earlier
				if(criteria[j][0] !== -1)
				{
					var val = groupedData.getValue(i,col++);

					//Discard a row if it does not meet the specified criteria
					if(criteria[j].indexOf(val) == -1)
					{
						skipRow = true;
						continue;
					}
					
					if(barName) //Bar is not empty, so add words between major/grade
					{
						barName += words[j];
					}
					barName += dino.help.convertToString(val,j);
				}
			}

			if(skipRow)
			{
				skipRow = false;
				continue;
			}
			
			var avg = groupedData.getValue(i,col);
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
    };
};

dino.viz();
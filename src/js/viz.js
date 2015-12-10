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

    google.load('visualization', '1', {packages: ['corechart']});

    google.setOnLoadCallback(vizInit);
	
	dino.viz.loaded = false;
	
    // Define the variables to hold the entire fusion table,
    // and the processed data for viewing
    var data;
    var rawData;
	
	// Define the view that draws the data
	var view;

    //Default criteria to narrow graph (Show UP versus 3 other schools)

    var currentCriteria = [[-1],[1,2,3,4,5],[11]];

    // Define the variable to hold the chart.
    var chart;
	
	// Define variable to hold the element we are drawing on
	var canvas;
	
	// Define variable used to draw directly on the canvas
	var ctx;
	
	// Define variable that constrains the size and location of the canvas
	var overlay;

	//var initHeight = Math.max(300,.91*window.innerHeight-310);
	var legendContents;

    // Set the options for the chart to be drawn.  This include the
    // width, height, title, horizontal axis, vertical axis.  Finally
    // turn off the legend.
    var options = {
        width: 700,
        height: 400,
		backgroundColor: {
			fill:'transparent'
		},
		
        legend: {
            position: 'none'
        },
        animation: {
            "startup" : true,
            "duration" : 10
        }
    };

    function vizInit()
    {
        console.log("Initializing vis");

		canvas = document.getElementById('legend');
		
		overlay = document.getElementById('overlay');
		
		ctx = canvas.getContext("2d");
		
        // Create a new viz object using the google API -- specifically,
        // we are going to make a column chart inside the div called ex0
        // in the html file.
        chart = new google.visualization.ColumnChart(document.getElementById('ex0'));


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

            //Call the vizController to create a new data table and draw it
            dino.viz.vizController(currentCriteria);

        });
		
		dino.viz.loaded = true;
    };

    dino.viz.vizController = function(criteria)
    {
		// Group the rows where all is selected
		var groups = [];
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
        data.addColumn({type: 'string', role: 'style'});

        var words = [""," in "," at "];
        var skipRow = false;

        //Iterate through each row to process it
        for(var i=0; i<groupedData.getNumberOfRows(); i++)
        {
            var barName = "";
            var style = "";
            var col = 0;

            // Consider each criteria
            for(var j=0; j<criteria.length; j++)
            {
                // Only consider a criteria if it wasn't eliminated earlier
                if(criteria[j][0] !== -1)
                {
                    // Get the current criteria
                    var val = groupedData.getValue(i,col++);

                    // Discard a row if it does not match the criteria
                    if(criteria[j].indexOf(val) == -1)
                    {
                        skipRow = true;
                        continue;
                    }

                    // Bar is not empty, so add words between major/grade
                    if(barName)
                    {
                        barName += words[j];
                    }

                    barName += dino.help.convertToString(val,j);

                    // Add a semicolon to before the next style if it isn't
                    // empty already
                    if(style)
                    {
                        style += ";";
                    }
                    style += dino.help.convertToStyle(val,j);

                }
            }

            if(skipRow)
            {
                skipRow = false;
                continue;
            }

            //Create a new row if it gets this far

            //Convert to two decimals of precision to improve readability
            var avg = groupedData.getValue(i,col);
            avg = parseFloat(Math.round(avg * 100) / 100);

            data.addRows([[barName, avg, style]]);
        }

        console.log("Creating DataView");
        // Next, create the object and get the rows
        // corresponding to grade, major, and school.
		
        view = new google.visualization.DataView(data);

        //view.setRows();

        // Draw the chart for the initial academic year.
        chart.draw(view.toDataTable(), options);
		legendContents = null;
		dino.viz.drawLegend(criteria);
		currentCriteria = criteria;
    };
	
	dino.viz.draw = function(windowWidth,windowHeight)
    {
		var newHeight = Math.max(300,.91*windowHeight-310);
		if(newHeight)
		{
			options.height = newHeight;
		}
		
		var newWidth = Math.max(700,.91*windowWidth-310);
		if(newWidth)
		{
			options.width = newWidth;
		}
		
		chart.draw(view.toDataTable(), options);
		dino.viz.drawLegend(currentCriteria);
	}
	
	dino.viz.drawLegend = function(criteria)
	{
		var size = 10;
		var y = 1;
		
		//Clear the entire screen
		ctx.clearRect(0,0,100000,100000);
		var width = 0;
		
		if(!legendContents)
		{
			legendContents = [];
			for(var i=1;i<criteria.length;i++)
			{
				for(var j=0;j<criteria[i].length;j++)
				{
					//Do not have a legend for all and major
					if(criteria[i][j] !== -1)
					{
						
						var name =  dino.help.convertToString(criteria[i][j],i);
						var style = dino.help.convertToStyle(criteria[i][j],i);
						
						// Make sure style and name are defined
						if(style && name)
						{
							//Hex format
							if(style.length > 7 && style.charAt(style.length-7) == '#')
							{
								style = style.substring(style.length-7);
							}
							//RGB format
							else if(style.length > 15 && style.substring(12,15) == "rgb")
							{
								style = style.substring(12);
							}
							
							//Create new object to store information about what we will draw
							var element = {};
							element.name = name;
							element.style = style;
							element.height = y;
							legendContents.push(element);
							y+=2;
							
							// Calculate the total width of the element and store the
							// largest one
							var w = ctx.measureText(name).width + size*2.5;
							if(width < w)
							{
								width = w;
							}
						}
					}
				}
				y++;
			}
		}
		canvas.height = (y-1)*size;
		canvas.width = width+size;
		overlay.style.top = ((options.height-canvas.height)/2)+"px";
		overlay.style.left = (0.9*options.width)+"px";
		
		for(var i=0;i<legendContents.length;i++)
		{
			ctx.beginPath();
			ctx.fillStyle=legendContents[i].style;
			ctx.fillRect(size,size*legendContents[i].height,size,size);
			ctx.fillStyle="black";
			ctx.fillText(legendContents[i].name,size*2.5,size*legendContents[i].height+size);
			ctx.stroke();
		}
	}
};

dino.viz();
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

    // Define the variables to hold the entire fusion table,
    // and a collection of views, one for each year.
    var data;
    var rawData;

    //Default criteria to narrow graph (Show UP versus 3 other schools)

    var initCriteria = [[-1],[1,2,3,4,5],[11]];

    // Define the variable to hold the chart.
    var chart;

    // Set the options for the chart to be drawn.  This include the
    // width, height, title, horizontal axis, vertical axis.  Finally
    // turn off the legend.
    var options = {
        width: 700,
        height: 400,
        //chart: {
            title: 'Confidence with Research',
        //},
        //bars: 'vertical',
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
            dino.viz.vizController(initCriteria);

        });
    };

    dino.viz.vizController = function(criteria)
    {
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

            //Convert to two decimals of precision
            var avg = groupedData.getValue(i,col);
            avg = parseFloat(Math.round(avg * 100) / 100);


            data.addRows([[barName, avg, style]]);
        }

        console.log("Creating DataView");
        // Next, create the object and get the rows
        // corresponding to grade, major, and school.
        var view = new google.visualization.DataView(data);

        //view.setRows();

        // Get a subset of the columns.
        view.setColumns([0,1,2]);

        // Draw the chart for the initial academic year.
        chart.draw(view.toDataTable(), options);
    };
};

dino.viz();
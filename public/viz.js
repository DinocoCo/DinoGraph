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
	var criteria = [[-1],[-1],[1,2,3]];
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
		axes: {
			x: {
				criteria: {label: 'Criteria'}
			},
			y: {
				confidence: {label: 'Confidence'}
			}
		},

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
			data.addColumn('string', 'Grade');
			data.addColumn('string', 'Major');
			data.addColumn('string', 'School');
			data.addColumn('number', 'Average Confidence');
			data.addColumn('string', 'BarName');
			data.addColumn('string', 'FillColor');
			data.addColumn('string', 'StrokeColor');
			console.log("Adding columns to new table");

            // Sort the data indexes by grade, then major, then school
            var rowInds = rawData.getSortedRows([{column: 1},{column: 2},{column: 3}]);

			var count = 0;
            for(var i=0; i<criteria[0].length; i++)
            {
				for(var j=0; j<criteria[1].length; j++)
                {
					for(var k=0; k<criteria[2].length; k++)
                    {
						console.log("Getting data count:"+count+" i:"+i+", j:"+j+", k:"+k+".");
						console.log("Current row index:"+rowInds[count]+" type "+ typeof rowInds[count])
                        var grade = rawData.getValue(rowInds[count],1);
                        var major = rawData.getValue(rowInds[count],2);
                        var school = rawData.getValue(rowInds[count],3);
                        console.log("Grade:"+grade+"\t"+"Criteria:"+criteria[0][i]+"\n"+
									" Major:"+major+"\t"+"Criteria:"+criteria[1][j]+"\n"+
									"School:"+school+"\t"+"Criteria:"+criteria[2][k]);
						
                        var sum = 0;

                        var c = 0;
                        do
                        {
                            //get confidance and add to sum
                            sum += rawData.getValue(rowInds[count++],4);
							c++;
                        } while((grade == criteria[0][i] || grade < 0) && 
                            (major == criteria[1][j] || major < 0) &&
                            (school == criteria[2][k] || school < 0))

						if(sum !== 0 && c !== 0)
						{
							// Divide sum by the count 
							var avg = sum/c;
							var row = [];
							var gradeStr = dino.help.intToGrade(grade);
							var majorStr = dino.help.intToMajor(major);
							var schoolStr = dino.help.intToSchool(school);
							var barName = gradeStr+" in "+majorStr+" at "+schoolStr;
							row.push(gradeStr);
							row.push(majorStr);
							row.push(schoolStr);
							row.push(avg);
							row.push(barName);
							console.log("Found "+c+" entries at "+barName);
							row.push('#b87333');
							row.push('#b87333');
							data.addRows([row]);
							
						}
					}
				}
			}
			console.log("Creating DataView");
			// Next, create the object and get the rows 
			// corresponding to grade, major, and school.                                   
			var view = new google.visualization.DataView(data);
			
			//view.setRows();

			// Get a subset of the columns.                                                                            
			view.setColumns([0,1,2,3]);

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
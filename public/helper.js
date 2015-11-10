//This file will contain helper functions


//Create namespace
var dino = dino || {};
dino.help = {};

dino.help = function() {
    
    dino.help.parseToIntArr = function(strs)
	{
        var intArr = [];
        for(var i=0; i<strs.length; i++)
		{
            intArr[i] = parseInt(strs[i]);
        }
		intArr.sort();
        return intArr;
    };
	
	dino.help.intToGrade = function(grade)
	{
		var gradeInt = parseInt(grade,10);
		switch(gradeInt)
		{
			case -1:
				return "All";
			case 0:
				return "Freshman";
			case 1:
				return "Sophomore";
			case 2:
				return "Junior";
			case 3:
				return "Senior";
			case 4:
				return "Graduate";
			default:
				return "";
		}
    };
	
	dino.help.intToMajor = function(major)
	{
		var majorInt = parseInt(major,10);
		switch(majorInt)
		{
			case -1:
				return "All";
			case 0:
				return "Life Sciences";
			case 1:
				return "Business";
			case 2:
				return "Engineering and Math";
			case 3:
				return "Humanities, Arts, and Sciences";
			case 4:
				return "Vocational";
			default:
				return "";
		}
    };
	
	dino.help.intToSchool = function(school)
	{
		var schoolInt = parseInt(school,10);
		switch(schoolInt)
		{
			case -3:
				return "Private";
			case -2:
				return "Public";
			case -1:
				return "All";
			case 1:
				return "Angelo State University";
			case 2:
				return "Centenary College of Louisiana";
			case 3:
				return "Lake Superior State University";
			case 4:
				return "Lawson state community college";
			case 5:
				return "Mountain Empire Community College";
			case 6:
				return "Otero Junior College";
			case 7:
				return "Pacific Lutheran University";
			case 8:
				return "Saint Mary's College of California";
			case 9:
				return "Southwestern Community College";
			case 10:
				return "Trine University";
			case 11:
				return "University of Portland";
			case 12:
				return "Virginia Commonwealth University Qatar";
			default:
				return "";
		}
    };
};

dino.help();
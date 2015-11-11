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
	
	dino.help.intToGrade = ["",
							"",
							"Freshman",
							"Sophomore",
							"Junior",
							"Senior",
							"Graduate"];
	
	dino.help.intToMajor = ["",
							"Life Sciences",
							"Business",
							"Engineering and Math",
							"Humanities, Arts, and Sciences",
							"Vocational"];
	
	dino.help.intToSchool = ["",
							"Angelo State University",
							"Centenary College of Louisiana",
							"Lake Superior State University",
							"Lawson state community college",
							"Mountain Empire Community College",
							"Otero Junior College",
							"Pacific Lutheran University",
							"Saint Mary's College of California",
							"Southwestern Community College",
							"Trine University",
							"University of Portland",
							"Virginia Commonwealth University Qatar",
							"Private",
							"Public"];
	
	dino.help.convertToString = function(num,type)
	{
		switch(type)
		{
			case 0:
				return dino.help.intToGrade[num];
			case 1:
				return dino.help.intToMajor[num];
			case 2:
				return dino.help.intToSchool[num];
			default:
				return "";
		}
	};
	dino.help.convertToInt = function(str,type)
	{
		switch(type)
		{
			case 0:
				return dino.help.intToGrade.indexOf(str);
			case 1:
				return dino.help.intToMajor.indexOf(str);
			case 2:
				return dino.help.intToSchool.indexOf(str);
			default:
				return "";
		}
	}
	
	
	
};

dino.help();
//This file will contain helper functions


//Create namespace
var dino = dino || {};
dino.help = {};

dino.help = function() {

    //Arrays of each criteria
    //index corresponds to value in fusion table
    dino.help.intToGrade = ["",
                            "Freshman",
                            "Sophomore",
                            "Junior",
                            "Senior",
                            "Graduate",
							"Post-Grad"];

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
                            "Private Universities",
                            "Public Universities"];

    //Arrays of the styles for each criteria
    //index corresponds to value in fusion table
    dino.help.gradeToStyle = ["",
                            "stroke-color: #1b5e20",
                            "stroke-color: #607d8b",
                            "stroke-color: #ff6f00",
                            "stroke-color: #e65100",
                            "stroke-color: #3e2723",
							"stroke-color: #008696"];

    dino.help.majorToStyle = ["",
                            "stroke-width: 2",
                            "stroke-width: 2",
                            "stroke-width: 2",
                            "stroke-width: 2",
                            "stroke-width: 2"];

    dino.help.schoolToStyle = ["",
                            "fill-color: rgb(36, 83, 150)",
                            "fill-color: rgb(138, 21, 40)",
                            "fill-color: rgb(0, 85, 150)",
                            "fill-color: rgb(248, 199, 40)",
                            "fill-color: rgb(221, 0, 54)",
                            "fill-color: rgb(255, 255, 255)",
                            "fill-color: rgb(0, 0, 0)",
                            "fill-color: rgb(216, 31, 38)",
                            "fill-color: rgb(171, 3, 51)",
                            "fill-color: rgb(7, 53, 87)",
                            "fill-color: rgb(51, 1, 112)",
                            "fill-color: rgb(255, 185, 0)",
                            "fill-color: rgb(130, 130, 130)",
                            "fill-color: rgb(98, 130, 41)"];


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
        return "";
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
        return "";
    }

    dino.help.convertToStyle = function(num,type)
    {
        switch(type)
        {
            case 0:
                return dino.help.gradeToStyle[num];
            case 1:
                return dino.help.majorToStyle[num];
            case 2:
                return dino.help.schoolToStyle[num];
            default:
                return "";
        }
        return "";
    }


};

dino.help();
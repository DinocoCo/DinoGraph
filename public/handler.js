//This file will handle user input


//Create namespace
var dino = dino || {};
dino.handle = {};

dino.handle = function {
    
    var dino.handle.all = -1;
    
    dino.handle.fetch = function {
        var dino.handle.majors = dino.help.parseToIntArr($('#major').val());
        var dino.handle.years = dino.help.parseToIntArr($('#year').val());
        var dino.handle.schools = dino.help.parseToIntArr($('#school').val());
        var dino.handle.types = dino.help.parseToIntArr($('#type').val());
        
        var dino.handle.criteria = [majors, years, schools, types];
        var criteriaMaxLen = [5, 5, 12, 2];
        
        //Simplify situations where all the elements of a catogory are selected
        for(int i=0;i<criteria.length;i++)
        {
            //All criteria were selected
            if(criteria[i].indexOf(-1) != -1 || 
               criteria[i].length == criteriaMaxLen[i]) {
                criteria[i] = [dino.handle.all];
            }
        }
    };
};
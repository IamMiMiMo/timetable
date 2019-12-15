var colorList = ["gray","red","orange","yellow","green","teal","blue","indigo","purple","pink"];
const DAYS = [null,"Monday","Tuesday","Wednesday","Thurday","Friday","Saturday","Sunday"];
var courseList = [
	{
		course:"Test1",
		session:"L1",
		day:2,
		period:2
	},
	{
		course:"Test2",
		session:"L11",
		day:4,
		period:1
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(0,5),
		day:random(1,7),
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:random(1,7),
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:random(1,7),
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:random(1,7),
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:random(1,7),
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:random(1,7),
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:random(1,7),
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(0,5),
		day:random(1,7),
		period:random(1,2)
	}
];

//delete table cell function
var table = document.getElementById("timetable");
if (table != null) {
    for (var i = 1; i < table.rows.length; i++) {
    	if (i==2){
    		continue;
    	}
        for (var j = 1; j < table.rows[i].cells.length; j++)
        table.rows[i].cells[j].onclick = function () {
        	var result = confirm("Are you sure to delete?");
        	if(result){
	            this.innerHTML = "";
	        }else{
	        	return;
	        }
        };
    }
}

function addToTable(index,color){
	courseDay = courseList[index].day;
	courseCode = courseList[index].course;
	coursePeriod = courseList[index].period;
	table = document.getElementById("timetable");
	if(coursePeriod >= 2){
		coursePeriod += 1;
	}
	for(var i = 0; i < table.rows[0].cells.length; i++){
		if(i == courseDay){
			table.rows[coursePeriod].cells[courseDay].innerHTML = courseCode;
			table.rows[coursePeriod].cells[courseDay].classList.add("bg-" + color + "-200");
		}
	}
}

function initOptions(){
	for(var i = 0; i < courseList.length; i++){
		var color = colorList[random(0,9)];

		var card = document.createElement('div');
		card.classList.add("max-w-full","block","cursor-pointer","rounded","shadow-lg","px-4" ,"py-6" ,"m-4" ,"border" ,"border-" + color + "-500" ,"bg-" + color + "-200", "hover:bg-" + color + "-300");
		card.id = courseList[i].course + "-" + courseList[i].session;
		card.addEventListener("click", addToTable.bind(null,i,color) );
		document.getElementById("optionColumn").appendChild(card);

		var title = document.createElement('p');
		title.classList.add("text-xl","font-bold","mb-2");
		title.innerHTML = courseList[i].course;
		document.getElementById(card.id).appendChild(title);

		var day = document.createElement('div');
		day.classList.add("inline-block","px-3","py-1","mr-2","font-semibold","rounded-full","bg-" + color + "-100","text-gray-700");
		day.innerHTML = DAYS[courseList[i].day];
		document.getElementById(card.id).appendChild(day);

		var session = document.createElement('div');
		session.classList.add("inline-block","px-3","py-1","font-semibold","rounded-full","bg-" + color + "-100","text-gray-700");
		session.innerHTML = courseList[i].session;
		document.getElementById(card.id).appendChild(session);
		
	}
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
var colorList = ["gray","red","orange","yellow","green","teal","blue","indigo","purple","pink"];
const DAYS = [null,"Monday","Tuesday","Wednesday","Thurday","Friday","Saturday","Sunday"];
var courseList = [
	{
		course:"Test1",
		session:"L1",
		day:[2,4],
		period:2
	},
	{
		course:"Test2",
		session:"L11",
		day:[4],
		period:2
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(0,5),
		day:[random(1,7)],
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:random(1,2)
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(0,5),
		day:[random(1,7)],
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
        		removeCourse(this.innerHTML);
	            this.innerHTML = "";
	        }else{
	        	return;
	        }
        };
    }
}

function addToTable(index,color){
	var courseDayList = courseList[index].day;
	var courseCode = courseList[index].course;
	var coursePeriod = courseList[index].period;
	var table = document.getElementById("timetable");
	if(coursePeriod >= 2){
		coursePeriod += 1;
	}
	//delete without re-delete the new course
	removeCourse(courseCode);
	for (var n = 0; n < courseDayList.length; n++){
		for(var i = 0; i < table.rows[coursePeriod].cells.length; i++){
			if(i == courseDayList[n]){
				var cell = table.rows[coursePeriod].cells[courseDayList[n]];
				
				//delete all associated courses in occupied cell
				if (cell.innerHTML != courseCode){
					removeCourse(cell.innerHTML);
				}
				cell.innerHTML = courseCode;
				cell.classList.add("bg-" + color + "-200");
				saveTable(coursePeriod,courseDayList[n],color);
			}
		}
	}
	
}

function removeCourse(code){
	var table = document.getElementById("timetable");
	for(var row = 1; row < table.rows.length; row++){
		for(var col = 1; col < table.rows[row].cells.length; col++){
			var cell = table.rows[row].cells[col];
			console.log(cell.innerHTML);
			if(cell.innerHTML == code){
				cell.innerHTML = "";
				cell.className = cell.className.replace(/\bbg-.*?\b/g, '');
				localStorage.setItem("row-" + row + "-col-" + col,'');
			}
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
		day.innerHTML += DAYS[courseList[i].day[0]];
		for (var n = 1; n < courseList[i].day.length; n++){
			day.innerHTML += "/" + DAYS[courseList[i].day[n]];
		}
		document.getElementById(card.id).appendChild(day);

		var session = document.createElement('div');
		session.classList.add("inline-block","px-3","py-1","font-semibold","rounded-full","bg-" + color + "-100","text-gray-700");
		session.innerHTML = courseList[i].session;
		document.getElementById(card.id).appendChild(session);
	}
	loadTable();
}

function saveTable(row,col,color){
	var table = document.getElementById("timetable");
	localStorage.setItem("row-" + row + "-col-" + col,JSON.stringify([table.rows[row].cells[col].innerHTML,color]));
}

function loadTable(){
	var table = document.getElementById("timetable");
	for(var row = 1; row < table.rows.length; row++){
		if (row==2){
			continue;
		}
		for(var col = 1; col < table.rows[row].cells.length; col++){
			var items = JSON.parse(localStorage.getItem("row-" + row + "-col-" + col));
			if (items != null){
				table.rows[row].cells[col].innerHTML = items[0];
				table.rows[row].cells[col].classList.add("bg-" + items[1] + "-200" );
			}
		}
	}
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
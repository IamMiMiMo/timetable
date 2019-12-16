var colorList = ["gray","red","orange","yellow","green","teal","blue","indigo","purple","pink"];
const DAYS = [null,"Monday","Tuesday","Wednesday","Thurday","Friday","Saturday","Sunday"];
var courseList = [
	{
		course:"Test1",
		session:"L1",
		day:[2,4],
		period:[1,2]
	},
	{
		course:"Test2",
		session:"L11",
		day:[4],
		period:[2]
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(0,5),
		day:[random(1,7)],
		period:[random(1,2)]
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:[random(1,2)]
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:[random(1,2)]
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:[random(1,2)]
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:[random(1,2)]
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:[random(1,2)]
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(1,5),
		day:[random(1,7)],
		period:[random(1,2)]
	},
	{
		course:"RAND" + random(0,9999),
		session:"L" + random(0,5),
		day:[random(1,7)],
		period:[random(1,2)]
	}
];

function init(){
	initOptions();
	createTable();
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
}

function deleteCell(row,col){
	cell = document.getElementById("timetable").rows[row].cells[col];
	if (cell.innerHTML != ''){
    	var result = confirm("Are you sure to delete?");
    	if(result){
    		removeCourse(cell.innerHTML);
            cell.innerHTML = "";
        }
	}
}

function addToTable(index,color){
	var courseDayList = courseList[index].day;
	var courseCode = courseList[index].course;
	var coursePeriodList = courseList[index].period;
	var table = document.getElementById("timetable");
	//delete without re-delete the new course
	removeCourse(courseCode);
	for(var x = 0; x < coursePeriodList.length; x++){
		for (var n = 0; n < courseDayList.length; n++){
			var cell = null;
			try {
				cell = table.rows[coursePeriodList[x]].cells[courseDayList[n]];
			}
			catch(err) {
			  	removeCourse(courseCode);
				alert("Invalid session(s)!");
				return;
			}
			//delete all associated courses in occupied cell
			if (cell.innerHTML != courseCode){
				removeCourse(cell.innerHTML);
			}
			cell.innerHTML = courseCode;
			cell.classList.add("bg-" + color + "-200");
			saveTable(coursePeriodList[x],courseDayList[n],color);
		}

	}
}

function removeCourse(code){
	var table = document.getElementById("timetable");
	for(var row = 1; row < table.rows.length; row++){
		for(var col = 1; col < table.rows[row].cells.length; col++){
			var cell = table.rows[row].cells[col];
			if(cell.innerHTML == code){
				cell.innerHTML = "";
				cell.className = cell.className.replace(/\bbg-.*?\b/g, '');
				localStorage.removeItem("row-" + row + "-col-" + col);
			}
		}
	}
}

function createTable(){
	var numberOfSessions = localStorage.getItem("numberOfSessions");
	while(numberOfSessions == null || isNaN(numberOfSessions)){
		numberOfSessions = prompt("Please enter the number of lessons", "");
	}
	localStorage.setItem("numberOfSessions",numberOfSessions);
	table = document.getElementById("timetable");
	//number of session + 1 = total row of table
	for (var numberOfRow = 1; numberOfRow <= numberOfSessions; numberOfRow++){
		row = table.insertRow(numberOfRow);
		var cellList = [];
		cellList[0] = row.insertCell(0);
		cellList[0].innerHTML = "P" + numberOfRow;
		cellList[0].classList.add("border","px-4","py-2","text-center","py-4");
		for (var col = 1; col < table.rows[0].cells.length; col++){
			cellList[col]  = row.insertCell(col);
			cellList[col].classList.add("border","px-4","py-2","text-center","py-4");
		}
	}
	addTableCellClickListener();
	loadTable();
}

function addTableCellClickListener(){
	var table = document.getElementById("timetable");
	if (table != null) {
	    for (var i = 1; i < table.rows.length; i++) {
	        for (var j = 1; j < table.rows[i].cells.length; j++){
	        	 table.rows[i].cells[j].addEventListener("click", deleteCell.bind(null,i,j) );
		    }
	    }
	}
}

function clearTable(){
	var table = document.getElementById("timetable");
	for(var row = 1; row < table.rows.length; row++){
		for(var col = 1; col < table.rows[row].cells.length; col++){
			var cell = table.rows[row].cells[col];
				cell.innerHTML = "";
				cell.className = cell.className.replace(/\bbg-.*?\b/g, '');
				localStorage.removeItem("row-" + row + "-col-" + col);
		}
	}
}

function resetTable(){
	var confirmed = confirm("Are you sure to reset the timetable?");
	if (confirmed){
		clearTable();
		//var numberOfSessions = localStorage.getItem("numberOfSessions");
		var table = document.getElementById("timetable");
		for (var i = table.rows.length-1;i > 0; i--){
			table.deleteRow(i);
		}
		localStorage.removeItem("numberOfSessions");
		createTable();
	}
}

function saveTable(row,col,color){
	var table = document.getElementById("timetable");
	localStorage.setItem("row-" + row + "-col-" + col,JSON.stringify({
		"course":table.rows[row].cells[col].innerHTML,
		"color":color
	}));
}

function loadTable(){
	var table = document.getElementById("timetable");
	for(var row = 1; row < table.rows.length; row++){
		for(var col = 1; col < table.rows[row].cells.length; col++){
			items = JSON.parse(localStorage.getItem("row-" + row + "-col-" + col));		
			if (items != undefined || items != null){
				table.rows[row].cells[col].innerHTML = items.course;
				table.rows[row].cells[col].classList.add("bg-" + items.color + "-200" );
			}
		}
	}
}



//utilities

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
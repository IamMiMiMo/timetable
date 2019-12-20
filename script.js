var colorList = ["gray","red","orange","yellow","green","teal","blue","indigo","purple","pink"];
const DAYS = [null,"Monday","Tuesday","Wednesday","Thurday","Friday","Saturday","Sunday"];
var courseList = [
	/*{
		course:"Test1",
		session:"L1",
		day:[2,4],
		period:[1,2]
	},*/
];

function init(){
	createTable();
	initPeriodCheckbox();
	courseList = JSON.parse(localStorage.getItem("courseList"));
	if (courseList != undefined && courseList != null && courseList.length > 0){
		refreshOptions();
	}else{
		courseList = [];
	}
}

function refreshOptions(){
	document.getElementById("optionColumn").innerHTML = "";
	for(var i = 0; i < courseList.length; i++){
		var color = colorList[random(0,9)];

		var card = document.createElement('div');
		card.classList.add("max-w-full","block","cursor-pointer","rounded","shadow-lg","px-4" ,"py-6" ,"m-4" ,"border" ,"border-" + color + "-500" ,"bg-" + color + "-200", "hover:bg-" + color + "-300");
		card.id = i;
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

function saveOptions(){
	localStorage.setItem("courseList",JSON.stringify(courseList));
}

function initPeriodCheckbox(){
	var numberOfPeriods = localStorage.getItem("numberOfPeriods");
	var div = document.getElementById("periodCheckbox")
	for (var i=0; i<numberOfPeriods; i++){
		div.innerHTML += '<div class="block"><input class="leading-tight mr-2" type="checkbox" id="checkboxP' + i +'" name="periodCheckbox"><label class="text-sm select-none" for="checkboxP'
			+ i + '">P' + (i+1) +'</label></input></div>'
	}
}

function course(course,session,day,period){
	this.course = course;
	this.session = session;
	this.day = day;
	this.period = period;
}

function addToCourseList(){
	var form  = document.forms.courseForm;
	var days = [];
	var dayCheckboxes = document.getElementsByName("dayCheckbox");
	for(var i=0, n=dayCheckboxes.length;i<n;i++) {
		if (dayCheckboxes[i].checked){
			days.push(i+1);
		}
	}
	var periods = [];
	periodCheckboxes = document.getElementsByName("periodCheckbox");
	for(var i=0, n=periodCheckboxes.length;i<n;i++) {
		if (periodCheckboxes[i].checked){
			periods.push(i+1);
		}
	}
	var newCourse = new course(form.courseName.value,"L1",days,periods);
	courseList.push(newCourse);
	addToTable(courseList.length-1,"red");
	refreshOptions();
	saveOptions();
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
	var numberOfPeriods = localStorage.getItem("numberOfPeriods");
	while(numberOfPeriods == null || isNaN(numberOfPeriods)){
		numberOfPeriods = prompt("Please enter the number of lessons", "");
	}
	localStorage.setItem("numberOfPeriods",numberOfPeriods);
	table = document.getElementById("timetable");
	//number of session + 1 = total row of table
	for (var numberOfRow = 1; numberOfRow <= numberOfPeriods; numberOfRow++){
		row = table.insertRow(numberOfRow);
		var cellList = [];
		var cell = document.createElement("th");
    	cellList[0] = row.appendChild(cell);
		//cellList[0] = row.insertCell(0);
		cellList[0].innerHTML = "P" + numberOfRow;
		cellList[0].classList.add("border","px-4","py-2","text-center","py-4","left-0","bg-white","sticky","border-separate");
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
		var table = document.getElementById("timetable");
		for (var i = table.rows.length-1;i > 0; i--){
			table.deleteRow(i);
		}
		localStorage.removeItem("numberOfPeriods");
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

function hideMenu(){
	var menu = document.getElementById('menuContent');
	if (menu.classList.contains("hidden")){
		menu.classList.replace("hidden","block");
	}else{
		menu.classList.replace("block","hidden");
	}
}
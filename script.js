const COLORLIST = ["gray","red","orange","yellow","green","teal","blue","indigo","purple","pink"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thurday","Friday","Saturday"];
var courseList = [
	/*{
		course:"Test1",
		day:[2,4],
		period:[1,2],
		color:2
	},*/
];

//add courseList from localStorage

function init(){
	courseList = JSON.parse(localStorage.getItem("courseList"));
	var timeObj = JSON.parse(localStorage.getItem("timeObj"));
	if (courseList == null || timeObj == null){
		courseList = [];
		showCreateTableForm();
	}else{
		var numberOfLesson = calculateNumberOfLesson(timeObj.startTime, timeObj.endTime, timeObj.interval);
		createTable(numberOfLesson);
		calculateNumberOfLesson(numberOfLesson);
		loadTimetable(courseList);
		loadHistory(courseList);
	}
}

//after clicked the "create table" button

function createTableButton(){
	var startTime = document.getElementById("startTime").value;
	var endTime = document.getElementById("endTime").value;
	var interval = parseInt(document.getElementById("lessonInterval").value);
	if (isNaN(interval)){
		notify("red","Invalid interval");
		return;
	}
	document.getElementById('createTableForm').classList.replace('block','hidden');
	var timeObj = {startTime:startTime, endTime:endTime, interval:interval}
	localStorage.setItem("timeObj",JSON.stringify(timeObj));
	var numberOfLesson = calculateNumberOfLesson(timeObj.startTime, timeObj.endTime, timeObj.interval);
	saveCourseList();
	createTable(numberOfLesson);
}

//load from courseList variable

function createTable(lessons){
	var table = document.getElementById("timetable");
	for (var row = 1; row <= lessons; row++){
		var newRow = table.insertRow(row);
		var cellList = [];
		var cell = document.createElement("th");
    	cellList[0] = newRow.appendChild(cell);
		//cellList[0] = row.insertCell(0);
		cellList[0].innerHTML = document.getElementById("checkboxP" + (row-1) + "Label").innerHTML;
		cellList[0].classList.add("border","px-4","py-2","text-center","py-4","left-0","bg-white","sticky","border-separate");
		for (var col = 1; col < table.rows[0].cells.length; col++){
			cellList[col]  = newRow.insertCell(col);
			cellList[col].classList.add("border","px-4","py-2","text-center","py-4");
		}
	}
	addTableCellClickListener();
}

function loadTimetable(){
	//assume courses have no conflict
	var numberOfCourse = courseList.length;
	for (var index = 0; index < numberOfCourse; index++){
		var course = courseList[index].course;
		var dayList = courseList[index].day;
		var periodList = courseList[index].period;
		var color = courseList[index].color;
		for (var day = 0; day < dayList.length; day++){
			for (var period = 0; period < periodList.length; period++){
				var cell = document.getElementById("timetable").rows[periodList[period]].cells[dayList[day]];
				cell.innerHTML = course;
				cell.classList.add("bg-" + color + "-200");
			}
		} 
	}
}

function loadHistory(){
	//disabled
}

//add course

function addCourse(){
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
	var color = COLORLIST[random(0,9)];
	//remove duplicated or collided course exist in timetable
	checkDuplicate(form.courseName);
	checkCollide(days,periods);
	//add and push course into courseList
	var newCourse = new course(form.courseName.value,days,periods,color);
	courseList.push(newCourse);
	//save after modified courseList;
	saveCourseList();
	clearTable();
	loadTimetable();
}

//validate data

function checkDuplicate(courseName){
	//check name duplicate
	for(var i = 0; i < courseList.length; i++){
		if(courseList[i].course == courseName){
			courseList.splice(i,1);
		}
	}
}

function checkCollide(dayList,periodList){
	//check day,period duplicate
	for(var i = 0; i < courseList.length; i++){
		dayLoop:
		for(var dayIndex = 0; dayIndex < dayList.length; dayIndex++){
			for (var periodIndex = 0; periodIndex < periodList.length; periodIndex++){
				if(courseList[i].day.includes(dayList[dayIndex]) && courseList[i].period.includes(periodList[periodIndex])){
					courseList.splice(i,1);
					break dayLoop;
				}
			}
		}
	}
}

//time component

function calculateNumberOfLesson(startTime,endTime,interval){
	startTime += '';
	endTime += '';
	var startTimeArray = startTime.split(":").map(Number);
	var endTimeArray = endTime.split(":").map(Number);
	var counter = 0;
	var startTime;
	while(endTimeArray[0]*60+endTimeArray[1] > startTimeArray[0]*60+startTimeArray[1]){
		var beginTime = startTime; //save current startTime to begin time
		startTime = AddMinutes(startTime,interval); // return string and find the next start time / current end time
		initPeriodCheckbox(counter,beginTime,startTime);
		counter++;
		console.log(startTime);
		startTimeArray = startTime.split(":").map(Number);
	}
	return counter;
}

//removal

function deleteCell(row,col){
	cell = document.getElementById("timetable").rows[row].cells[col];
	if (cell.innerHTML != ''){
		var result = confirm("Are you sure to delete?");
    	if(result){
			deleteCourse(cell.innerHTML);
			clearTable();
			//courseList saved in deleteCourse()
			loadTimetable();
		}
	}
}

function deleteCourse(courseName){
	for(var i = 0; i<courseList.length; i++){
		if(courseName == courseList[i].course){
			courseList.splice(i,1);
		}
	}
	saveCourseList();
}

function clearTable(){
	var table = document.getElementById("timetable");
	for (var row = 1; row < table.rows.length; row++){
		for (var col = 1; col < table.rows[0].cells.length; col++){
			cell = table.rows[row].cells[col];
			cell.innerHTML = '';
			removeClassStartWith('bg-',cell);
		}
	}
}

function cleanTable(){
	clearTable();
	courseList = [];
	saveCourseList();
}

function resetTable(){
	courseList = null;
	localStorage.removeItem("courseList");
	localStorage.removeItem("timeObj");
	var table = document.getElementById("timetable");
	for (var i = table.rows.length-1;i > 0; i--){
		table.deleteRow(i);
	}
	var div = document.getElementById("periodCheckbox").innerHTML = '';
	init();
}

//storage related function

function saveCourseList(){
	localStorage.setItem("courseList",JSON.stringify(courseList));
}

//utilities

function showCreateTableForm(){
	var form = document.getElementById('createTableForm');
	form.classList.replace("hidden","block");
}

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

function initPeriodCheckbox(index,startTime,endTime){
	var div = document.getElementById("periodCheckbox");
	div.innerHTML += '<div class="block"><input class="leading-tight mr-2" type="checkbox" id="checkboxP' + index +'" name="periodCheckbox"><label id="checkboxP' + index +'Label" class="text-sm select-none" for="checkboxP'
		+ index + '">' + startTime + '-' + endTime +'</label></input></div>';
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

function course(course,day,period,color){
	this.course = course;
	this.day = day;
	this.period = period;
	this.color = color;
}

function removeClassStartWith(prefix,el){
	var classes = el.className.split(" ").filter(c => !c.startsWith(prefix));
	el.className = classes.join(" ").trim();
}

function AddMinutes(startTime, minutes) {
	//var minutes = parseInt(minutes);
    var startTimeArray = startTime.split(":").map(Number);
    var m = (startTimeArray[1] + minutes) % 60;
    var h = startTimeArray[0] + Math.floor( (startTimeArray[1] + minutes) / 60);
    if (m < 10){
    	m = '0' + m;
    }
    if (h < 10){
    	h = '0' + h;
    }
    return h + ":" + m;
}

function notify(color,message){
	var alertBanner = document.getElementById("alertBanner");
	if (alertBanner.classList.contains("block")){
		alertBanner.classList.replace("hidden","block");
	}
	removeClassStartWith("bg-",alertBanner);
	removeClassStartWith("border-",alertBanner);
	removeClassStartWith("text-",alertBanner);
	alertBanner.classList.add("bg-" + color + "-100");
	alertBanner.classList.add("border-" + color + "-500");
	alertBanner.classList.add("text-" + color + "-900");
	document.getElementById("alertMessage").innerHTML = message;
	alertBanner.classList.replace("hidden","block");
	setTimeout(function(){alertBanner.classList.replace("block","hidden");timing = null; }, 3000);
}
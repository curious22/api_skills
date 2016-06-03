$(function () {
	$('#container').highcharts({
		title: {
			text: 'Monthly Average Temperature',
			x: -20 //center
		},
		subtitle: {
			text: 'Source: WorldClimate.com',
			x: -20
		},
		xAxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		},
		yAxis: {
			title: {
				text: 'Temperature (°C)'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			valueSuffix: '°C'
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},
		series: [{
			name: 'Tokyo',
			data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
		}, {
			name: 'New York',
			data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
		}, {
			name: 'Berlin',
			data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
		}, {
			name: 'London',
			data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
		}]
	});
});

// create list
var technologi = [
		{ id: 1, name: "Java" },
		{ id: 2, name: "C#" },
		{ id: 3, name: "Python" },
		{ id: 4, name: "PHP" },
		{ id: 5, name: "javascript" },
		{ id: 6, name: "C++" },
		{ id: 7, name: "Objective-C" },
		{ id: 8, name: "Swift" },
		{ id: 9, name: "Ruby" },
		{ id: 10, name: "Perl" },
		{ id: 11, name: "CSS" },
		{ id: 12, name: "HTML" },
		{ id: 13, name: "AngularJS" },
		{ id: 14, name: "NodeJS" },
		{ id: 15, name: "Backbone" },
		{ id: 16, name: "reactJS" },
		{ id: 17, name: "Haskell" },
		{ id: 18, name: "SQL" },
		{ id: 19, name: "GIT" },
		{ id: 20, name: "ASP.NET" }
		

	];

var htmlSelects = '';

$.each(technologi, function(ind, item){
	var htmlInterestSelects = '<div class="select"><p>Уровень интереса</p><select id="int'+item.id+'">'+ getInterestOption()+'</select></div>';
	var htmlLevelSelects = '<div class="select"><p>Уровень знаний</p><select id="lvl'+item.id+'">'+ getLevelOption()+'</select></div>';
	htmlSelects += '<div class="tech-name col-md-6" data-system-name=""><p>'+ item.name +'</p>' + htmlInterestSelects + htmlLevelSelects +'</div>';
});

function getInterestOption(){
	var options = "<option value='1'>Не интересно</option>" +
				"<option value='2'>Небольшой интерес</option>" +
				"<option value='3' selected='selected'>Средний интерес</option>" +
				"<option value='4'>Очень интересно</option>" +
				"<option value='5'>Максимально интересно</option>";
		return options;
}

function getLevelOption(){
	var options = "<option value='1'>Не владею</option>" +
				"<option value='2'>Слабые знания</option>" +
				"<option value='3' selected='selected'>Пробовал использовать</option>" +
				"<option value='4'>Уверенно владею</option>" +
				"<option value='5'>Senior</option>";
		return options;
}

$("#selects").html(htmlSelects);

// get data from view


$( "#send" ).click(function() {
	sendData();
});

var user = {};

function createUser(){
	user = getUser();

	var data = {"username": user.name, "email": user.mail}
	
	$.ajax({
		type: "POST",
		url: "/registration",
		data: data,
		success: sendData,
		dataType: "application/json"
	});
}

function sendData(respons){

	var result = getResult();

	var data = {"email": user.mail, "interests": result};
	
	//JSON.stringify(result);

	function success(data) {
		alert( "Data Loaded: " + data );
	};

	$.ajax({
		type: "POST",
		url: "/interests",
		data: data,
		success: success,
		dataType: "application/json"
	});

	swithBlocks();
}


function getResult(){
	var result = [];
	$("select").each(function(i, item){
		var id = parseInt(item.id.slice(3));
		var type = item.id.slice(0, 3);
		
		var obj = {};

		if(typeof(result[id]) == "object"){
			obj = result[id];
		}
		
		if(type === "lvl"){
			obj.tech_id = id;
			obj.level = parseInt(item.value);
		}

		if(type === "int"){
			obj.interest = parseInt(item.value);
		}

		result[id] = obj;
	});
	console.dir(result);
	return result;
}


// parse data 

// create User
function getUser(){
	var email = $('#user-email').text();
	var name = $('#user-name').text();
	return { mail: email || "email@gmail.com", name: name || "no-name" };
}

// create item

// send to server 
$( "#select-block" ).hide();
// show result 
$( "#switch" ).click(swithBlocks);

function swithBlocks() {
	$( "#graphs" ).toggle( "slow", function() {
		// Animation complete.
	});
	$( "#select-block" ).toggle( "hide", function() {
		// Animation complete.
	});
}
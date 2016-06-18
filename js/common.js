new Chartist.Line('.ct-chart-1', {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [
    [10, 9, 7, 8, 5],
    [2, 1, 3.5, 7, 3],
    [1, 3, 4, 5, 6]
  ]
}, {
  fullWidth: true,
  chartPadding: {
    right: 40
  }
});
new Chartist.Line('.ct-chart-2', {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [
    [3, 9, 7, 2, 5],
    [2, 1, 3.5, 7, 3],
    [1, 3, 4, 5, 6]
  ]
}, {
  fullWidth: true,
  chartPadding: {
    right: 40
  }
});
new Chartist.Line('.ct-chart-3', {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [
    [5, 9, 7, 8, 5],
    [2, 1, 3.5, 7, 3],
    [1, 3, 4, 5, 6]
  ]
}, {
  fullWidth: true,
  chartPadding: {
    right: 40
  }
});


// create list
var technologi = [
		{ id: 1, type: "front", name: "Java" },
		{ id: 2, type: "back", name: "C#" },
		{ id: 3, type: "back", name: "Python" },
		{ id: 4, type: "back", name: "PHP" },
		{ id: 5, type: "front", name: "javascript" },
		{ id: 6, type: "back", name: "C++" },
		{ id: 7, type: "back", name: "Objective-C" },
		{ id: 8, type: "back", name: "Swift" },
		{ id: 9, type: "back", name: "Ruby" },
		{ id: 10, type: "back", name: "Perl" },
		{ id: 11, type: "front", name: "CSS" },
		{ id: 12, type: "front", name: "HTML" },
		{ id: 13, type: "front", name: "AngularJS" },
		{ id: 14, type: "back", name: "NodeJS" },
		{ id: 15, type: "front", name: "Backbone" },
		{ id: 16, type: "front", name: "reactJS" },
		{ id: 17, type: "front", name: "Haskell" },
		{ id: 18, type: "back", name: "SQL" },
		{ id: 19, type: "front", name: "GIT" },
		{ id: 20, type: "front", name: "ASP.NET" }


	];

var htmlSelects = '';

$.each(technologi, function(ind, item){
	var htmlInterestSelects = '<div class="select"><select id="int'+item.id+'">'+ getInterestOption()+'</select></div>';
	var htmlLevelSelects = '<div class="select"><select id="lvl'+item.id+'">'+ getLevelOption()+'</select></div>';
	htmlSelects += '<div class="tech-name col-md-6 col-sm-6 col-xs-12" data-system-name=""><p>'+ item.name +'</p>' + htmlInterestSelects + htmlLevelSelects +'</div>';
});

function getInterestOption(){
	var options = "<option value='0'>Выбрать интерес</option>" +
				"<option value='1'>Не интересно</option>" +
				"<option value='2' selected='selected'>Небольшой интерес</option>" +
				"<option value='3'>Средний интерес</option>" +
				"<option value='4'>Очень интересно</option>" +
				"<option value='5'>Максимально интересно</option>";
		return options;
}

function getLevelOption(){
	var options = "<option value='0'>Выбрать знания</option>" +
				"<option value='1' selected='selected'>Не владею</option>" +
				"<option value='2'>Слабые знания</option>" +
				"<option value='3'>Пробовал использовать</option>" +
				"<option value='4'>Уверенно владею</option>" +
				"<option value='5'>Senior</option>";
		return options;
}

$("#selects").html(htmlSelects);

// get data from view

$("#getStat").click(function () {
  $.ajax({
      type: 'GET',
      url: "http://107.170.116.24/statistics",
      crossDomain: true,
      dataType: 'application/json',
      success: function (responseData, textStatus, errorThrown) {
          alert('Get ok.');
      },
      error: function (responseData, textStatus, errorThrown) {
          alert('Get failed.');
      }
  });
});

$( "#send" ).click(function() {
	createUser();
});

var user = {};
var host = "http://107.170.116.24";
var testUser = '{"username": "Test", "email": "user1@mail.com"}';
var testInterest = '{"email":"user1@mail.com","interests":[{"tech_id":5,"interest":1,"level":4}, {"tech_id":7,"interest":1,"level":4}, {"tech_id":6,"interest":1,"level":4}]}';

function createUser(){
	user = getUser();

	var data = {"username": user.name, "email": user.mail}

	//console.log(JSON.stringify(data));
  $.ajax({
      type: 'POST',
      url: "http://107.170.116.24/registration",
      crossDomain: true,
      data: testUser,
      dataType: 'application/json',
      success: sendData,
      error: function (responseData, textStatus, errorThrown) {
          alert('POST failed.');
      }
  });
}

function sendData(respons){

	var result = getResult();

	var data = {"email": user.mail, "interests": result};

	//console.log(JSON.stringify(data));

	function success(data) {
		alert( "Data Loaded: " + data );
	};

	$.ajax({
		type: "POST",
		url: "http://107.170.116.24/interests",
    crossDomain: true,
		data: testInterest,
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
	var email = $('#email').val();
	var name = $('#name').val();
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

// tabs

// $(document).ready(function  () {
// 	$("a#tab1").click(function  (e) {
// 		$(this).toggleClass("active");
// 		$(".tech-name").toggle();
// 	});
// });
// function showBlock () {
// 	document.getElementById("tech-name").style.display = "";
// };

// function hideBlock () {
// 	document.getElementById("tech-name").style.display = "none";
// };

// $( ".tech-name" ).hide();

// $( "#tab1" ).click(swithTabs);

// function swithTabs() {
// 	$( ".tech-name" ).toggle( "hide", function() {

// 	});
// };

// (function  (&) {
// 	JQuery.fn.lightTabs = function  (options) {
// 		var createTabs = function  () {
// 			tabs = this;
// 			i = 0;

// 			showPage = function  (i) {
// 				$(tabs).children("tech-name").hide();
// 			}
// 		}
// 	}
// });

// $(function  () {
// 	$("ul li a").click(function  () {
// 		$(this)
// 			.sibling().removeClass("active").end()
// 			.next("tech-name").andSelf().addClass("active");
// 	});
// });

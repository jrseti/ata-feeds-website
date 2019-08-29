var moment = require('moment');
var io = require('socket.io-client');

console.log("Hello from JavaScript!");
console.log(moment().startOf('day').fromNow());


var firstDoy = -1;
var numDays = -1;
var screenWidth = 800;


/**
 * Created by jrichards on 5/14/2018.
 */

$(document).ready(function() {

	//Start the websocket connection
	connections();

	setInterval(function() {
        	//var t = new Date().toUTCString().replace("GMT", "UTC");
        	var t = new Date();
        	$('#current_time')[0].textContent = t;
	}, 1000);

	setInterval(function() {
		markTime(firstDoy, false, numDays);
	}, 30000);


	doCalendar();

});

// Handle all websocket communication
function connections()
{
	// var socket = io.connect('http://localhost:3001',
	var socket = io.connect('http://setiquest.info',
			{
				'reconnect': true,
	    'reconnection delay': 5000,
	    'max reconnection attempts': 10
			});

	/*
	socket.on('connect',function(connectedSocket) {
		//console.log("Connected to server");
		$('#connected_users')[0].textContent = "Connected to server";

		//Clear the obs comment area
		var txt = $("#observer_comments_text_area");
		if(txt != undefined || txt != null) {
			txt.val("");
		}

		//After a random number of milliseconds, to avoind blasting the server with too many
		//requests after a server app restart.
		var timeoutms = randomIntFromInterval(1000,6000);
		setTimeout(function () {
			socket.emit("subscribe", "new_obscal_event");
		}, timeoutms);
	});

	socket.on('disconnect',function(connectedSocket) {
		//console.log("Connected to server");
		$('#connected_users')[0].textContent = "Trying to reconnect...";
		numConnectedUsers = -1;
	});


	socket.on('message', function(msg){
		if(msg == null) return;

		var msgType = msg.split(",")[0];

		if(msgType === DATA_TYPE_ACTIVITY && firstMessage == true) {
			firstMessage = false;
			$("#splash").css("visibility", "hidden");
		}

		doCalendar();

	});
	*/
}

function calcCalRect(description, dayIndex, dayStart, dayEnd, thisStart, thisEnd, textId) {

	var secsInADay = 60*60*24;
	var dayHeight = 30.0;
	var barHeight = 20.0;
	var indent = 160;
	var secsWidth = dayEnd - dayStart;
	var startx = indent + (thisStart - dayStart)/secsInADay * screenWidth;
	var eventWidth = (thisEnd - thisStart)/secsInADay * screenWidth;

	var color = "rgb(244,244,244)";
	var descLower = description.toLowerCase();
	if(descLower.startsWith("seti")) color = "#80ced6";
	if(descLower.startsWith("sri")) color = "#618685";
	if(descLower.startsWith("sonata")) color = "#80ced6";

	return '<rect x="' + startx + '" y="' + (28 * dayIndex + 10) + '" width="' + eventWidth + '" height="23" style="fill:' + color + ';stroke-width:2;stroke:rgb(255,255,255,0.1)" /> <text id="' + textId + '" x="' + (startx + 4) + '" y="' + (28.0 * dayIndex + 28) + '" fill="black" class="desc">' + description + '</text>';

}

function centerDesc(dayIndex, dayStart, dayEnd, thisStart, thisEnd, textId) {

	var secsInADay = 60*60*24;
	var dayHeight = 30.0;
	var barHeight = 20.0;
	var indent = 160;
	var secsWidth = dayEnd - dayStart;
	var startx = indent + (thisStart - dayStart)/secsInADay * screenWidth;
	var eventWidth = (thisEnd - thisStart)/secsInADay * screenWidth;

	var textBox = document.getElementById(textId);
	var textWidth = textBox.getComputedTextLength();
	console.log("WIDTH=" + textWidth);

	var centerx = startx + (eventWidth/2) - textWidth/2;
	textBox.setAttribute('x', centerx);

}

function markTime(startDoy, isFirst) {

	var timeNow = moment().valueOf();
	var dayIndex = (moment().dayOfYear() - startDoy);
	var dayStart = moment().startOf('day').valueOf();
	var dayEnd = moment().endOf('day').valueOf();
	var indent = 160;

	var x = indent + screenWidth*((timeNow - dayStart) / (dayEnd - dayStart));
	var y = (28.0 * dayIndex + 28) - 23;
	var color = "#f00";

	if(isFirst == true) {
		var rect = '<rect id="time_marker" x="' + x + '" y="' + y + '" width="' + 10 + '" height="33" style="fill:' + color + ';stroke-width:2;stroke:rgb(255,255,255)" />';
		$("svg").append(rect);
		$("#cont").html($("#cont").html());
	}
	else {
		var rect = document.getElementById('time_marker');
		if(rect != null) {
			rect.setAttribute('x', x);
			rect.setAttribute('y', y);
		}
	}

	//Now the dot on the x axis
	var dot1y = 28.0 * numDays + 15;
	//alert(dot1y + "," + numDays);
	var dot1x = x; 
	//console.log("DOT: " + dot1x + "," + dot1y);
	//console.log("NUM DAYS: " + numDays);
	if(isFirst == true) {
		var dot = '<circle id="tim_x" cx="' + dot1x + '" cy="' + dot1y + '" r="' + 3 + '" style="fill:' + color + ';stroke-width:1;stroke:rgb(255,0,0)" />';
		$("svg").append(dot);
		$("#cont").html($("#cont").html());
	}
	else {
		var dot = document.getElementById('tim_x');
		if(dot != null) {
			dot.setAttribute('cx', dot1x);
			dot.setAttribute('cy', dot1y);
		}
	}

	//Not the Y axis
	var dot1y = y + 16.5;
	var dot1x = indent;
	console.log("DOT: " + dot1x + "," + dot1y);
	if(isFirst == true) {
		var dot = '<circle id="tim_y" cx="' + dot1x + '" cy="' + dot1y + '" r="' + 3 + '" style="fill:' + color + ';stroke-width:1;stroke:rgb(255,0,0)" />';
		$("svg").append(dot);
		$("#cont").html($("#cont").html());
	}
	else {
		var dot = document.getElementById('tim_y');
		if(dot != null) {
			dot.setAttribute('cx', dot1x);
			dot.setAttribute('cy', dot1y);
		}
	}


}

function doCalendar() {
	$.ajax({
		url: "http://feeds.setiquest.info/obscal.jsonp",
	dataType: "jsonp",
	jsonpCallback: 'obscal',
	success: function( response ) {
		data = response;
		events = data["events"];

		secsInADay = 60*60*24;

		//var firstDoy = -1;
		var doy = 0;
		for(var i = 0; i < events.length; i++) {
			doy = moment.unix(events[i]['start']).dayOfYear();
			if(firstDoy == -1) {
				firstDoy = doy;
			}
		}
		numDays = (doy - firstDoy) + 1;

		//Resize the SVG canvas to fit the  number of days.
		document.getElementById('calendar').setAttribute("height", "" + (28*numDays+50) + "px");

		var lastDoy = -1;

		var liney = 28.0 * numDays + 15;
		var line = '<line x1="160" y1="' + liney + '" x2="860" y2="' + liney + '" style="stroke:rgb(188,188,188);stroke-width:0.5" />';
		$("svg").append(line);
		$("#cont").html($("#cont").html());

		for(var i = 0; i<=24; i++) {
			var x = 160 + i * (screenWidth/24);
			line = '<line x1="' + x + '" y1="' + (liney-3) + '" x2="' + x + '" y2="' + (liney+3) + '" style="stroke:rgb(44,44,44);stroke-width:0.5" />';
			$("svg").append(line);

			var hh = "" + i;
			if(i < 10) hh = "0" + hh; 
			var text = '<text x="' + (x-7) + '" y="' + (liney+16) + '" fill="black" class="hh">' + hh + '</text>';
			$("svg").append(text);
		}
		var text = '<text x="' + 445 + '" y="' + (liney+30) + '" fill="black" class="hh">' + "hour of day - pacific time" + '</text>';
		$("svg").append(text);

		var rectCount = 0;

		for(var i = 0; i < events.length; i++) {
			var start = moment.unix(events[i]['start']).utc();
			var endd = moment.unix(events[i]['end']).utc();
			var doy = moment.unix(events[i]['start']).dayOfYear();
			if(doy != lastDoy) {
				console.log("DOY: " + doy + ", (" + moment.unix(events[i]['start']).startOf('day') + " - " + moment.unix(events[i]['start']).endOf('day') + ")");
				lastDoy = doy;
				var dayIndex = (doy - firstDoy);
				//var timeStr = start.year() + "-" + (start.month() + 1) + "-" + start.dates();
				var timeStr = start.format("YYYY-MM-DD (ddd)");
				console.log("[[" + timeStr + "]]\n");

				$("svg").append('<text x="20" y="' + (28.0 * dayIndex + 28) + '" fill="black" class="date">' + timeStr + '</text>');
				$("#cont").html($("#cont").html());
			}
			console.log("\t" + start.format() + " - " + endd.format() + " (" + start + " - " + endd + ")");

			var dayIndex = (doy - firstDoy);
			var dayStart = moment.unix(events[i]['start']).startOf('day')/1000;
			var dayEnd = moment.unix(events[i]['start']).endOf('day')/1000;
			var thisStart = start/1000;
			var thisEnd = endd/1000;


			var rect = calcCalRect(events[i]['type'],dayIndex, dayStart, dayEnd, thisStart, thisEnd, "text_" + rectCount);


			console.log(rect);

			$("svg").append(rect);
			$("#cont").html($("#cont").html());

			centerDesc(dayIndex, dayStart, dayEnd, thisStart, thisEnd, "text_" + rectCount);


			rectCount = rectCount + 1;




		}
		$("#cont").html($("#cont").html());

		markTime(firstDoy, true);

	},
	error: self.handleError
	});
}

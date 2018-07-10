

(function () { 'use strict';

    var antList = [];
    var sensorNameList = [];
    var yearList = [];
    var parentDiv = null;
    var loadedData = null;
    var NAV_NAME = "sensornav";
    var sensorType = -1;;
    var currentYear = '2018';
    var newFeeds = ['1c', '1e', '1g', '1h', '1k', '2a', '2b', '2e', '2h', '2j', '2m', '3c', '3d', '3l', '4j', '5b'];

    var FeedSensors = {};

    FeedSensors.VARIOUS_SENSORS = function() { return 0; };
    FeedSensors.FEED_SENSORS = function() { return 1; };

    FeedSensors.openNav = function() {

        for(var i = 0; i<antList.length; i++) {
            
            if(antList[i].checked === 'checked') {
                $('#' + antList[i].name).prop('checked', true);
            }
            else {
                $('#' + antList[i].name).prop('checked', false);
            }
            antList[i].precheck = antList[i].checked.slice(0);
        }
        for(var i = 0; i<sensorNameList.length; i++) {
            
            if(sensorNameList[i].checked === 'checked') {
                $('#' + sensorNameList[i].name).prop('checked', true);
            }
            else {
                $('#' + sensorNameList[i].name).prop('checked', false);
            }
            sensorNameList[i].precheck = sensorNameList[i].checked.slice(0);
        }
        document.getElementById(NAV_NAME).style.width = "280px";
    }

    FeedSensors.closeNav = function() {
        for(var i = 0; i<antList.length; i++) {
                antList[i].precheck = ' ';
        }
        for(var i = 0; i<sensorNameList.length; i++) {
                sensorNameList[i].precheck = ' ';
        }
        document.getElementById(NAV_NAME).style.width = "0";
    }

    FeedSensors.okNav = function() {

        for(var i = 0; i<antList.length; i++) {
                antList[i].checked = antList[i].precheck.slice(0);
		}

		for(var i = 0; i<sensorNameList.length; i++) {
			sensorNameList[i].checked = sensorNameList[i].precheck.slice(0);
		}
		document.getElementById(NAV_NAME).style.width = "0";

		drawGraphs(loadedData);
	}

	FeedSensors.display = function(st, pd) {

		sensorType = st;
		parentDiv = pd;
        currentYear = '2018';

		$.ajax({
			url: "http://feeds.setiquest.info/ant_sensors.jsonp?" + Math.random(),
			dataType: "jsonp",
			jsonpCallback: 'sensor_data',  // You don't need this, see below
			success: function (response) {
				loadedData = response;
				createGUI();
			},
			error: function (error) {
				alert("Error: " + error);
			}

		});

	};

	function createGUI() {

		var data = loadedData;

		var table = data.feed_sensors;
		if(sensorType === FeedSensors.VARIOUS_SENSORS()) {
			table = data.various_sensors;
		}


		antList = [];
		for(var i = 0; i<table.ants.length; i++)
		{
			var antInfo = {};
			antInfo.name = table.ants[i];
			antInfo.checked = ' ';
			antInfo.precheck = ' ';
			antList.push(antInfo);
		}

		sensorNameList = [];
		for(var i = 0; i<table.fields.length; i++) {
			var sensorNameInfo = {};
			sensorNameInfo.name = table.fields[i];
			sensorNameInfo.checked = '';
			sensorNameInfo.precheck = '';
			sensorNameList.push(sensorNameInfo);
		}

		yearList = [];
		for(var i = 0; i<table.years.length; i++) {
			var yearInfo = {};
			yearInfo.name = table.years[i];
			yearInfo.checked = '';
			yearInfo.precheck = '';
			yearList.push(yearInfo);
		}

		//Create ant checkboxes
		for(var i = 0; i<antList.length; i++) {
			var name = antList[i].name;
			var divName = name;
			var checkboxContainerDiv = document.createElement('div');
			checkboxContainerDiv.classList.add('checkbox_container');
			checkboxContainerDiv.id = "container_" + name;
			var cb = document.createElement('input');
			cb.type = "checkbox";
			cb.id = name;
			checkboxContainerDiv.append(cb);
			var cl = document.createElement('label');
			cl.htmlFor = name;
			cl.innerHTML = name;
            if(isNewFeed(name)) {
                cl.innerHTML = name.toUpperCase();
            }
			checkboxContainerDiv.append(cl);
			$("#navantlist").append(checkboxContainerDiv);

			$('#container_' + name +  ' :checkbox').change(function() {
				var antinfo = getAntCheckbox(this.id);
				if(antinfo != null) {
					if(this.checked) antinfo.precheck = 'checked';
					else antinfo.precheck = '';
				}
			});
		}

		//Create the variable names
		for(var i = 0; i<sensorNameList.length; i++) {
			var name = sensorNameList[i].name;
			var divName = name;
			var checkboxContainerDiv = document.createElement('div');
			checkboxContainerDiv.id = "container_" + name;
			checkboxContainerDiv.classList.add('checkbox_container');
			checkboxContainerDiv.classList.add('checkbox_sensornames_container');
			var cb = document.createElement('input');
			cb.type = "checkbox";
			cb.id = name;
			checkboxContainerDiv.append(cb);
			var cl = document.createElement('label');
			cl.htmlFor = name;
			cl.innerHTML = name;
			checkboxContainerDiv.append(cl);
			$("#navsensorlist").append(checkboxContainerDiv);

			$('#container_' + name +  ' :checkbox').change(function() {
				var sensor = getSensorCheckbox(this.id);
				if(sensor != null) {
					if(this.checked) sensor.precheck = 'checked';
					else sensor.precheck = '';
				}
			});
		}

		//Create the years
		for(var i = 0; i<yearList.length; i++) {
			var name = yearList[i].name;
            console.log(name);
			var divName = name;
			var checkboxContainerDiv = document.createElement('div');
			checkboxContainerDiv.id = "container_" + name;
			checkboxContainerDiv.classList.add('checkbox_container');
			checkboxContainerDiv.classList.add('checkbox_sensornames_container');
			var cb = document.createElement('input');
			cb.type = "radio";
            cb.name = 'year';
			cb.id = name;
			checkboxContainerDiv.append(cb);
			var cl = document.createElement('label');
			cl.htmlFor = name;
			cl.innerHTML = name;
			checkboxContainerDiv.append(cl);
			$("#navyearlist").append(checkboxContainerDiv);

			$('#container_' + name +  ' :radio').change(function() {
				var year = getYearCheckbox(this.id);
                currentYear = year.name;
                console.log( "YEAR=" + year.name);
			});
        }
            var div = document.createElement('div');
            div.classList.add("just_clear_both");
            $("#navyearlist").append(div);

	}

	function getAntCheckbox(antName) {
		for(var i = 0; i<antList.length; i++) {
			if(antList[i].name === antName) return antList[i];
		}
		return null;
	}

	function getSensorCheckbox(sensorName) {
		for(var i = 0; i<sensorNameList.length; i++) {
			if(sensorNameList[i].name === sensorName) return sensorNameList[i];
		}
		return null;
	}

	function getYearCheckbox(year) {
		for(var i = 0; i<yearList.length; i++) {
			if(yearList[i].name === year) return yearList[i];
		}
		return null;
    }

    function isNewFeed(ant) {

        for(var i = 0; i<newFeeds.length; i++) {
            if(ant === newFeeds[i]) return true;
        }
        return false;

    }

    function drawGraphs() {

        //console.log("In drawGraphs()");
        $("#yearlabel").remove();

        for(var i = 0; i<antList.length; i++) {
            var divid = antList[i].name + "_antlabel"
            $("#" + divid).remove();
            for(var j = 0; j<sensorNameList.length; j++) {
                var divid = antList[i].name + "_" + sensorNameList[j].name + "_graph1";
                $("#" + divid).remove();
            }
        }

        var shouldDraw = false;
        for(var i = 0; i<antList.length; i++) {
            if(antList[i].checked !== 'checked') continue;
            for(var j = 0; j<sensorNameList.length; j++) {
                if(sensorNameList[j].checked !== 'checked') continue;
                shouldDraw = true;
                break;
            }
        }
        if(shouldDraw == true) {
            $(".sensor_message").hide();
        }
        else {
            $(".sensor_message").show();
            return;
        }

        var data = loadedData;

        var table = data.feed_sensors;
        if(sensorType === FeedSensors.VARIOUS_SENSORS()) {
            table = data.various_sensors;
        }

        var divid = "yearlabel"
        var div = document.createElement('h1');
        div.id = divid;
        div.innerHTML = "For each week of " + currentYear;
        div.classList.add("year_label");
        parentDiv.append(div);

        var firstOne = true;
        for(var i = 0; i<antList.length; i++) {

            if(antList[i].checked !== 'checked') continue;

            //console.log("Processing antenna " + antList[i].name);
            var divid = antList[i].name + "_antlabel"
            var div = document.createElement('h1');
            div.id = divid;
            div.innerHTML = antList[i].name;
            div.classList.add("ant_label");
            parentDiv.append(div);

            div = document.createElement('div');
            div.classList.add("just_clear_both");
            parentDiv.append(div);

            for(var j = 0; j<sensorNameList.length; j++) {

                if(sensorNameList[j].checked !== 'checked') continue;

                //console.log(sensorNameList[j].name);

                var divid = antList[i].name + "_" + sensorNameList[j].name + "_graph1";
                var div = document.createElement('div');
                div.id = divid;
                div.classList.add("graph_sensor");
                if(firstOne == true) {
                    div.classList.add("just_clear_both");
                    firstOne = false;
                }
                //console.log(parentDiv);
                parentDiv.append(div);

                var mySeries = [];
                var dataExists = false;
                for(var k = 0; k<table['values'][antList[i].name][currentYear][sensorNameList[j].name]['avg'].length; k++) {
                    var avg = table['values'][antList[i].name][currentYear][sensorNameList[j].name]['avg'][k];
                    if(avg == -99)
                        table['values'][antList[i].name][currentYear][sensorNameList[j].name]['avg'][k] = null;
                    else if(avg != 0 && avg != null) {
                        dataExists = true;
                    }
                    var min = table['values'][antList[i].name][currentYear][sensorNameList[j].name]['min'][k];
                    if(min == -99) 
                        table['values'][antList[i].name][currentYear][sensorNameList[j].name]['min'][k] = null;
                    else if(min != 0 && min != null) {
                        dataExists = true;
                    }
                    var max = table['values'][antList[i].name][currentYear][sensorNameList[j].name]['max'][k];
                    if(max == -99)
                        table['values'][antList[i].name][currentYear][sensorNameList[j].name]['max'][k] = null;
                    else if(max != 0 && max != null) {
                        dataExists = true;
                    }
                }
                if(dataExists == true) {
                    var s = {   "showInLegend": true, "name" : "avg" , "data" : table['values'][antList[i].name][currentYear][sensorNameList[j].name]['avg'] };
                    mySeries.push(s);
                    var s = {   "showInLegend": true, "name" : "min" , "data" : table['values'][antList[i].name][currentYear][sensorNameList[j].name]['min'] };
                    mySeries.push(s);
                    var s = {   "showInLegend": true, "name" : "max" , "data" : table['values'][antList[i].name][currentYear][sensorNameList[j].name]['max'] };
                    mySeries.push(s);
                }

                var container = "#" + divid;
                $(container).highcharts( {

                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: sensorNameList[j].name + " - " + antList[i].name
                    },
                    credits: false,
                    xAxis: {
                        tickInterval: 1,
                    },
                    yAxis: {
                        visible: true,
                        title: {
                            text: null
                        },
                        labels: {
                            enabled: true,
                            tickInterval: 1,
                            step: 1
                        },
                    },
                    time: {
                    },
                    tooltip: {
                    },
                    legend: {
                        reversed: true
                    },
                    plotOptions: {
                        series: {
                            lineWidth: 3,
                            marker: {
                                enabled: false
                            },
                        },
                        line: {
                        }
                    },
                    series: mySeries
                },
                    function(chart) {
                        if(dataExists == false) {
                            var textdiv = document.createElement('div');
                            textdiv.id = sensorNameList[j].name + "_" + antList[i].name + "_text";
                            textdiv.classList.add("no_data_text");
                            $('#' + antList[i].name + "_" + sensorNameList[j].name + "_graph1").prepend(textdiv);

                            var textX = chart.plotLeft + (chart.plotWidth  * 0.5);
                            var textY = chart.plotTop  + (chart.plotHeight * 0.5) - 14;


                            var spanId = sensorNameList[j].name + "_" + antList[i].name + "_span" ;


                            var span = '<span id="' + spanId + '" style="position:absolute; text-align:center;">';
                            span += '<span style="font-size: 20px">no data</span><br>';
                            span += '</span>';
                            //console.log(span);


                            $("#" + textdiv.id).append(span);
                            var span = $('#' + spanId);
                            span.css('left', textX + (span.width() * -0.5));
                            span.css('top', textY + (span.height() * -0.5));
                            span.css('transform', 'rotate(-45deg)');
                            span.css('color', '#aa0000');
                            span.css('opacity', 0.6);
                            span.css('z-index', 99999);
                            //console.log("Text x/y=" + textX, textY);
                            //console.log("span x/y=" + span.width(), span.height());

                            /*
                        chart.renderer.text('<span style="color: white;font-weight: 100;><i>No data</i></span>', 100, 100)
                                        .attr({rotation: -45}).css({
                                                                color: '#aa0000',
                                                                opacity: 0.5;
                                                                fontSize: '24px',
                                                                rotation: 45
                                                            })
                                        .add();
                                        */
                        }
                    });


            }

        }
    }


    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = FeedSensors;
    else if (typeof define === 'function' && define.amd) define(FeedSensors);
    else window.FeedSensors = FeedSensors;

}());

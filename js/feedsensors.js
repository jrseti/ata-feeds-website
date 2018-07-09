

(function () { 'use strict';

    var antList = [];
    var sensorNameList = [];
    var yearList = [];

    var FeedSensors = {};

    var parentDiv = null;
    var loadedData = null;

    var NAV_NAME = "sensornav";


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
        document.getElementById(NAV_NAME).style.width = "270px";
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

		drawGraphs(this.parentDiv, this.loadedData);
	}

	FeedSensors.display = function(sensorType, parentDiv) {

        this.parentDiv = parentDiv;

		$.ajax({
			url: "http://feeds.setiquest.info/ant_sensors.jsonp?" + Math.random(),
			dataType: "jsonp",
			jsonpCallback: 'sensor_data',  // You don't need this, see below
			success: function (response) {
                this.loadedData = response;
				createGUI(sensorType, parentDiv, response);
			},
			error: function (error) {
				alert("Error: " + error);
			}

		});

	};

	function createGUI(sensorType, parentDiv, data) {

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

	function drawGraphs(parentDiv, data) {

      console.log("In drawGraphs()");

      for(var i = 0; i<antList.length; i++) {

        if(antList[i].checked !== 'checked') continue;

          console.log("Processing antenna " + antList[i].name);
        
      }
	}

	// export as Node module / AMD module / browser variable
	if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = FeedSensors;
	else if (typeof define === 'function' && define.amd) define(FeedSensors);
	else window.FeedSensors = FeedSensors;

}());

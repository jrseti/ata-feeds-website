

(function () { 'use strict';

    var antList = [];
    var sensorNameList = [];
    var yearList = [];

    var FeedSensors = {};

    var NAV_NAME = "sensornav";


    FeedSensors.VARIOUS_SENSORS = function() { return 0; };
    FeedSensors.FEED_SENSORS = function() { return 1; };

    FeedSensors.openNav = function() {
        document.getElementById(NAV_NAME).style.width = "250px";
    }

    FeedSensors.closeNav = function() {
        document.getElementById(NAV_NAME).style.width = "0";
    }

    FeedSensors.okNav = function() {
        FeedSensors.closeNav();
    }

    FeedSensors.display = function(sensorType, parentDiv) {

        $.ajax({
            url: "http://feeds.setiquest.info/ant_sensors.jsonp?" + Math.random(),
            dataType: "jsonp",
            jsonpCallback: 'sensor_data',  // You don't need this, see below
            success: function (response) {
                createGUI(sensorType, parentDiv, response);
                drawGraphs(sensorType, parentDiv, response);
            },
            error: function (error) {
                alert("Error: " + error);
            }

        });

    };

    function createGUI(sensorType, parentDiv, data) {

        //FeedSensors.openNav();
        var table = data.feed_sensors;
        if(sensorType === FeedSensors.VARIOUS_SENSORS()) {
            //console.log("TABLE = various_sensors");
            table = data.various_sensors;
        }

        //console.log("SENSOR TYPE= " + sensorType);

        antList = [];
        for(var i = 0; i<table.ants.length; i++)
        {
            var antInfo = {};
            antInfo.name = table.ants[i];
            antInfo.checked = '';
            antList.push(antInfo);
            //console.log(antList[i].name);
        }

        sensorNameList = [];
        for(var i = 0; i<table.fields.length; i++) {
            var sensorNameInfo = {};
            sensorNameInfo.name = table.fields[i];
            sensorNameInfo.checked = '';
            sensorNameList.push(sensorNameInfo);
            //console.log(sensorNameList[i].name);
        }

        yearList = [];
        for(var i = 0; i<table.years.length; i++) {
            var yearInfo = {};
            yearInfo.name = table.years[i];
            yearInfo.checked = '';
            yearList.push(yearInfo);
            //console.log(yearList[i].name);
        }

        //Create ant checkboxes
        for(var i = 0; i<antList.length; i++) {
            var name = antList[i].name;
            var divName = name;
            var checkboxContainerDiv = document.createElement('div');
            checkboxContainerDiv.classList.add('checkbox_container');
            var cb = document.createElement('input');
            cb.type = "checkbox";
            cb.id = name;
            checkboxContainerDiv.append(cb);
            var cl = document.createElement('label');
            cl.htmlFor = name;
            cl.innerHTML = name;
            checkboxContainerDiv.append(cl);
            $("#navantlist").append(checkboxContainerDiv);
        }

        //Create the variable names
        for(var i = 0; i<sensorNameList.length; i++) {
            var name = sensorNameList[i].name;
            var divName = name;
            var checkboxContainerDiv = document.createElement('div');
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
        }

    }

    function drawGraphs(sensorType, parentDiv, data) {
    }

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = FeedSensors;
    else if (typeof define === 'function' && define.amd) define(FeedSensors);
    else window.FeedSensors = FeedSensors;

}());

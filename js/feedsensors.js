

(function () { 'use strict';


    var FeedSensors = {};


    FeedSensors.display = function(parentDiv) {

        alert("FEED SENSORS 0");

        $.ajax({
            url: "http://feeds.setiquest.info/ant_sensors.jsonp?" + Math.random(),
            dataType: "jsonp",
            jsonpCallback: 'sensor_data',  // You don't need this, see below
            success: function (response) {
                alert("FEED SENSORS 0.5");
                createGUI(parentDiv, response);
                drawGraphs(parentDiv, response);
            },
            error: function (error) {
                alert("Error: " + error);
            }

        });

    };

    function createGUI(parentDiv, data) {
        alert("FEED SENSORS 1");
    }

    function drawGraphs(parentDiv, data) {
        alert("FEED SENSORS 2");
    }

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = FeedSensors;
    else if (typeof define === 'function' && define.amd) define(FeedSensors);
    else window.FeedSensors = FeedSensors;

}());

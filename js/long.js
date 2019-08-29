(function () { 'use strict';

	var parentDiv = null;

	var LONG = {};

	LONG.display = function(pd) {

		parentDiv = pd;

		$.ajax({
			url: "http://antfeeds.setiquest.info/data/2j2h_weekend.jsonp?" + Math.random(),
			dataType: "jsonp",
			jsonpCallback: 'power',
			success: function (response) {
				createGUI(response);
			},
			error: function (error) {
				//alert("Error: " + error);
			}

		});

    };

    function createGUI(data) {

        var parentDiv = document.getElementById('content_area');

        var ants = data['ants'];
        var pols = [];
        var series = [];

        for(var i = 0; i<ants.length; i++) {
            pols.push(ants[i] + 'x');
            pols.push(ants[i] + 'y');
        }
        for(var i = 0; i<pols.length; i++) {
            var s = { data : data[pols[i]], name : pols[i] };
            series.push(s)
        }


        var sourcelist = data['sources'];

                var divid = "ants";
                var div = document.createElement('div');
                div.id = divid;
                div.classList.add("long_graph");

                parentDiv.appendChild(div);

                var container = "#" + divid;

                var titleColor = "black";
                var titleText = "Long Weekend Observation from Aug 16 to 19";

                $(container).highcharts({
                    chart: {
                        type: 'line',
                        zoomType: 'x'
                    },

                    title: {
                        style: { "color" : titleColor, "fontSize": "16px" },
                        text: titleText
                    },
                    exporting: { enabled: true },
                    credits: {
                        text: '',
                        href: ''
                    },
                    xAxis: {
                        type: 'datetime',
                        title: {
                            enabled: true,
                            text: 'Time'
                        },
                        labels: {enabled: true}
                    },
                    yAxis: {
                        title: {
                            enabled: true,
                            text: 'SNAP RMS'
                        },

                        labels: {
                            enabled: true,
                            formatter: function () {
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true
                    },
                    series: series
                });
        }



    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = LONG;
    else if (typeof define === 'function' && define.amd) define(LONG);
    else window.LONG = LONG;


}());

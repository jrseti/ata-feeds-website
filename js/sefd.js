(function () { 'use strict';

	var parentDiv = null;

	var SEFD = {};

	SEFD.display = function(pd) {

		parentDiv = pd;

		$.ajax({
			url: "http://antfeeds.setiquest.info/sefd/sefd.jsonp?" + Math.random(),
			dataType: "jsonp",
			jsonpCallback: 'sefd',
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

        var antlist = data['ants'];
        var sourcelist = data['sources'];

        for(var i = 0; i<antlist.length; i++) {
            var ant = antlist[i];

            var divid = antlist[i];
            var div = document.createElement('h1');
            div.id = divid;
            div.innerHTML = antlist[i];
            div.classList.add("year_label");
            parentDiv.append(div);

            for(var j = 0; j<sourcelist.length; j++) {
                var source = sourcelist[j];

                var valuesx = [];
                if(data[source][ant] == undefined) {
                    continue;
                }
                if(data[source][ant]["x"] != undefined && data[source][ant]["x"].length > 0) {
                    for(var k = 0; k<data[source][ant]["x"].length; k++) {
                        valuesx.push([parseInt(data[source][ant]["x"][k][0]), 
                            parseInt(data[source][ant]["x"][k][1])]);
                    }
                }
                var valuesy = [];
                if(data[source][ant]["y"] != undefined && data[source][ant]["y"].length > 0) {
                    for(var k = 0; k<data[source][ant]["y"].length; k++) {
                        valuesy.push([parseInt(data[source][ant]["y"][k][0]), 
                            parseInt(data[source][ant]["y"][k][1])]);
                    }
                }

                var divid = ant + "_" + source;
                var div = document.createElement('div');
                div.id = divid;
                div.classList.add("pamdet_graph");
                if(j == 0)
                    div.classList.add("just_clear_both");
                parentDiv.appendChild(div);

                var container = "#" + divid;

                var titleColor = "black";
                var titleText = source + " - " + ant;

                $(container).highcharts({
                    chart: {
                        type: 'line'
                    },

                    title: {
                        style: { "color" : titleColor, "fontSize": "16px" },
                        text: titleText
                    },
                    exporting: { enabled: false },
                    credits: {
                        text: '',
                        href: ''
                    },
                    xAxis: {
                        title: {
                            enabled: true,
                            text: 'freq(mhz)'
                        },
                        labels: {enabled: true}
                    },
                    yAxis: {
                        title: {
                            enabled: true,
                            text: 'SEFD'
                        },
                        type:'logarithmic',

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
                    series: [{
                        showInLegend: true,
                        name: 'X pol',

                        data: valuesx
                    },
                        {
                            showInLegend: true,
                            name: 'Y pol',

                            data: valuesy
                        }]
                });
            }
        }


    }

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = SEFD;
    else if (typeof define === 'function' && define.amd) define(SEFD);
    else window.SEFD = SEFD;


}());

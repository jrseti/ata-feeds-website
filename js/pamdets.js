(function () { 'use strict';

	var parentDiv = null;

	var PamDets = {};

	PamDets.display = function(pd) {

		parentDiv = pd;

		$.ajax({
			url: "http://antfeeds.setiquest.info/feeds/db_pams_dets.jsonp?" + Math.random(),
			dataType: "jsonp",
			jsonpCallback: 'db_pams_dets',
			success: function (response) {
				createGUI(response);
			},
			error: function (error) {
				alert("Error: " + error);
			}

		});

	};

	function createGUI(data) {

        var antList = [];

		for(var ant in data["values"]) {
            antList.push(ant);
        }
        antList.sort();
        //for(var i = 0; i<antList.length; i++) {
        //    console.log(antList[i]);
        //}

        var parentDiv = document.getElementById('content_area');

        var divid = "pamdet_image";
        var div = document.createElement('img');
        div.id = divid;
        div.src="images/PAM-DET-diagram.png";
        div.classList.add("pamdet_img");
        div.classList.add("just_clear_both");
        parentDiv.appendChild(div);

        for(var k = 0; k<antList.length; k++) {

            ant = antList[k];

            var newants = ["1c","1e","1g","1h","1k","2a","2b","2e","2h","2j","2m","3c","3d","3l","4j","5b"];

            var cryo = data["values"][ant]["cryo"];

            var db = data["values"][ant]["db"];
            var pamx_back = data["values"][ant]["pamx_back"];
            var pamy_back = data["values"][ant]["pamy_back"];
            var pamx_front = data["values"][ant]["pamx_front"];
            var pamy_front = data["values"][ant]["pamy_front"];
            var detx = data["values"][ant]["detx"];
            var dety = data["values"][ant]["dety"];


            var pols = ["x", "y"];


            for(var i = 0; i<1; i++) {

                var isNew = false;
                for(var j = 0; j<newants.length; j++) {
                    //if(newants[j] === ant) titleColor = "#ff3333";
                    if(newants[j] === ant) isNew = true;
                }
                //if(isNew == false) continue;

                var divid = ant + pols[i];
                var div = document.createElement('div');
                div.id = divid;
                div.classList.add("pamdet_graph");
                if(k == 0)
                    div.classList.add("just_clear_both");
                parentDiv.appendChild(div);

                //var titleText = ant + "-" + pols[i] + ", cryo " + cryo;
                var titleColor = "#333333";
                var titleText = ant + ", cryo " + cryo;

                var container = "#" + divid;

                var valuesx = [];
                var valuesy = [];
                var min = 100.0;
                var max = -100.0;

                for(var j = 0; j<db.length; j++) {
                    var pam = pamx_back[j] + pamx_front[j];
                    if(detx[j] < min) min = detx[j];
                    if(detx[j] > max) max = detx[j];
                    valuesx.push( [db, detx[j]]);
                }
                for(var j = 0; j<db.length; j++) {
                    var pam = pamy_back[j] + pamy_front[j];
                    if(dety[j] < min) min = dety[j];
                    if(dety[j] > max) max = dety[j];
                    valuesy.push( [db, dety[j]]);
                }

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
                            text: 'PAM dB'
                        },
                        labels: {enabled: false}
                    },
                    yAxis: {
                        title: {
                            enabled: true,
                            text: 'Detector'
                        },

                        labels: {
                            enabled: true,
                            formatter: function () {
                                return this.value;
                            }
                        },
                        floor: min,
                        ceiling: max
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true
                    },
                    series: [{
                        showInLegend: true,
                        name: 'DetX',

                        data: valuesx
                    },
                        {
                            showInLegend: true,
                            name: 'DetY',

                            data: valuesy
                        }]
                });
            }

        }

    }

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = PamDets;
    else if (typeof define === 'function' && define.amd) define(PamDets);
    else window.PamDets = PamDets;


}());

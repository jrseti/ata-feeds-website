(function () { 'use strict';

	var parentDiv = null;

	var AttenSettings = {};

	AttenSettings.display = function(pd) {

		parentDiv = pd;

		$.ajax({
			url: "http://antfeeds.setiquest.info/sefd/atten_settings.jsonp?" + Math.random(),
			dataType: "jsonp",
			jsonpCallback: 'atten_settings',
			success: function (response) {
				createGUI(response);
			},
			error: function (error) {
				alert("Error: " + error.toString());
			}

		});

	};

	function createGUI(data) {

        var parentDiv = document.getElementById('content_area');

        for(var  i=0; i<data['freq_list'].length; i++) {

            var freq = data['freq_list'][i];
            var divid = "atten_settings_" + freq;
            var div = document.createElement('div');
            div.id = divid;
            div.classList.add("atten_settings");
            div.classList.add("just_clear_both");
            parentDiv.appendChild(div);
            //div.classList.add("pamdet_graph");
            //
            var char_for_freq =  data[freq.toString()] ;

            $("#" + divid).highcharts(char_for_freq);
        }

    }

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = AttenSettings;
    else if (typeof define === 'function' && define.amd) define(AttenSettings);
    else window.AttenSettings = AttenSettings;


}());

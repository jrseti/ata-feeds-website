(function () { 'use strict';

    var parentDiv = null;

    var FeedStatus = {};

    FeedStatus.display = function(pd) {

        parentDiv = pd;

        $.ajax({
            url: "http://antfeeds.setiquest.info/feeds/ataproblems.jsonp?" + Math.random(),
            dataType: "jsonp",
            jsonpCallback: 'ataproblems',
            success: function (response) {
                createGUI(response);
            },
            error: function (error) {
                alert("Error: " + error);
            }

        });

    };

    function createGUI(data) {

        var antList = data['ants'];
        for(var i = 0; i<antList.length; i++) {
            var divid = antList[i];
            var div = document.createElement('h1');
            div.id = divid;
            div.innerHTML = antList[i];
            div.classList.add("year_label");
            parentDiv.append(div);

            var problemList = data['problems'][antList[i]];

            var text = "";
            for(var j = 0; j<problemList.length; j++) {

                text += problemList[j] + "<br>";

            }
            var p = document.createElement('p');
            p.innerHTML = text;
            p.classList.add("just_clear_both");
            parentDiv.append(p);

        }


    }

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = FeedStatus;
    else if (typeof define === 'function' && define.amd) define(FeedStatus);
    else window.FeedStatus = FeedStatus;


}());

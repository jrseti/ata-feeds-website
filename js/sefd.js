(function () { 'use strict';

	var parentDiv = null;
    var SIDEBAR_NAME = "sefd_sidebar";
    var newFeeds = ['1c', '1e', '1g', '1h', '1k', '2a', '2b', '2e', '2h', '2j', '2m', '3c', '3d', '3l', '4j', '5b'];
    var group1 = ['2a', '2b', '2e', '3l', '1f', '5c', '4l', '4g'];
    var group2 = ['2j', '2d', '4k', '1d', '2f', '5h', '3j', '3e' ];
    var group3 = ['1a', '1b', '1g', '1h', '2k', '1c', '3c', '4j', '5e', '2c', '1k', '2l', '2h', '1g', '5g'];

	var SEFD = {};

    SEFD.openNav = function() {
        var screenWidth = $( window ).width();
        if(screenWidth <= 320)
            document.getElementById(SIDEBAR_NAME).style.width = "260px";
        else
            document.getElementById(SIDEBAR_NAME).style.width = "660px";
    }

    SEFD.closeNav = function() {
        document.getElementById(SIDEBAR_NAME).style.width = "0px";
    }

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

    function isNewFeed(ant) {
        for(var i = 0; i<newFeeds.length; i++) {
            if(ant === newFeeds[i]) return true;
        }
        return false;
    }

    function isGroup1Feed(ant) {
        for(var i = 0; i<group1.length; i++) {
            if(ant === group1[i]) return true;
        }
        return false;
    }

    function isGroup2Feed(ant) {
        for(var i = 0; i<group2.length; i++) {
            if(ant === group2[i]) return true;
        }
        return false;
    }
    function isGroup3Feed(ant) {
        for(var i = 0; i<group3.length; i++) {
            if(ant === group3[i]) return true;
        }
        return false;
    }

    function createGUI(data) {

        var parentDiv = document.getElementById('content_area');

        $(".sefd_sidebar").click(function(){
            SEFD.closeNav();
        });

        var antlist = data['ants'];
        var sourcelist = data['sources'];

        for(var i = 0; i<antlist.length; i++) {
            var ant = antlist[i];

            var divid = antlist[i];
            var div = document.createElement('h1');
            div.id = divid;
            if(isNewFeed(antlist[i])) {
                div.innerHTML = antlist[i].toUpperCase() + " (new feed)";
            }
            else {
                div.innerHTML = antlist[i];
            }
            if(isGroup1Feed(antlist[i])) {
                div.classList.add("green_text");
            }
            if(isGroup2Feed(antlist[i])) {
                div.classList.add("blue_text");
            }
            if(isGroup3Feed(antlist[i])) {
                div.classList.add("black_text");
            }

            div.classList.add("ant_label");
            if(i == 0) {
                div.classList.add("sefd_top_drop");
            }
            parentDiv.append(div);

            for(var j = 0; j<sourcelist.length; j++) {
                var source = sourcelist[j];

                var valuesx = [];
                if(data[source][ant] == undefined) {
                    continue;
                }
                if(data[source][ant]["x"] != undefined && data[source][ant]["x"].length > 0) {
                    for(var k = 0; k<data[source][ant]["x"].length; k++) {
                        var png = [];
                        for(var m = 2; m<data[source][ant]["x"][k].length; m++) {
                            png.push(data[source][ant]["x"][k][m]);
                        }
                        valuesx.push([parseInt(data[source][ant]["x"][k][0]), 
                            parseInt(data[source][ant]["x"][k][1]),
                            png]);
                    }
                }
                var valuesy = [];
                if(data[source][ant]["y"] != undefined && data[source][ant]["y"].length > 0) {
                    for(var k = 0; k<data[source][ant]["y"].length; k++) {
                        var png = [];
                        for(var m = 2; m<data[source][ant]["y"][k].length; m++) {
                            png.push(data[source][ant]["y"][k][m]);
                        }
                        valuesy.push([parseInt(data[source][ant]["y"][k][0]), 
                            parseInt(data[source][ant]["y"][k][1]),
                            png]);
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
                var titleText = source + " - " + ant + "";

                //type:'logarithmic',
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

                        labels: {
                            enabled: true,
                            formatter: function () {
                                return this.value;
                            }
                        }
                    },
                    plotOptions: {
                        series: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function() {
                                        if(this.series.name === "X pol") 
                                            popupImages("x", this.pngs);
                                        else
                                            popupImages("y", this.pngs);
                                        //alert (this.series.name + ', Category: '+ this.category +', value: '+ this.y);
                                    }
                                }
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
                        data: valuesx,
                        keys: ['x','y','pngs']
                    },
                        {
                            showInLegend: true,
                            name: 'Y pol',
                            data: valuesy,
                            keys: ['x','y','pngs']
                        }]
                });
            }
        }


    }

    function popupImages(pol, pngs) {
        SEFD.openNav();
        var parentDiv = document.getElementById('sefd_images');
        while (parentDiv.firstChild) {
            parentDiv.removeChild(parentDiv.firstChild);
        }

        for(var i = 0; i<pngs.length; i++) {
            var divid = "sefd_image" + i;
            var div = document.createElement('img');
            div.id = divid;
            div.src="sefd/" + pngs[i];
            div.classList.add("sefd_images");
            div.classList.add("just_clear_both");
            parentDiv.appendChild(div);
        }
    }

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = SEFD;
    else if (typeof define === 'function' && define.amd) define(SEFD);
    else window.SEFD = SEFD;


}());


var upTimer = null;
var upTimer2 = null;
var upCharts = [];

var skyObjects = [
    { "name" : "Cassiopeia A", "nickname" : "casa", "ra" : 23.391, "dec" : 58.808, 
        "type" : "continuum",
        "image": "http://antfeeds.setiquest.info/images/casa.jpg"
    },
    { "name" : "Taurus A", "nickname" : "taua", "ra" : 5.575, "dec" : 22.016, 
        "type" : "continuum",
        "image": "http://antfeeds.setiquest.info/images/taua.jpg"
    },
    { "name" : "Virgo A", "nickname" : "vira", "ra" : 12.514, "dec" : 12.391, 
        "type" : "continuum",
        "image": "http://antfeeds.setiquest.info/images/vira.png"
    },
    { "name": "Quasar 3c273", "nickname": "3c273", "ra": 12.485196, "dec": 2.0524075,
        "type" : "quasar",
        "image": "http://antfeeds.setiquest.info/images/3c273.png"
    },
    { "name": "Pulsar 0329+54", "nickname": "psrb0329+54", "ra": 3.549824, "dec": 54.578770,
        "type" : "pulsar",
        "image": "http://antfeeds.setiquest.info/images/psr0328+54.jpg"
    },
    { "name": "Pulsar 0950+08", "nickname": "psrb0950+08", "ra": 9.885920, "dec": 7.9266,
        "type" : "pulsar",
        "image": "http://antfeeds.setiquest.info/images/psrb0950+08.png"
    },
    { "name": "Sun", "nickname": "sun", "ra": -1, "dec": -1,
        "type" : "body",
        "image": "http://antfeeds.setiquest.info/images/sun.jpg"
    },
    { "name": "Moon", "nickname": "moon", "ra": -1, "dec": -1,
        "type" : "body",
        "image": "http://antfeeds.setiquest.info/images/moon.jpg"
    }
];

$(document).ready(function() {

    //alert($( window ).width());
    //alert($( document ).width());

    connect();
    //displayUp();
    displayUpPlanner();
});

function cancelTimers() {
    clearInterval(upTimer);
    clearInterval(upTimer2);
}

function displayUp() {

    closeNav();

    cancelTimers();

    clearDiv('content_area');

    var template = _.template($("#up-template").html());
    $('#content_area').html(template());
    upCharts = [];

    for(var i = 0; i<skyObjects.length; i++) {
        upCharts.push(null);
        drawElevationChart(skyObjects[i], i);
    }

    upTimer = setInterval(function() {
        //var t = new Date().toUTCString().replace("GMT", "UTC");
        var t = new Date();
        $('#up_time')[0].textContent = t;
    }, 1000);
    upTimer2 = setInterval(function() {
        for(var i = 0; i<skyObjects.length; i++) {
            drawElevationChart(skyObjects[i], i);
        }
    }, 60000);
}

function displayUpPlanner() {

    closeNav();
    upCharts = [];

    cancelTimers();

    clearDiv('content_area');

    var template = _.template($("#upplanner-template").html());
    $('#content_area').html(template());

    upTimer = setInterval(function() {
        //var t = new Date().toUTCString().replace("GMT", "UTC");
        var t = new Date();
        $('#up_time_planner')[0].textContent = t;
    }, 1000);

    drawUpPlannerChart(skyObjects);
    drawUpPlannerChart2(skyObjects);
}

function connect()
{
    var socket = io.connect('http://antfeeds.setiquest.info',
        {
            'reconnect': true,
            'reconnection delay': 5000,
            'max reconnection attempts': 10
        });


    socket.on('message', function(msg){
        //location.reload();
        window.location = "http://antfeeds.setiquest.info/index.html?" + Math.random();
        //location.reload();
    });
}

function clearDiv(divName)
{
    var parentDiv = document.getElementById(divName);

    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }    
}

function drawUpPlannerChart(skyObjects) {

    var horizon = 30.0;
    var startTime = new Date().getTime();

    var mySeries = [];
    var categories = [];

    //Calculate the ephem for all sky objects
    for(var i = 0; i<skyObjects.length; i++) {

        var azel = [];
        var nickname = skyObjects[i]['nickname'];
        var thisSeries = [];
        if(nickname === "moon") {
            for(var j = -1; j < 48*6; j++) {
                var utcms = startTime + j*3600000/6;
                var thisAzEl = getMoonAzEl(utcms);
                azel.push(thisAzEl);
                if(thisAzEl[1] >= 30) {
                    thisSeries.push([utcms, i+1,thisAzEl[1]]);
                }
                else {
                    thisSeries.push([utcms, null, null]);
                }
            }
        }
        else if(nickname === "sun") {
            for(var j = -1; j < 48*6; j++) {
                var utcms = startTime + j*3600000/6;
                var thisAzEl = getSunAzEl(utcms);
                azel.push(thisAzEl);
                if(thisAzEl[1] >= 10) {
                    thisSeries.push([utcms, i+1,thisAzEl[1]]);
                }
                else {
                    thisSeries.push([utcms, null, null]);
                }
            }
        }
        else if(skyObjects[i]["ra"] != -1) {
            var ra = skyObjects[i]["ra"];
            var dec = skyObjects[i]["dec"];
            for(var j = -1; j < 48*6; j++) {
                var utcms = startTime + j*3600000/6;
                var thisAzEl = calcAzEl(utcms, ra*15, dec, ATA_LAT, ATA_LON );
                azel.push(thisAzEl);
                if(thisAzEl[1] >= horizon) {
                    //console.log(skyObjects[i]['nickname'] + " = " + thisAzEl[1]);
                    thisSeries.push([utcms, i+1, thisAzEl[1]]);
                }
                else {
                    //console.log(skyObjects[i]['nickname'] + " = null, " + thisAzEl[1]);
                    thisSeries.push([utcms, null, null]);
                }
            }
        }

        skyObjects[i]['azel'] = azel;
        skyObjects[i]['now'] = startTime;
        if(thisSeries.length > 0) {
            /*
            if(skyObjects[i]['nickname'] === 'moon') {
                for(var j = 0; j<thisSeries.length; j++) {
                    console.log("SERIES: " + thisSeries[j]);
                }
            }
            */
            mySeries.push({ "name":skyObjects[i]['nickname'], "data": thisSeries});
        }
    }

    var parentDiv = document.getElementById('content_area');
    var divid = "graph1";
    var div = document.createElement('div');
    div.id = divid;
    div.classList.add("graph_planner");
    parentDiv.appendChild(div);

    var container = "#" + divid;
    $(container).highcharts( {

        chart: {
            type: 'line'
        },
        title: {
            text: 'Times Above The Horizon'
        },
        credits: false,
        xAxis: {
            type: 'datetime',
        },
        yAxis: {
            min: 0,
            max: 9,
            title: {
                text: 'Mouse over to see times'
            },
            labels: {
                enabled: false,
                tickInterval: 1,
                step: 1,
                tickPositions: [1, 2, 3, 4, ,5, 6,7,8,9],
                style: {
                    fontSize: '4px'
                }
                /*
                formatter: function() {
                    //console.log(this.axis);
                    //console.log(this.axis.series);
                    return skyObjects[Math.floor(this.value)]['nickname'];
                }
                */

            },
            gridLineWidth: 0,
              minorGridLineWidth: 0
        },
        time: {
            timezone: 'America/Los_Angeles'
        },
        tooltip: {
            pointFormat: "{series.name}",
            timezone: 'America/Los_Angeles',
            xDateFormat: '%Y-%m-%d %I:%M %P'

        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                lineWidth: 15,
                marker: {
                    enabled: false
                },
            },
            line: {
                linecap: 'square'
            }
        },
        series: mySeries
    });
}

function drawUpPlannerChart2(skyObjects) {

    var horizon = 30.0;
    var startTime = new Date().getTime();

    var mySeries = [];
    var categories = [];

    //Calculate the ephem for all sky objects
    for(var i = 0; i<skyObjects.length; i++) {

        var azel = [];
        var nickname = skyObjects[i]['nickname'];
        var thisSeries = [];
        if(nickname === "moon") {
            for(var j = -1; j < 48*6; j++) {
                var utcms = startTime + j*3600000/6;
                var thisAzEl = getMoonAzEl(utcms);
                    var sunAzEl = getSunAzEl(utcms);
                    var ang = getAngDist(thisAzEl[0], sunAzEl[0], thisAzEl[1], sunAzEl[1]);
                if(thisAzEl[1] >= 30 && ang != 0.0) {
                    thisSeries.push([utcms, ang]);
                }
                else {
                    thisSeries.push([utcms, null]);
                }
            }
        }
        else if(nickname === "sun") {
        }
        else if(skyObjects[i]["ra"] != -1) {
            var ra = skyObjects[i]["ra"];
            var dec = skyObjects[i]["dec"];
            for(var j = -1; j < 48*6; j++) {
                var utcms = startTime + j*3600000/6;
                var thisAzEl = calcAzEl(utcms, ra*15, dec, ATA_LAT, ATA_LON );
                    var sunAzEl = getSunAzEl(utcms);
                    var ang = getAngDist(thisAzEl[0], sunAzEl[0], thisAzEl[1], sunAzEl[1]);
                if(thisAzEl[1] >= horizon && ang != 0.0) {
                    console.log(skyObjects[i]['nickname'] + " = " + ang + "," + thisAzEl + "," + sunAzEl);
                    thisSeries.push([utcms, ang]);
                }
                else {
                    //console.log(skyObjects[i]['nickname'] + " = null, " + thisAzEl[1]);
                    thisSeries.push([utcms, null]);
                }
            }
        }

        skyObjects[i]['now'] = startTime;
        if(thisSeries.length > 0) {
            /*
            if(skyObjects[i]['nickname'] === 'moon') {
                for(var j = 0; j<thisSeries.length; j++) {
                    console.log("SERIES: " + thisSeries[j]);
                }
            }
            */
            mySeries.push({ "name":skyObjects[i]['nickname'], "data": thisSeries});
        }
    }

    var parentDiv = document.getElementById('content_area');
    var divid = "graph2";
    var div = document.createElement('div');
    div.id = divid;
    div.classList.add("graph_planner");
    parentDiv.appendChild(div);

    var container = "#" + divid;
    $(container).highcharts( {

        chart: {
            type: 'line'
        },
        title: {
            text: 'Angle from the Sun'
        },
        credits: false,
        xAxis: {
            type: 'datetime',
        },
        yAxis: {
            title: {
                text: 'Mouse over for Sun Angle'
            },
            labels: {
                enabled: true,
                /*
                formatter: function() {
                //console.log(this.axis);
                //console.log(this.axis.series);
                    return skyObjects[Math.floor(this.value)]['nickname'];
                }
                */

            }
        },
        time: {
            timezone: 'America/Los_Angeles'
        },
        tooltip: {
            pointFormat: "{series.name} {point.y:.2f}° Sun Angle",
            timezone: 'America/Los_Angeles',
            xDateFormat: '%Y-%m-%d %I:%M %P'

        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                lineWidth: 6,
                marker: {
                    enabled: false
                },
            },
            line: {
                linecap: 'square'
            }
        },
        series: mySeries
    });
}

function drawElevationChart(data, objectIndex) {

    /*
    { "name" : "Cassiopeia A", "nickname" : "casa", "ra" : 23.391, "dec" : 58.808, 
        "type" : "continuum",
        "image", "http://antfeeds.setiquest.info/images/casa.jpg"
    },
    */
    var ra = data["ra"];
    var dec = data["dec"];
    var name = data["name"];
    var nickname = data["nickname"].replace("+", "-");
    var elevs = [];
    var min = 1000.0;
    var max = -1000.0;
    var startTime = new Date().getTime();

    //skip Sun and moon for now
    if(ra == -1 && dec == -1 && nickname !== "moon") {
        return;
    }

    if(nickname === "moon") {
        var elevNow = getMoonAzEl(startTime);
        for(var i = -15; i < 15; i++) {
            var utcms = startTime + i*3600000;
            var elev = getMoonAzEl(utcms)[1];

            if(elev < min) min = elev;
            if(elev > max) max = elev;
            elevs.push(elev);
        }
    }
    else {
        var elevNow = calcAzEl(startTime, ra*15, dec, ATA_LAT, ATA_LON);
        for(var i = -15; i < 15; i++) {
            var utcms = startTime + i*3600000;
            var elev = calcAzEl(utcms, ra*15, dec, ATA_LAT, ATA_LON )[1];

            if(elev < min) min = elev;
            if(elev > max) max = elev;
            elevs.push(elev);
        }
    }

    var container = "#" + nickname;
    //if(upCharts[objectIndex] == null) {
    if($(container).highcharts() == undefined) {

        var parentDiv = document.getElementById('content_area');
        var boxid = "box" + nickname;
        var boxdiv = document.createElement('div');
        boxdiv.classList.add("box");
        if(objectIndex == 0) boxdiv.classList.add("clear_both");
        parentDiv.appendChild(boxdiv);

        var divid = nickname;
        var div = document.createElement('div');
        div.id = divid;
        div.classList.add("graph");
        boxdiv.appendChild(div);

        var textid = "text" + nickname;
        var textdiv = document.createElement('div');
        textdiv.id = textid;
        textdiv.classList.add('upinfodiv');
        boxdiv.appendChild(textdiv);

        var p = document.createElement('p');
        p.textContent = data['name'];
        p.classList.add('bigtext');
        textdiv.appendChild(p);

        if(nickname !== "moon") {
            var p = document.createElement('p');
            p.classList.add('mediumtext');
            p.textContent = "RA: " + data['ra'] + ", Dec: " + data['dec'];
            textdiv.appendChild(p);
        }

        var azel = [0,0];
        if(nickname === "moon") {
            azel = getMoonAzEl(startTime);
        }
        else {
            azel = calcAzEl(startTime, ra*15, dec, ATA_LAT, ATA_LON );
        }
        var p = document.createElement('p');
        p.id = "azel" + nickname;
        p.classList.add('mediumtext');
        p.textContent = "Az: " + Math.round(azel[0]) + ", Elev: " + Math.round(azel[1]);
        textdiv.appendChild(p);

        var riseSetString = ["",""];
        if(nickname === "moon") {
            riseSetString = getMoonRiseSetString();
        }
        else {
            riseSetString = getRiseSetString(ra, dec);
        }
        var p = document.createElement('p');
        p.id = "riseset1" + nickname;
        p.classList.add('mediumtext');
        p.textContent = riseSetString[0];
        textdiv.appendChild(p);
        var p = document.createElement('p');
        p.id = "riseset2" + nickname;
        p.classList.add('mediumtext');
        p.textContent = riseSetString[1];
        textdiv.appendChild(p);

        if(riseSetString[0].includes("Below")) {
            $("#riseset1" + nickname).css('color', 'red');
        }
        else {
            $("#riseset1" + nickname).css('color', 'limegreen');
            $("#riseset1" + nickname).css('font-weight', 'bold');
        }

        //var utcms = new Date().getTime() - 3600*1000;
        var utcms = new Date().getTime();
        var sunAzEl = getSunAzEl(utcms);
        var sunAng = Math.abs(getAngDist(azel[0], sunAzEl[0], azel[1], sunAzEl[1]));

        var p = document.createElement('p');
        p.id = "sunangle" + nickname;
        p.classList.add('mediumtext');
        p.textContent = "Sun angle " + Math.round(sunAng) + "°";;

        textdiv.appendChild(p);

        if(sunAng <= 45.0) {
            $("#sunangle" + nickname).css('color', 'red');
        }
        else {
            $("#sunangle" + nickname).css('color', 'limegreen');
            $("#sunangle" + nickname).css('font-weight', 'bold');
        }

        // Moon Angle
        //var utcms = new Date().getTime() - 3600*1000;
        if(nickname !== "moon") {
            var utcms = new Date().getTime();
            var moonAzEl = getMoonAzEl(utcms);
            var moonAng = Math.abs(getAngDist(azel[0], moonAzEl[0], azel[1], moonAzEl[1]));
            var p = document.createElement('p');
            p.id = "moonangle" + nickname;
            p.classList.add('mediumtext');
            p.textContent = "Moon angle " + Math.round(moonAng) + "°";;

            textdiv.appendChild(p);

            if(moonAng <= 45.0) {
                $("#moonangle" + nickname).css('color', 'red');
            }
            else {
                $("#moonangle" + nickname).css('color', 'limegreen');
                $("#moonangle" + nickname).css('font-weight', 'bold');
            }
        }


        $(container).highcharts( {
            //upCharts[objectIndex] = $(container).highcharts( {
            //var elevChart = Highcharts.chart('elev-chart' + divid, {
            chart: {
                type: 'spline',
                backgroundColor: 'rgba(255, 255, 255, 0.0)'
            },
            exporting: {enabled: false},
            title: {
                text: null
            },
            time: {
                timezone: 'America/Los_Angeles'
            },
            tooltip: {
                pointFormat: "{point.y:.2f}° elevation",
                timezone: 'America/Los_Angeles',
                xDateFormat: '%Y-%m-%d %I:%M %P'

            },
            xAxis: {
                title: {
                    text: null
                },
                type: 'datetime',
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0,
                plotLines: [{
                    color: 'red', // Color value
                    dashStyle: 'solid', // Style of the plot line. Default to solid
                    value: new Date().getTime(), // Value of where the line will appear
                    width: 2,
                    label: {
                        text: 'Now  ',
                        textAlign: 'right',
                        verticalAlign: 'bottom',
                        style: {
                            color: 'red'
                        }
                    }
                }]
            },
            credits: false,
            yAxis: {
                title: {
                    text: null,
                    style:{
                        color:'white'
                    }
                },
                gridLineColor: '#ffffff',
                gridLineWidth: 0,
                labels: {
                    formatter: function () {
                        return "";
                    },
                    style: {
                        color: 'white'
                    }
                },
                startOnTick: false,
                endOnTick: false,
                color: '#ffffff',
                plotLines: [{
                    color: 'green', // Color value
                    dashStyle: 'solid', // Style of the plot line. Default to solid
                    value: 30.0, // Value of where the line will appear
                    width: 2, // Width of the line
                    label: {
                        text: '30°',
                        textAlign: 'left',
                        style: {
                            color: 'green'
                        }
                    }
                }]
            },
            series: [{
                name: " ",
                //	data: null,
                marker: {
                    enabled: false
                },
                showInLegend: false,
                labels: {
                    enabled: false
                },
                pointStart: new Date().getTime() - 15*3600*1000,
                pointInterval: 3600*1000,
                color: '#111',
                data: elevs

            }]
        }, function(chart) { // on complete

            chart.renderer.text('<span style="color: white;font-weight: 200;><i>elevation</i></span>', 8, 200)
                .attr({rotation: 270}).css({
                    color: '#4572A7',
                    fontSize: '13px',
                    rotation: 45
                })
                .add();

            chart.renderer.text('<span style="color: white;font-weight: 200;><i>time</i></span>', 8, 210)
                .attr({rotation: 0}).css({
                    color: '#4572A7',
                    fontSize: '13px',
                    rotation: 45
                })
                .add();


        });
    }
    else {

        $(container).highcharts().series[0].setData(elevs);
        $(container).highcharts().series[0].pointStart = new Date().getTime() - 15*3600*1000;
        $(container).highcharts().xAxis[0].options.plotLines[0].value = new Date().getTime();
        $(container).highcharts().xAxis[0].update();

        var azel = [0,0];
        if(nickname === "moon") {
            azel = getMoonAzEl(startTime);
        }
        else {
            azel = calcAzEl(startTime, ra*15, dec, ATA_LAT, ATA_LON );
        }
        $("#azel" + nickname).text("Az: " + Math.round(azel[0]) + ", Elev: " + Math.round(azel[1]));

        var riseSetString = ["",""];
        if(nickname === "moon") {
            riseSetString = getMoonRiseSetString();
        }
        else {
            riseSetString = getRiseSetString(ra, dec);
        }
        $("#riseset1" + nickname).text(riseSetString[0]);
        $("#riseset2" + nickname).text(riseSetString[1]);

        if(riseSetString[0].includes("Below")) {
            $("#riseset1" + nickname).css('color', 'red');
        }
        else {
            $("#riseset1" + nickname).css('color', 'limegreen');
            $("#riseset1" + nickname).css('font-weight', 'bold');
        }

        var utcms = new Date().getTime();
        var sunAzEl = getSunAzEl(utcms);
        var sunAng = Math.abs(getAngDist(azel[0], sunAzEl[0], azel[1], sunAzEl[1]));

        $("#sunangle" + nickname).text("Sun angle " + Math.round(sunAng) + "°");

        if(sunAng <= 45.0) {
            $("#sunangle" + nickname).css('color', 'red');
        }
        else {
            $("#sunangle" + nickname).css('color', 'limegreen');
            $("#sunangle" + nickname).css('font-weight', 'bold');
        }

        if(nickname !== "moon") {
            var moonAzEl = getMoonAzEl(utcms);
            var moonAng = Math.abs(getAngDist(azel[0], moonAzEl[0], azel[1], moonAzEl[1]));
            $("#moonangle" + nickname).text("Moon angle " + Math.round(moonAng) + "°");

            if(moonAng <= 45.0) {
                $("#moonangle" + nickname).css('color', 'red');
            }
            else {
                $("#moonangle" + nickname).css('color', 'limegreen');
                $("#moonangle" + nickname).css('font-weight', 'bold');
            }
        }

    }

    $(container + " p").css({"z-index": 99999});

}

function timespanToHourMinString(timeSpan) {
    var hours = parseInt(timeSpan / 3600) % 24;
    var minutes = parseInt(timeSpan / 60) % 60;

    if(hours == 1)
        return "1 hour " +
            (minutes < 10 ? "0" + minutes : minutes) + " minutes";
    if(hours == 0)
        return (minutes < 10 ? "0" + minutes : minutes) + " minutes";

    return (hours < 10 ? "0" + hours : hours) + " hours " +
        (minutes < 10 ? "0" + minutes : minutes) + " minutes";
}


function getRiseSetString(ra, dec) {

    var ATA_HORIZON = 30.0;

    var utcms = new Date().getTime();
    var elev = calcAzEl(utcms, ra*15, dec, ATA_LAT, ATA_LON )[1];
    var isVisible = (elev < ATA_HORIZON ? false : true);
    var aboveBelowString = (elev < ATA_HORIZON ? "Below 30°" : "Above 30°");

    var riseSetString = "Rise or set";

    var ONE_HOUR_MS = (3600*1000);
    var ONE_MINUTE_MS = (60*1000);

    for(var i = utcms + 1*ONE_HOUR_MS; i < utcms + 24*ONE_HOUR_MS; i+=ONE_HOUR_MS) {
        elev = calcAzEl(i, ra*15, dec, ATA_LAT, ATA_LON )[1];
        if(isVisible && elev < ATA_HORIZON) {
            for(var j = (i - 1*ONE_HOUR_MS); j <= i; j+=ONE_MINUTE_MS) {
                elev = calcAzEl(j, ra*15, dec, ATA_LAT, ATA_LON )[1];
                if(elev < ATA_HORIZON) {
                    riseSetString = "Sets in "  +  timespanToHourMinString((j - utcms)/1000);
                    return [aboveBelowString, riseSetString];
                    break;
                }
            }
        } else if(!isVisible && elev >= ATA_HORIZON) {
            for(var j = (i - 1*ONE_HOUR_MS); j <= i; j+=ONE_MINUTE_MS) {
                elev = calcAzEl(j, ra*15, dec, ATA_LAT, ATA_LON )[1];
                //console.log(new Date(j).toString() + " : elev2= " + elev);
                if(elev >= ATA_HORIZON) {

                    riseSetString = "Rises in "  +  timespanToHourMinString((j - utcms)/1000);
                    return [aboveBelowString, riseSetString];
                    break;
                }
            }
        }
    }
    return [aboveBelowString, riseSetString];

}

function getMoonRiseSetString() {

    var elevs = [];
    var horizon = 30.0;
    var numHours = 27;
    var startTime = new Date().getTime();

    var elevNow = getMoonAzEl(startTime)[1];
    for(var i = 0; i < numHours; i++) {
        var utcms = startTime + i*3600000;
        var elev = getMoonAzEl(utcms)[1];
        elevs.push(elev);
    }

    var lastElev = -1;
    var thisElev = -1;
    var lastTime = -1;
    var thisTime = -1;
    if(elevNow >= horizon) { //Setting
        var crossingIndex = 0;
        for(var i = -1; i<numHours; i++) {
            var utcms = startTime + i*3600000;
            elev = getMoonAzEl(utcms)[1];
            if(elev <= horizon) {
                crossingIndex = i;
                thisTime = utcms;
                thisElev = elev;
                break;
            }
            lastTime = utcms;
            lastElev = elev;
        }
        var t = lastTime + 3600000 * (horizon - lastElev)/(thisElev - lastElev);
        return ["Above 30°", "Sets in "  +  timespanToHourMinString((t - startTime)/1000)];
    }
    else { //Rising
        var crossingIndex = 0;
        for(var i = -1; i<numHours; i++) {
            var utcms = startTime + i*3600000;
            elev = getMoonAzEl(utcms)[1];
            if(elev > horizon) {
                crossingIndex = i;
                thisTime = utcms;
                thisElev = elev;
                break;
            }
            lastTime = utcms;
            lastElev = elev;
        }
        var t = lastTime + 3600000 * (horizon - lastElev)/(thisElev - lastElev);
        return ["Below 30°", "Rises in "  +  timespanToHourMinString((startTime) - t/1000)];
    }

}


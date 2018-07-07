/**
 * Created by jrichards on 9/24/16.
 */
// A lot of this code is from http://mysite.verizon.net/res148h4j/javascript/script_planet_orbits.html
// Another good reference is http://www.stargazing.net/kepler/altaz.html

var RAD_TO_DEG = 180/Math.PI;       // convert radians to degrees
var DEG_TO_RAD = Math.PI/180;
var ATA_LAT = 40.8172439;
var ATA_LON = -121.4698327;
var ATA_ELEV = 986; //meters
//
// "meanSideRealTime" returns the Mean Sidereal Time in units of degrees.
// Use lon = 0 to get the Greenwich MST.
// East longitudes are positive; West longitudes are negative
//
// returns: time in degrees
//
function meanSideRealTime( d, lon )
{
    var year   = d.getUTCFullYear();
    var month  = d.getUTCMonth() + 1;
    var day    = d.getUTCDate();
    var hour   = d.getUTCHours();
    var minute = d.getUTCMinutes();
    var second = d.getUTCSeconds();

    if ((month == 1)||(month == 2))
    {
        year  = year - 1;
        month = month + 12;
    }

    var a = Math.floor(year/100);
    var b = 2 - a + Math.floor(a/4);
    var c = Math.floor(365.25*year);
    var d = Math.floor(30.6001*(month + 1));

    // days since J2000.0
    var jd = b + c + d - 730550.5 + day
        + (hour + minute/60.0 + second/3600.0)/24.0;

    // julian centuries since J2000.0
    var jt = jd/36525.0;

    // mean sidereal time
    var mst = 280.46061837 + 360.98564736629*jd
        + 0.000387933*jt*jt - jt*jt*jt/38710000 + lon;

    if (mst > 0.0)
    {
        while (mst > 360.0)
            mst = mst - 360.0;
    }
    else
    {
        while (mst < 0.0)
            mst = mst + 360.0;
    }

    return mst;
}


//
// compute horizon coordinates from ra, dec, lat, lon, and utc
// ra, dec, lat, lon in  degrees
// utc is a time number in seconds
//
// results returned in h : horizon record structure
//
function calcAzEl(utcms, ra, dec, lat, lon )
{
    var lmst, ha, sin_alt, cos_az, alt, az;

    // compute hour angle in degrees
    ha = meanSideRealTime(new Date(utcms), lon) - ra;
    if (ha < 0) ha = ha + 360;

    // convert degrees to radians
    ha  = ha*DEG_TO_RAD;
    dec = dec*DEG_TO_RAD;
    lat = lat*DEG_TO_RAD;

    // compute altitude in radians
    sin_alt = Math.sin(dec)*Math.sin(lat) + Math.cos(dec)*Math.cos(lat)*Math.cos(ha);
    alt     = Math.asin(sin_alt);

    // compute azimuth in radians
    // divide by zero error at poles or if alt = 90 deg
    cos_az = (Math.sin(dec) - Math.sin(alt)*Math.sin(lat))/(Math.cos(alt)*Math.cos(lat));
    az     = Math.acos(cos_az);

    // convert radians to degrees
    var el = alt*RAD_TO_DEG;
    az  = az*RAD_TO_DEG;

    // choose hemisphere
    if (Math.sin(ha) > 0) az  = 360 - az;

    return [az, el];
}

// Compute Ra/Dec from Az/El
// From https://groups.google.com/forum/#!topic/sara-list/1isnv33wSoU
// Declination, DEC, must be solved first because it is used to find hour angle, H.
//   sin DEC = sin LAT sin ALT + cos LAT cos ALT cos AZ
//   cos H = (sin ALT - sin DEC sin LAT)/(cos DEC cos LAT)
//   The arc cos function may be used to find H.
//       H = LST - RA    therefore  RA = LST - H
function calcRaDec(utcms, az, el, lat, lon)
{
    az = az * DEG_TO_RAD;
    el = el * DEG_TO_RAD;
    lat = lat * DEG_TO_RAD;
    //Keep lon in degrees

    var dec = Math.asin(Math.sin(lat) * Math.sin(el) + Math.cos(lat) * Math.cos(el) * Math.cos(az));
    var H = Math.acos((Math.sin(el) - Math.sin(dec) * Math.sin(lat)) / (Math.cos(dec) * Math.cos(lat)));
    var ra = (meanSideRealTime(new Date(utcms), lon) - H)/15.0;
    dec = dec * RAD_TO_DEG;

    return [ra, dec];
}

function calcZenithRaDec() {

    var utcms = new Date().getTime();
    //var utcms = 1498843735000;
    return calcRaDec(utcms, 180, 89.9, ATA_LAT, ATA_LON);
}


function getSunAzEl(utcms) {
    azel = SunCalc.getPosition(new Date(utcms), ATA_LAT, ATA_LON);
    //console.log("SUN: " + (180.0 + 180.0/Math.PI*azel['azimuth']) + ", " + 180.0/Math.PI*azel['altitude']);
    return [(180.0 + 180.0/Math.PI*azel['azimuth']), (180.0/Math.PI*azel['altitude'])];
}

function getMoonAzEl(utcms) {
    azel = SunCalc.getMoonPosition(new Date(utcms), ATA_LAT, ATA_LON);
    console.log("Moon: " + (180.0 + 180.0/Math.PI*azel['azimuth']) + ", " + 180.0/Math.PI*azel['altitude']);
    return [(180.0 + 180.0/Math.PI*azel['azimuth']), (180.0/Math.PI*azel['altitude'])];
}

function toRad(angleDegree) {
    return Math.PI/180.0 * angleDegree;
}

function getAngDist(az1, az2, el1, el2) {

    //Ψ=arccos(sinθ1sinθ2+cosθ1cosθ2cos(ϕ1−ϕ2))
    if(Math.abs(az1 - az2) < 1 && Math.abs(el1 - el2)) return 0.0;

    return 180.0/Math.PI * Math.acos( (Math.sin(toRad(az1)) * Math.sin(toRad(az2)) + Math.cos(toRad(az1)) * Math.cos(toRad(az2)) * Math.cos(toRad(el1)-toRad(el2))));
}

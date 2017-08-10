var map;

function initialize() {

  // ----------------
  //    Load map
  // ----------------

  // Parameters of map at launch
  var mapOptions = {
    center: {lat: 53, lng: -44},
    zoom: 5,
    mapTypeId: 'satellite',
    disableDefaultUI: true,
    mapTypeControl: false,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
    },
    scaleControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
    }
  };

  // Load map
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // ----------------
  //    Load data
  // ----------------
  // Set of color to use

  var red_in= '#DF625A';
  var red_out='#C34640';
  var orange_in= '#EEBD41';
  var orange_out='#CE9D32';
  var green_in= '#78CB4F';
  var green_out='#63AA3B';

  // Loading data from GeoJson file
  map.data.loadGeoJson(path2geojson);

  // Add a basic style
  map.data.setStyle(function(feature) {
    // Set color
    var colorIn = feature.getProperty('colorIn');
    var colorOut = feature.getProperty('colorOut');
    if (typeof colorIn === 'undefined' && typeof colorOut === 'undefined') {
      colorIn = '#78CB4F';
      colorOut = '#63AA3B';
    }

    // Set different color for last point
    var lastProfile = feature.getProperty('lastProfile');
    if (lastProfile) {
      var sColor = '#000';
    } else {
      var sColor = colorOut;
    }

    return /** @type {google.maps.Data.StyleOptions} */({
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4, // mag
        fillColor: colorIn,
        fillOpacity: 1.0,
        strokeWeight: 1,
        strokeColor: sColor
      },
      fillColor: colorIn,
      strokeColor: colorOut,
      strokeWeight: 2
    });
  });

  // ----------------
  //   Mouse events
  // ----------------

  // When the user hovers, tempt them to click by outlining the letters.
  // Call revertStyle() to remove all overrides. This will use the style rules
  // defined in the function passed to setStyle()
  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    var colorIn = event.feature.getProperty('colorIn');
    var colorOut = event.feature.getProperty('colorOut');
    if (typeof colorIn === 'undefined' && typeof colorOut === 'undefined') {
      colorIn = '#78CB4F';
      colorOut = '#63AA3B';
    }

    var lastProfile = event.feature.getProperty('lastProfile');
    if (lastProfile) {
      var sColor = '#000'
    } else {
      var sColor = colorOut;
    }

    map.data.overrideStyle(event.feature, {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: colorIn,
        fillOpacity: 1.0,
        strokeWeight: 1.5,
        strokeColor: sColor
      },
      strokeWeight: 4
    });
  });

  map.data.addListener('mouseout', function(event) {
    map.data.revertStyle();
  });

  // Set mouseover event for each feature
  infoWindow = new google.maps.InfoWindow({
    content: ""
  });
  map.data.addListener('click', function(event) {
    // Get info from json
    var usr_id = event.feature.getProperty('usr_id');
    var msg_id = event.feature.getProperty('msg_id');
    var dt = event.feature.getProperty('dt');

    // Display message
    infoWindow.setContent('<div id="content">'+
        '<h3>' + usr_id + ' N&deg;' + msg_id + '</h3>'+
        '<p>'+dt.replace('T', ' ') + '</p>'+
      '</div>');
    var anchor = new google.maps.MVCObject();
    anchor.set("position",event.latLng);
    infoWindow.open(map,anchor);
  });

  // Get and Display mouse position
  // map.addListener('mousemove',function(point) {
  //   document.getElementById('span-lat').innerHTML = point.latLng.lat().toFixed(3);
  //   document.getElementById('span-lon').innerHTML = point.latLng.lng().toFixed(3);
  // });
}

google.maps.event.addDomListener(window, 'load', initialize);



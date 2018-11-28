window.MYAPP = window.MYAPP || {}

;(function () {
  var map, infoWindow
  var markers = []
  var pos;

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Init Map
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function initMap () {
    console.log('initializing map...')
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      styles: mapStyle
    })
    infoWindow = new google.maps.InfoWindow()
    getCurrentLocation()
    var centerControlDiv = document.createElement('div')
    var centerControl = new CenterControl(centerControlDiv, map)

    centerControlDiv.index = 1
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv)
  } // initMap

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Get Current Location
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function getCurrentLocation () {
    console.log('getting current location...')
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // infoWindow.setPosition(pos)
        infoWindow.setContent('Location found')
        infoWindow.open(map)
        map.setCenter(pos)
        var icon = {
          url: 'data:image/svg+xml;charset=UTF-8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%20width%3D%2246%22%20height%3D%2246%22%3E%0A%20%20%20%20%20%20%20%20%3Cg%20opacity%3D%220.5%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20fill%3D%22%23A5D8F5%22%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2216.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%3Ccircle%20fill%3D%22%230073bb%22%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%226%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M18%2C25a7%2C7%2C0%2C1%2C1%2C7-7A7%2C7%2C0%2C0%2C1%2C18%2C25Zm0-12a5%2C5%2C0%2C1%2C0%2C5%2C5A5%2C5%2C0%2C0%2C0%2C18%2C13Z%22%2F%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A',
          size: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(25, 25)
        };
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          icon: icon
        })
        marker.setMap(map)
        return pos
      }, function () {
        handleLocationError(true, infoWindow, map.getCenter())
      })
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter())
    }

    function handleLocationError (browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos)
      infoWindow.setContent(browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : 'Error: Your browser doesn\'t support geolocation.')
      infoWindow.open(map)
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Add & Remove Markers
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function createMarkers (locationsForMap) {
    // Function accepts array of objects with name, lat, & long
    setMapOnAll(null)

    console.log('creating new markers...')
    var bounds = new google.maps.LatLngBounds()
    // Loop through markers array
    for (var i = 0; i < locationsForMap.length; i++) {
      markers.push(addMarker(locationsForMap[i], bounds))
    }
    // map.fitBounds(bounds)
    // map.panToBounds(bounds)
    return markers
  }

  function addMarker (props, bounds) {
    var marker = new google.maps.Marker({
      position: props.restaurantCord,
      content: props.restaurantName,
      map: map
      // icon: props.iconImage
    })
    var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng())
    bounds.extend(loc)
    //  Check for customIcon
    if (props.iconImage) {
      // Set icon image
      marker.setIcon(props.iconImage)
    }
    // Check for content
    if (props.restaurantName) {
      var infoWindow = new google.maps.InfoWindow({
        content: props.restaurantName
      })
      marker.addListener('click', function () {
        infoWindow.open(map, marker)
      })
    }
    return marker
  }

  function setMapOnAll (map) {
    if (map == null) { console.log('clearing old markers...') }
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map)
    //   markers[i].setIcon(image)
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Add 'Center on Me' Button
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Center on Me';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      map.setCenter(pos);
    });

  }

  // export the initMap function so it may be called outside of this module
  window.MYAPP.initMap = initMap
  window.MYAPP.createMarkers = createMarkers
  window.MYAPP.setMapOnAll = setMapOnAll
  window.MYAPP.getCurrentLocation = getCurrentLocation
})()

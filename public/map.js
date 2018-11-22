// window.MYAPP = window.MYAPP || {}

// ;(function () {
var map, infoWindow
var markers = []

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Init Map
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function initMap () {
  console.log('initializing map...')
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 0, lng: 0
    },
    zoom: 13,
    styles: mapStyle
  })
  infoWindow = new google.maps.InfoWindow()
  getCoarseLocation()

  // check if the map has stopped loading || done scrolling
  google.maps.event.addListener('bounds_changed', function(){
    var bound = google.maps.LatLngBounds.getBounds()
    console.log('bounds', bound)
  })
} // initMap





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
// Export functions so they may be called outside of this module
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//   window.MYAPP.initMap = initMap
//   window.MYAPP.createMarkers = createMarkers
//   window.MYAPP.setMapOnAll = setMapOnAll
//   window.MYAPP.getCurrentLocation = getCurrentLocation
// })()

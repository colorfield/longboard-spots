/**
 * Global variables to hold onto the coordinates and the map.
 */
var _spot_locator_user_latitude = null;
var _spot_locator_user_longitude = null;
var _spot_locator_map = null;

/**
 * Implements hook_menu().
 */
function spot_locator_menu() {
  var items = {};
  items['spots'] = {
    title: 'Spots',
    page_callback: 'spot_locator_page',
    pageshow: 'spot_locator_map_pageshow'
  };
  return items;
}

/**
 * The callback for the "Hello World" page.
 */
function spot_locator_page() {
  var content = {};
  try {
    // spots autocomplete
    // @todo move in helper
    // @todo fetch from view
    var spots = [
      {
        value: 'lux',
        label: 'Gare du Luxembourg'
      },
      {
        value: 'bois',
        label: 'Bois de la Cambre'
      },
      {
        value: 'tumulis',
        label: 'Chemin des Tumulis'
      },
      {
        value: 'mabru',
        label: 'Mabru'
      },
      {
        value: '50',
        label: 'Cinquantenaire'
      }
    ];
    
    content.spots_autocomplete = {
      theme: 'autocomplete',
      items: spots,
      item_onclick: 'spots_autocomplete_onclick',
      attributes: {
        id: 'spots_autocomplete_input'
      }
    };
    
    // spots map
    // @todo move in helper
    var map_attributes = {
      id: 'spot_locator_map',
      style: 'width: 100%; height: 320px;'
    };
    content['map'] = {
      markup: '<div ' + drupalgap_attributes(map_attributes) + '></div>'
    };
    
    return content;
  }
  catch (error) { console.log('autocomplete spots - ' + error); }
  /*
  content['fetch_detail_button'] = {
    theme: 'button',
    text: 'Detail',
    attributes: {
      onclick: "drupalgap_alert('@todo fetch spots details')"
    }
  };
  */
}

/**
 * Autcomplete onClick listener
 * @param {type} id
 * @param {type} item
 * @returns {undefined}
 */
function spots_autocomplete_onclick(id, item) {
  console.log('List id: ' + id);
  drupalgap_alert("Clicked on item with value: " + $(item).attr('value'));
}

/**
 * The map pageshow callback.
 */
function spot_locator_map_pageshow() {
  try {
    navigator.geolocation.getCurrentPosition(
      
      // Success.
      function(position) {

        // Set aside the user's position.
        _spot_locator_user_latitude = position.coords.latitude;
        _spot_locator_user_longitude = position.coords.longitude;
        
        // Build the lat lng object from the user's current position.
        var myLatlng = new google.maps.LatLng(
          _spot_locator_user_latitude,
          _spot_locator_user_longitude
        );
        
        // Set the map's options.
        var mapOptions = {
          center: myLatlng,
          zoom: 11,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
          },
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
          }
        };
        
        // Initialize the map.
        _spot_locator_map = new google.maps.Map(
          document.getElementById("spot_locator_map"),
          mapOptions
        );
        
        // Add a marker for the user's current position.
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: _spot_locator_map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        
      },
      
      // Error
      function(error) {
        console.log('spot_locator_map_pageshow - getCurrentPosition - ' + error);
        drupalgap_alert(error);
      },
      
      // Options
      { enableHighAccuracy: true }
      
    );
  }
  catch (error) { console.log('spot_locator_map_pageshow - ' + error); }
}
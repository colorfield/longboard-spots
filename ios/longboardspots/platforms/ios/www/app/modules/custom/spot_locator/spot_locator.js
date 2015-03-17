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
    // @todo sync views with observer pattern / data model
    
    // spots autocomplete
    // @todo move in helper
    // @todo fetch from view
    var spots = [
      {
        value: '1',
        label: 'Gare du Luxembourg'
      },
      {
        value: '2',
        label: 'Bois de la Cambre'
      },
      {
        value: '4',
        label: 'Chemin des Tumulis'
      },
      {
        value: '3',
        label: 'Mabru'
      },
      {
        value: '5',
        label: 'Cinquantenaire'
      }
    ];
    
    content.spots_autocomplete = {
      theme: 'autocomplete',
      items: spots,
      item_onclick: 'spots_locator_autocomplete_onclick',
      attributes: {
        id: 'spots_autocomplete_input'
      }
    };
    
    // find spots button
    
    content['find_nearby_locations'] = {
      theme: 'button',
      text: 'Closest spots',
      attributes: {
        //onclick: "drupalgap_alert('You clicked me!');",
        onclick: "spots_locator_map_button_click()"
        /*,
        'data-theme': 'b'
        */
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
    
    
    // location results list
    content['location_results'] = {
      theme: 'jqm_item_list',
      items: [],
      attributes: {
        id: 'location_results_list'
      }
    };
    
   
    return content;
  }
  catch (error) { console.log('autocomplete spots - ' + error); }
}

/**
 * Autcomplete onClick listener
 * @param {type} id
 * @param {type} item
 * @returns {undefined}
 */
function spots_locator_autocomplete_onclick(id, item) {
  //console.log('List id: ' + id);
  //drupalgap_alert("Clicked on item with value: " + $(item).attr('value'));
  drupalgap_goto('node/'+$(item).attr('value'));
  /*
  node_load($(item).attr('value'), {
    success:function(node){
      alert("Loaded " + node.title);
    }
  });
  */
}

/**
 * The "Find Nearby Locations" click handler.
 */
function spots_locator_map_button_click() {

  try {
    // Build the path to the view to retrieve the results.
    var range = 4; // Search within a 4 kilometers radius, for illustration purposes.
    //var path = 'nearby-locations.json/' + _my_module_user_latitude + ',' + _my_module_user_longitude + '_' + range;
    var path = 'nearby-locations.json/' + _spot_locator_user_latitude + ',' + _spot_locator_user_longitude;
    
    //drupalgap_alert('Try to fetch spots');
    
    // Call the server.
    views_datasource_get_view_result(path, {
        success: function(data) {
          
          // drupalgap_alert('Datasource results');
          
          if (data.nodes.length == 0) {
            drupalgap_alert('Sorry, we did not find any nearby locations!');
            return;
          }

          // Iterate over each spot, add it to the list and place a marker on the map.
          var items = [];
          $.each(data.nodes, function(index, object) {
              
              // Render a nearby location, and add it to the item list.
              var row = object.node;
              var image_html = theme('image', { path: row.field_image });
              var distance =
                row.field_geofield_distance + ' ' +
                drupalgap_format_plural(row.field_geofield_distance, 'kilometer', 'kilometers');
              var description =
                '<h2>' + distance + '</h2>' +
                '<p>' + row.title + '</p>';
              var link = l(image_html + description, 'node/' + row.nid);
              items.push(link);
              
              // Add a marker on the map for the location.
              var locationLatlng = new google.maps.LatLng(row.latitude, row.longitude);
              var marker = new google.maps.Marker({
                  position: locationLatlng,
                  map: _spot_locator_map,
                  data: row
              });
              
          });
          drupalgap_item_list_populate("#location_results_list", items);

        }
    });

  }
  catch (error) { console.log('spots_locator_map_button_click - ' + error); }
  
}


function spot_locator_map_pageshow_debug() {
  try {
    drupalgap_alert('spot_locator_map_pageshow');
    
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      console.log('Your current position is:');
      console.log('Latitude : ' + crd.latitude);
      console.log('Longitude: ' + crd.longitude);
      console.log('More or less ' + crd.accuracy + ' meters.');
    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
    
  }
  catch (error) { console.log('my_module_map_pageshow - ' + error); }
}

/**
 * The map pageshow callback.
 */
function spot_locator_map_pageshow() {
  try {
    //drupalgap_alert('spot_locator_map_pageshow ...');
    
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      console.log('Your current position is:');
      console.log('Latitude : ' + crd.latitude);
      console.log('Longitude: ' + crd.longitude);
      console.log('More or less ' + crd.accuracy + ' meters.');
      
      // Set aside the user's position.
        _spot_locator_user_latitude = crd.latitude;
        _spot_locator_user_longitude = crd.longitude;
        
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
      
    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
      drupalgap_alert(error);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
    
  }
  catch (error) { console.log('my_module_map_pageshow - ' + error); }
}


/**
 * The map pageshow callback.
 * This construction causes ios crash
 */
/*
function spot_locator_map_pageshow() {
  try {
    navigator.geolocation.getCurrentPosition(
      // Success.
      function(position) {
        drupalgap_alert(position.coords.latitude + ' / ' + position.coords.longitude);
        
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
        //console.log('spot_locator_map_pageshow - getCurrentPosition - ' + error);
        drupalgap_alert(error);
      },
      
      // Options
      { enableHighAccuracy: true }
      
    );
  }
  catch (error) { console.log('spots_locator_map_button_click - ' + error); }
}
*/
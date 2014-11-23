/**
 * Implements hook_menu().
 */
function spot_locator_menu() {
  var items = {};
  items['spots'] = {
    title: 'Spots',
    page_callback: 'spot_locator_page'
  };
  return items;
}

/**
 * The callback for the "Hello World" page.
 */
function spot_locator_page() {
  var content = {};
  try {
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
  return content;
}

function spots_autocomplete_onclick(id, item) {
  console.log('List id: ' + id);
  drupalgap_alert("Clicked on item with value: " + $(item).attr('value'));
}
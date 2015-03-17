
/**
 * Implements hook_block_info().
 */
function spot_list_block_info() {
  try {
    var blocks = {};
    blocks['toggle_building'] = {
      delta: 'toggle_building',
      module: 'spot_list'
    };
    return blocks;
  }
  catch (error) { console.log('spot_list_block_info - ' + error); }
}

/**
 * Implements hook_block_view().
 */
function spot_list_block_view(delta, region) {
  try {
    var content = '';
    if (delta == 'toggle_building') {
      // add or remove current node
      // @todo implement toggle instead of a list
      content = '<ul>';
        content += '<li>';
        // @todo click handlers
        content += '<a href="#">Add to list</a>';
        content += '</li>';
        content += '<li>';
        content += '<a href="#">Remove from list</a>';
        content += '</li>';
      content += '</ul>';
    }
    return content;
  }
  catch (error) { console.log('spot_list_block_info - ' + error); }
}
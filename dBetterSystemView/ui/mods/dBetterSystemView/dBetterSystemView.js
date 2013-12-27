//remove the bind that makes systems appear and disappear
$('.div_planet_list_panel').attr('data-bind', '');

//Add an extra view for metal spot count
$('.img_planet_list_thumb').parent().append($('<div class="extra-mex-count" data-bind="text: $data.metalSpots">???</div>'))

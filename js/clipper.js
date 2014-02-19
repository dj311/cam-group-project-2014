function generateListElement(id, source) {
  var li = document.createElement("li");
  $(li).attr("data-source", source)
    .attr("data-start", 0)
    .attr("data-end", 0);

  var input = document.createElement("input");
  $(input).attr("id", "item-"+id)
    .attr("type", "radio")
    .attr("name", "item-select")
    .attr("value", id)
    .attr("checked", "checked");

  var label = document.createElement("label");
  $(label).attr("for", "item-"+id)
    .text("PDF "+id);

  $(li).append(input).append(label);

  return li;
}

function loadSource(source) {
  $("#clipper-canvas")
    .attr("data-page", 1)
    .attr('data-source', source);

  $('#source-url').val(source);

  $('#clipper-main').removeClass('empty');

  renderPdfClip("#clipper-canvas", source, 1, 0, 1);
}

$('#source-load').click(function(e) {
  e.preventDefault();
  loadSource($('#source-url').val());
});

$('#clipper-recently-used-list a').click(function(e) {
  e.preventDefault();
  loadSource($(this).attr('href'));
});

$('#next-page').click(function(e) {
  var page = Number($("#clipper-canvas").attr("data-page"))+1;
  var source = $("#clipper-canvas").attr("data-source");
  $("#clipper-canvas").attr("data-page", page);
  renderPdfClip("#clipper-canvas", source, page, 0, 1);
});

$('#previous-page').click(function(e) {
  var page = Number($("#clipper-canvas").attr("data-page"))-1;
  var source = $("#clipper-canvas").attr("data-source");
  if (page < 1) page = 1;
  $("#clipper-canvas").attr("data-page", page);
  renderPdfClip("#clipper-canvas", source, page, 0, 1);
});

$('#clipper-canvas').mousedown(function(e) {
  e.preventDefault();
  $(this).attr('data-selecting', 'true');

  var startX = e.offsetX/$(this).width();
  var startY = e.offsetY/$(this).height();

  $(this).attr('data-startx', startX)
    .attr('data-starty', startY);
});

$('#clipper-canvas, #clipper-overlay').mouseup(function(e) {
  e.preventDefault();
  $('#clipper-canvas').attr('data-selecting', 'false');
  addClip();
});

$('#clipper-canvas').mousemove(function(e) {
  e.preventDefault();
  if ($(this).attr('data-selecting') !== 'true') {
    return;
  }

  var endX = e.offsetX/$(this).width();
  var endY = e.offsetY/$(this).height();

  $(this).attr('data-endx', endX)
    .attr('data-endy', endY);

  setTimeout(fixOverlay, 1);
});

function fixOverlay() {
  var $canvas = $('#clipper-canvas');
  var offsetX = Number($canvas.css('margin-left').slice(0,-2)) + $canvas.position().left;
  var offsetY = Number($canvas.css('margin-top').slice(0,-2)) + $canvas.position().top;

  var startX = $canvas.attr('data-startX')*$canvas.width();
  var startY = $canvas.attr('data-startY')*$canvas.height();

  var endX = $canvas.attr('data-endX')*$canvas.width();
  var endY = $canvas.attr('data-endY')*$canvas.height();

  if (startX > endX) { var t = startX; startX = endX; endX = t; }
  if (startY > endY) { var t = startY; startY = endY; endY = t; }

  var width = endX - startX - 1;
  var height = endY - startY - 1;

  $('#clipper-overlay')
    .css('left', offsetX+startX)
    .css('top', offsetY+startY)
    .css('width', width)
    .css('height', height);
}

function addClip() {
  var $canvas = $('#clipper-canvas');
  
  var source = $canvas.attr('data-source');
  var page = Number($canvas.attr('data-page'));
  var startX = page+Number($canvas.attr('data-startx'));
  var startY = page+Number($canvas.attr('data-starty'));
  var endX = page+Number($canvas.attr('data-endx'));
  var endY = page+Number($canvas.attr('data-endy'));

  if (startX > endX) { var t = startX; startX = endX; endX = t; }
  if (startY > endY) { var t = startY; startY = endY; endY = t; }

  console.log("PDF: "+source+" ("+startX+","+startY+") -> ("+endX+","+endY+")");
}

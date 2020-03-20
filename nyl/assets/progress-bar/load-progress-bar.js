
$('script[src*="load-progress-bar.js"]').after('<div id="progress-bar"></div>');
var html = $('script[src*="load-progress-bar.js"]').attr('src').replace('load-progress-bar.js', 'progress-bar.html');

$('#progress-bar').load(html);

var steps = [];

window.onload = function() {


  if ($('#progress-bar').html() == "") {
    console.log("Error loading progress-bar. Ensure load-progress-bar.js and progress-bar.html are in the same directory.");
    return;
  }
  $('#sdk-runtime .navpanel .navpanel__item').each(function() {
    if (isHeader($(this))) {
      steps.push($(this).text().replace("HEADER_", ""));
    }
  });
  steps.forEach(function(step) {
    $('#progress-bar .steps .steps-text').append('<p class="steps-not-complete">' + step + '</p>');
  });

  loadProgress($('#sdk-runtime .navpanel .navpanel__item .active'));

}



$(document).on('click', '#progress-bar .steps .steps-text p', function() {
  var step = $(this).text();
  var active = '#sdk-runtime .navpanel .navpanel__item:contains(' + step + ')';
  $(active)[0].click();
});
$(document).on('click', '#sdk-runtime .navpanel .navpanel__item', function() {
  loadProgress($(this));
});
$(document).on('click', '#sdk-runtime .field-button', function() {
  count = 0;
  $(document).on('DOMSubtreeModified', '#sdk-runtime', function() {
    if (count < 1) {
      count = 1;
      var active = '#sdk-runtime .navpanel .navpanel__aligntop > div > a.navpanel__item.list-group-item.active';
      $(active)[0].click();
    }
    count = 1;
  });
})




function isHeader(step) {
  if (step[0].hasAttribute("id") && step.attr("id").includes("HEADER_") || step.text().includes("HEADER_"))
    return true;
  return false;
}



function loadProgress(current) {
  var count = 0;

  if (current.text() != "")
    count += (isHeader(current) ? 1 : 0);
  current.prevAll("a").each(function() {
    if (isHeader($(this)))
      count++;
  });
  count = (count == 0 ? 1 : count);

  $('#progress-bar .steps .steps-text p').eq(count - 1).addClass("steps-active");

  $('#progress-bar .steps .steps-text p').eq(count - 1).prevAll("p").each(function() {
    $(this).removeClass("steps-active");
    $(this).removeClass("steps-not-complete");
    $(this).addClass("steps-complete");
  });
  $('#progress-bar .steps .steps-text p').eq(count - 1).nextAll("p").each(function() {
    $(this).removeClass("steps-active");
    $(this).removeClass("steps-complete");
    $(this).addClass("steps-not-complete");
  });

  var percent = (count/steps.length * 100) + "%";
  $('.progress-bar').css("width", percent)
}

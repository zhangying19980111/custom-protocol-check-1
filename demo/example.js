$(function() {
  $("a[href]").click(function(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    const element = $(this);
    window.customProtocolCheck(
      element.attr("href"),
      function() {
        element.attr("result", "false");
      },
      function() {
        element.attr("result", "true");
      }
    );
  });
});

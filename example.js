$(function() {
  $("a[href]").click(function(event) {
    window.protocolCheck($(this).attr("href"), function() {
      alert("This protocol is not supported.");
    });
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  });
});

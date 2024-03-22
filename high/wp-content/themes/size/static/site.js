jQuery( document ).ready( function( $ ) {

  // Your JavaScript goes here

});

function ToApplyForm(link){
  var a = document.createElement("a");
  a.href = link.href;
  location.replace(a.href);
  return false;
}
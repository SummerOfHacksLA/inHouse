$(document).ready(function(){
  // calls when original page loads
  $('#search').click(function(){
    window.location.href = '/#search';
    $('#nav a').removeClass('index');
  });
  $('#nav a').click(function(){
    $('#nav a').removeClass('index');
    $(this).addClass('index');
  })
})
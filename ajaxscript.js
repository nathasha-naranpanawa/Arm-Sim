$(document).ready(function(){
$("#formsubmit").submit(function(event){

	event.preventDefault();
//var formContent = $("#formContent").val();
//var inputs = $("#inputs").val();

// Returns successful data submission message when the entered information is stored in database.
//var dataString = 'formContent='+ formContent + '&inputs='+ inputs ;


    var values = $(this).serialize();

// AJAX Code To Submit Form.
$.ajax({
type: "POST",
url: "blah.php",
data: values,
success: function(result){
alert("Successful!");
$("textarea#outputText").val(result);
}
});

return false;
});
});
$(document).ready(function(){
$("#formsubmit").submit(function(event){

	event.preventDefault();

    var values = $(this).serialize();

// AJAX Code To Submit Form.
	$.ajax({
	type: "POST",
	url: "phpPage_final.php",
	data: values,
	success: function(result){
	alert("Successful!");
	$("textarea#outputText").val(result);
	}
	});

return false;
});
});

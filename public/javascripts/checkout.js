// stripe.js would have been imported by this point
Stripe.setPublishableKey('pk_test_fvVN2eKwDu5PKjwoYxsTH3gK');

// id of the form, jquery
var $form =$('#checkout-form');

$form.submit(function(event) {
	$('#charge-error').addClass('hidden'); 
	// so that the user can't submit the payment 
	// multiple times when the validation is going on
	$form.find('button').prop('disabled', true); 
	Stripe.card.createToken({
		number: $('#card-number').val(),
		cvc: $('#card-cvc').val(),
		exp_month: $('#card-expiry-month').val(),
		exp_year: $('#card-expiry-year').val(),
		name: $('#card-name').val()
	}, stripeResponseHandler);
	return false;
});

function stripeResponseHandler(status, response) {
	// credit card data or form data is invalid
	if (response.error) { // Problem!

	    // Show the errors on the form
		$('#charge-error').text(response.error.message);
		$('#charge-error').removeClass('hidden'); // remove the hidden class to show the div
		$form.find('button').prop('disabled', false); // Re-enable submission

	} else { // Token was created!

		// Get the token ID:
		var token = response.id;

		// Insert the token into the form so it gets submitted to the server:
		// encoded and validated credit card information
		$form.append($('<input type="hidden" name="stripeToken" />').val(token));

		// Submit the form:
		$form.get(0).submit();

	}
}
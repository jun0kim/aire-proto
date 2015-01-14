$(function () {
	var inputElement = $('.sending-input');
	var cancel = $('#nav-cancel');
	var balance = $('#current-balance').text();
	var airepay_btn = $('#aire-pay > .actions');
	var convert_inputElement = $('#convert input');

	inputElement.each(function () {
		$(this).focus(function() {
			$('#aire-pay').addClass('focused');
		});

		$(this).on("input", function() {
			valid_input();
		});

		$(this).on("blur", function() {
			
		});
	});

	convert_inputElement.each(function () {
		$(this).focus(function() {
			$('#convert').addClass('focused');
		});

		$(this).blur(function() {
			$('#convert').removeClass('focused');
		});
	});

	cancel.on("click", clear_input);
	$('#pay-btn').click(clear_input);
	$('#input-value').on("blur", function() {
		balance_animation();
	});

	function clear_input(){
		$('#aire-pay').removeClass('focused');
		airepay_btn.removeClass("on");
		inputElement.each(function (){
			$(this).val('');
			$('#aire-pay-balance').css("width","100%");
			$('#remain-balance').text(balance);
		});
	}

	function balance_animation() {
		var input_balance = $('#input-value').val();
		var percent = (balance - input_balance) / balance;				
		percent = percent * 100 +'%';
		$('#aire-pay-balance').css("width",percent);
		$('#remain-balance').text(balance-input_balance);
		$('#confirm-balance').text(input_balance);
	}

	function valid_input() {
		var count=0;
		inputElement.each(function (){
			if( $(this).val().length > 0)
				count++;
		});
		
		if(count == 3){
			airepay_btn.addClass("on");
		}
		else{
			airepay_btn.removeClass("on");
		}
	}
	var selector = $('select[name=currency]');

	selector.change(current_selector);

	function current_selector() {
		var index = selector.find('> option').index( selector.find('> option:selected'));
		console.log(index);
		console.log(selector.find('> option:selected'));
		console.log($('select[name=currency] option:selected').text());

	}


});


$(function () {
	var inputElement = $('.sending-input');
	var cancel = $('#nav-cancel');
	var pay_currency = 'usd';
	var balance = $('#current-balance').text();
	var airepay_btn = $('#aire-pay > .actions');
	var pay_input_balance;
	var currency_symbol = {
		"usd":"$", "jpy":"¥", "gbp":"€", "mxn":"$", "cny":"¥", "krw":"₩", "euro":"€", "btc":"B"
	}

	inputElement.each(function () {
		$(this).focus(function() {
			$('#aire-pay').addClass('focused');
		})
		.on("input", function() {
			valid_input();
		});
	});
	$('#input-friend').focus( function (){
		$('#aire-pay').addClass('friends');
	})
	.blur(function() {
		$('#aire-pay').removeClass('friends');
		$('#pay-success .send-name').text($(this).val());
	});

	cancel.on("click", clear_input);
	$('#pay-btn').click(function (){
		clear_input();
		set_currency_pay_success();
		set_saved_money();
	});
	$('#input-value').on("blur", function() {
		balance_animation();
	});

	$('#aire-pay select').change(function (){
		pay_currency = $(this).find('> option:selected').attr('val');
		var symbol = $('#aire-pay-input input[type="text"][name="value"].usd + label');
		symbol.removeClass();
		symbol.addClass(pay_currency);
	});

	function set_saved_money() {
		var money_str = currency_symbol[pay_currency] + (pay_input_balance/10).toFixed(1);
		$('#pay-success .saved-money').text(money_str);
	}

	function set_currency_pay_success() {
		$('#confirm-balance').removeClass();
		$('#confirm-balance').addClass(pay_currency);
	}

	function clear_input(){
		$('#aire-pay').removeClass('focused');
		airepay_btn.removeClass("on");
		inputElement.each(function (){
			$(this).val('');
		});
		$('#aire-pay-balance').css("width","100%");
		$('#remain-balance').text(balance);
		$('#aire-pay').removeClass('friends');
	}

	function balance_animation() {
		pay_input_balance = $('#input-value').val();
		var percent = (balance - pay_input_balance) / balance;				
		percent = percent * 100 +'%';
		$('#aire-pay-balance').css("width",percent);
		$('#remain-balance').text(balance-pay_input_balance);
		$('#confirm-balance').text(pay_input_balance);
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



// convert //
	var convert_inputElement = $('#convert input');
	var convert_balance = $('#convert .current-balance .money').text();
	var currency_to = 'usd';
	var currency_from ='euro';

	var rate = {
		"usd":1.18, "jpy":138.14, "gbp":0.78, "mxn":17.29, "cny":7.31, "krw":1275.89
	}
	

	$('#convert .nav .cancel-btn').click(convert_clear_input);

	convert_inputElement.each(function () {
		$(this).focus(function() {
			$('#convert').addClass('focused');
		});
	});

	$('#convert .convert-input .source').on("blur", function() {
		convert_animation();
		calc_fee();
	})
	.on("input", calc_rate);

	$('#convert select').change(function (){
		currency_to = $(this).find('> option:selected').attr('val');
		var symbol = $('#convert .convert-input input[name="target"] + label');
		symbol.removeClass();
		symbol.addClass(currency_to);
		calc_rate();
		change_rate_text();
		change_rate_convert_success();
		change_btn_to();
	});

	$('#convert-accept').click(convert_clear_input);

	function change_btn_to() {
		$('#convert .convert-btn .currency-to').text
		(currency_to.toUpperCase());
	}

	function calc_fee() {
		var total = $('#convert .convert-input .source').val();
		var fee_str = currency_symbol['euro'] + ' ' + (total/100).toFixed(2);

		$('#convert .fee').each(function() {
			$(this).text(fee_str);
		});

	}

	function change_rate_convert_success() {
		var tar = $('#convert-balance-tar');
		tar.removeClass();
		tar.addClass(currency_to);
	}

	function set_val_convert_success(src, tar) {
		$('#convert-balance-src').text(src);
		$('#convert-balance-tar').text(tar);
	}

	function change_rate_text() {
		var rate_str = rate[currency_to]+ ' '+currency_to.toUpperCase();
		$('#convert .exchange-rate span').text(rate_str);
	}

	function calc_rate() {
		var source = $('#convert .convert-input .source');
		var target = $('#convert .convert-input .target');

		target.val( (source.val() * rate[currency_to]).toFixed(2) );
		set_val_convert_success(source.val(), target.val());
	}

	function convert_clear_input(){
		$('#convert').removeClass('focused');
		convert_inputElement.each(function (){
			$(this).val('');
		});
		$('#convert .fee').each(function (){
			$(this).text('');
		});

		$('#convert .current-balance').css("width","100%");
		$('#convert-remain-balance').text(convert_balance);
	}

	function convert_animation() {
		var input_balance = $('#convert .convert-input .source').val();
		var percent = (convert_balance - input_balance) / convert_balance;				
		percent = percent * 100 +'%';
		$('#convert .current-balance').css("width",percent);
		$('#convert-remain-balance').text( (convert_balance-input_balance).toFixed(2) );
	}
	
});


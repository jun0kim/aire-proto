

$(function () {
	var inputElement = $('.sending-input');
	var cancel = $('#nav-cancel');
	var pay_currency = 'usd';
	var default_currency ='usd';
	var balance = $('#current-balance').text();
	var airepay_btn = $('#aire-pay > .actions');
	var pay_input_balance=50;
	var currency_symbol = {
		"usd":"$", "jpy":"¥", "gbp":"€", "mxn":"$", "cny":"¥", "krw":"₩", "eur":"€", "btc":"B"
	}
	var friend_list = $('#aire-pay .friends-list ul li');


	$('#default-currency').change(function (){
		default_currency = $(this).find('> option:selected').attr('val');

		$("#profile #set-currency").find('option').each(function( i, opt ) {
    		if( opt.value === default_currency.toUpperCase() ){
        		$(opt).attr('selected', 'selected');	
        	}
		});
	});
	
	$('#pay-success').bind("tap", function() {
		$.mobile.changePage("#activity",{transition: "slide" ,reverse: true});
		$('#pay-btn').attr("href","#");
		$('#pay-btn').off("tap", pay_btn_clickEvent);
	});

	$('#info-1').bind("tap swipeleft", function() {
		$.mobile.changePage("#info-2",{transition: "slide"});
	});
	$('#info-2').bind("tap swipeleft", function() {
		$.mobile.changePage("#info-3",{transition: "slide"});
	});
	$('#info-2').bind("swiperight", function() {
		$.mobile.changePage("#info-1",{transition: "slide", reverse: true});
	});
	$('#info-3').bind("tap", function() {
		$.mobile.changePage("#friend-using-aire",{transition: "slide"});
	});
	$('#info-3').bind("swiperight", function() {
		$.mobile.changePage("#info-2",{transition: "slide", reverse: true });
	});
	$('#friend-using-aire .footer').bind("tap", function() {
		$.mobile.changePage("#welcome",{transition: "slide"});
	});
	$('#welcome .footer').bind("tap", function() {
		$.mobile.changePage("#aire-pay",{transition: "slide"});
	});

	inputElement.each(function () {
		$(this).focus(function() {
			$('#aire-pay').addClass('focused');
		})
		.on("input", function() {
			valid_input();
		});
	});

	friend_list.each(function () {
		$(this).click(function (){
			var name_input = $('#aire-pay #row-friend input');
			var name = $(this).find('> .name').text();

			name_input.val(name);
			$('#input-value').focus();
		});
	});

	$('#input-friend').focus( function (){
		$('#aire-pay').addClass('friends');
	})
	.blur(function() {
		$('#aire-pay').removeClass('friends');
	});

	cancel.on("click", clear_input);

	$('#input-value').on("input", function() {
		balance_animation();
	});

	$('#aire-pay select').change(function (){
		pay_currency = $(this).find('> option:selected').attr('val');
		var symbol = $('#aire-pay-input input[name="value"].usd + label');
		symbol.removeClass();
		symbol.addClass('currency-symbol');
		symbol.addClass(pay_currency);
	});

	function pay_btn_clickEvent() {
		$('#pay-success .send-name').text($('#input-friend').val());
		clear_input();
		set_currency_pay_success();
		set_saved_money();
		set_balance();
	}

	function set_balance() {
		balance = balance - pay_input_balance;	
		$('#current-balance').text(balance);
		$('#remain-balance').text(balance);
	}

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
			$('#pay-btn').attr("href","#pay-success");
			$('#pay-btn').on("tap", pay_btn_clickEvent);
		}
		else{
			airepay_btn.removeClass("on");
			$('#pay-btn').attr("href","#");
			$('#pay-btn').off("tap", pay_btn_clickEvent);
		}
	}

// convert //
	var convert_inputElement = $('#convert input');
	var convert_balance = $('#convert .current-balance .money').text();
	var currency_to = 'usd';
	var currency_from ='eur';
	var input_balance = 10;
	var rate = {
		"usd":1.18, "jpy":138.14, "gbp":0.78, "mxn":17.29, "cny":7.31, "krw":1275.89, "btc":0.005532
	}
	

	$('#convert .nav .cancel-btn').click(convert_clear_input);

	convert_inputElement.each(function () {
		$(this).focus(function() {
			$('#convert').addClass('focused');
		});
	});

	$('#convert .convert-input .source').on("blur", function() {	
	})
	.on("input", function() {
		calc_rate();
		convert_animation();
		calc_fee();
		calc_remain();
	});

	$('#convert select').change(function (){
		currency_to = $(this).find('> option:selected').attr('val');
		var symbol = $('#convert .convert-input input[name="target"] + label');
		symbol.removeClass();
		symbol.addClass('currency-symbol');
		symbol.addClass(currency_to);
		calc_rate();
		change_rate_text();
		change_rate_convert_success();
		change_btn_to();
	});

	$('#convert-accept').click(function() {
		set_convert_balance();
		convert_clear_input();
	});

	function set_convert_balance(){
		convert_balance = (convert_balance - input_balance).toFixed(2);
		$('#balance .eur .amount').text(convert_balance);
		$('#convert .current-balance .money').text(convert_balance);

		if(currency_to == 'usd'){
			var to_usd = $('#balance .usd .amount');
			var amount_balance = $('#balance .usd .amount').text();
			var amount_usd = to_usd.text();
			var tar_usd = $('#convert .convert-input .target').val();

			console.log(tar_usd);
			amount_usd = (parseFloat(amount_usd) + parseFloat(tar_usd)).toFixed(2);
			to_usd.text(amount_usd);
		}
	}

	function change_btn_to() {
		$('#convert .convert-btn .currency-to').text
		(currency_to.toUpperCase());
	}

	function calc_fee() {
		var total = $('#convert .convert-input .source').val();
		var fee_str = currency_symbol['eur'] + ' ' + (total/100).toFixed(2);

		$('#convert .fee').each(function() {
			$(this).text(fee_str);
		});

	}

	function change_rate_convert_success() {
		var tar = $('#convert-balance-tar');
		tar.removeClass();
		tar.addClass('currency_symbol');
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

		if(currency_to == 'btc')
			target.val( (source.val() * rate[currency_to]).toFixed(6) );
		else
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
		input_balance = $('#convert .convert-input .source').val();
		var percent = (convert_balance - input_balance) / convert_balance;				
		percent = percent * 100 +'%';
		$('#convert .current-balance').css("width",percent);
		
	}

	function calc_remain() {
		var input_balance = $('#convert .convert-input .source').val();
		$('#convert-remain-balance').text( (convert_balance-input_balance).toFixed(2) );
	}
	
});

$(document).ready(function (){
	// if( $('#start').hasClass('.ui-page-active'))
	// 	console.log("fffff");

	// while( !$('#start').hasClass('.ui-page-active') ){
	// 	console.log('wtf!!');
	// }
	setTimeout(function() {
		$.mobile.changePage("#info-1",{transition: "slide"});
	}, 3000);
});

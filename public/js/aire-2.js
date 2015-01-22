$(function () {	
	var pay_currency = 'usd';
	var default_currency ='btc';
	var airepay_btn = $('#aire-pay > .actions');
	var pay_input_balance=0;
	var currency_symbol = {
		"usd":"$", "jpy":"¥", "gbp":"￡", "mxn":"$", "cny":"¥", "krw":"₩", "eur":"€", "btc":"B"
	}
	var balance = {
		"btc":2.134322, "usd":0, "eur":0, "jpy":0, "gbp":0.00, "mxn":0, "cny":0, "krw":0
	}
	var currency = ["btc","usd","gbp","eur","mxn","jpy","cny","krw"];

	var bConvertPopup = true;
	var bDepositPopup = true;
	var bPayFocused = false;
	var inputElement = $('.sending-input');

	transition_init();
	history_link();
	popup_init()
	helper_close();
	init_balance_input_event();
	get_defaultCurrency_fromView();
	set_airePopup_clear();
	
	// $('#deposit').live('pagecreate', function() {
				

	$('#default-currency').change(function (){
		default_currency = $(this).find('> option:selected').attr('val');

		$("#profile #set-currency").find('option').each(function( i, opt ) {
    		if( opt.value === default_currency.toUpperCase() ){
        		$(opt).attr('selected', 'selected');	
        	}
		});
	});
	
	$(document).on("pagebeforeshow", "#aire-pay", function() {
		set_payInit_toView();
	});

	$(document).on("pagebeforeshow", "#pay-success", function() {
		set_resultOfPay_toView();
	});
	
	friends_click();

	$('#input-friend').focus( function (){
		$('#aire-pay').addClass('friends');
	})
	.blur(function() {
		$('#aire-pay').removeClass('friends');
	});

	var cancel = $('#nav-cancel');
	cancel.on("click", clear_input);

	$('#input-value').on("input", function() {
		balance_animation();
	});

	$('#aire-pay select').change(function (){
		pay_currency = $(this).find('> option:selected').attr('val');
		set_balance_toView();
		set_payCurrency_toView();
	});

	function set_airePopup_clear() {
		var btn = $('#aire-pay-popup .aire-popup-btn');
		btn.each(function() {
			$(this).on("click",clear_input);
		});
	}
	function set_payInit_toView() {
		pay_currency = default_currency;
		$('#current-balance').text(balance[pay_currency]);
		set_balance_toView();
		set_payCurrency_toView();
		set_defaultCurrency_toView();
	}

	function get_defaultCurrency_fromView() {
		$('#set-currency').change(function (){
			default_currency = $(this).find('> option:selected').attr('val');
		});
	}

	function set_defaultCurrency_toView() {
		$("#input-currency").find('option').each(function( i, opt ) {
    		if( opt.value === default_currency.toUpperCase() ){
        		$(opt).attr('selected', 'selected');
        		// console.log(default_currency);
        		// console.log(opt.value);
        	}
		});
	}

	function set_payCurrency_toView() {
		var symbol = $('.pay-currency');
		symbol.each(function (){
			$(this).removeClass().addClass('pay-currency').addClass(pay_currency);
		});

		var currency_text = $('.pay-currency-text');
		currency_text.each(function (){
			$(this).text(pay_currency.toUpperCase());
		});
	}

	function init_balance_input_event() {
		inputElement.each(function () {
			$(this).focus(function() {
				if(!bPayFocused){
					$('#aire-pay').addClass('focused');
					set_remainBalance(0);
					bPayFocused = true;
				}
			})
			.on("input", function() {
				valid_input();
			});
		});
	}

	function helper_close() {
		var close_btn = $('.helper .close-btn');

		close_btn.each(function() {
			$(this).click(function() {
				$(this).parent().css("display","none");
			});
		})
	}

	function set_remainBalance(input) {
		var change_balance = (pay_currency === 'btc') ? (balance[pay_currency]-input).toFixed(6) : (balance[pay_currency]-input).toFixed(2);
		$('#remain-balance').text(change_balance);
	}

	function set_resultOfPay_toView() {
		$('#pay-success .send-name').text($('#input-friend').val());
		set_currency_pay_success();
		set_balance();
		$('#confirm-balance').text(pay_input_balance);
		clear_input();
	}

	function popup_bool(){
		$('#popup-checkbox').change(function (){
			bConvertPopup = false;
			$('#convert-popup').popup("close");
		});

		$('#popup-checkbox-deposit').change(function (){
			bDepositPopup = false;
			$('#deposit-popup').popup("close");
		});
	}

	function history_link() {
		var history_list = $('#activity .transactions');

		history_list.eq(0).bind("tap", function() {
			$.mobile.changePage("#history-transactions",{transition: "slide"});
		});
		history_list.eq(1).bind("tap", function() {
			$.mobile.changePage("#history-conversion",{transition: "slide"});
		});
		history_list.eq(2).bind("tap", function() {
			$.mobile.changePage("#history-transactions",{transition: "slide"});
		});
		history_list.eq(3).bind("tap", function() {
			$.mobile.changePage("#history-transactions",{transition: "slide"});
		});
		history_list.eq(4).bind("tap", function() {
			$.mobile.changePage("#history-withdraw",{transition: "slide"});
		});
		history_list.eq(5).bind("tap", function() {
			$.mobile.changePage("#history-deposit",{transition: "slide"});
		});

	}

	function set_balance_toView () {
		$('#aire-pay .pay-currency-text').text( (pay_currency).toUpperCase() );
		$('#aire-pay #current-balance').text( balance[pay_currency] );
	}

	function friends_click () {
		var friend_list = $('#aire-pay .friends-list ul li');

		friend_list.each(function () {
			$(this).click(function (){
				var name_input = $('#aire-pay #row-friend input');
				var name = $(this).find('> .name').text();

				name_input.val(name);
				$('#input-value').focus();
			});
		});
	}

	// function pay_btn_clickEvent() {
	// 	$('#pay-success .send-name').text($('#input-friend').val());
	// 	clear_input();
	// 	set_currency_pay_success();
	// 	set_balance();
	// }

	function set_balance() {
		var change_balance = balance[pay_currency] - pay_input_balance;	
		change_balance = (pay_currency === 'btc') ? change_balance.toFixed(6) : change_balance.toFixed(2);
		balance[pay_currency] = change_balance;

		$('#current-balance').text(balance[pay_currency]);
		$('#remain-balance').text(balance[pay_currency]);
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
		bPayFocused = false;
		airepay_btn.removeClass("on");
		inputElement.each(function (){
			$(this).val('');
		});
		$('#aire-pay-balance').css("width","100%");
		$('#aire-pay').removeClass('friends');
	}

	function balance_animation() {
		pay_input_balance = $('#input-value').val();
		var percent = (balance[pay_currency] - pay_input_balance) / balance[pay_currency];		
		percent = percent * 100 +'%';
		$('#aire-pay-balance').css("width",percent);
		set_remainBalance(pay_input_balance);
		// $('#confirm-balance').text(pay_input_balance);
	}

	function valid_input() {
		var count=0;
		inputElement.each(function (){
			if( $(this).val().length > 0)
				count++;
		});
		if(count == 3){
			airepay_btn.addClass("on");
			if(balance[pay_currency]<=0){
				$('#pay-btn').attr("href","#aire-pay-popup").attr("data-rel","popup").attr("data-transition","pop").attr("data-position-to","window");
			}
			else{
				$('#pay-btn').attr("href","#pay-success").attr("data-rel","").attr("data-transition","slide").attr("data-position-to","");;
			}
		}
		else{
			airepay_btn.removeClass("on");
			$('#pay-btn').attr("href","#").attr("data-rel","").attr("data-transition","slide").attr("data-position-to","");
			// $('#pay-btn').off("tap", pay_btn_clickEvent);
		}
	}

	function transition_init() {
		$('#pay-success').bind("tap", function() {
			$.mobile.changePage("#activity",{transition: "slide" ,reverse: true});
			$('#pay-btn').attr("href","#");
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

		$('#info-3').bind("tap swipeleft", function() {
			$.mobile.changePage("#info-4",{transition: "slide"});
		});
		$('#info-3').bind("swiperight", function() {
			$.mobile.changePage("#info-2",{transition: "slide", reverse: true });
		});

		$('#info-4').bind("swiperight", function() {
			$.mobile.changePage("#info-3",{transition: "slide", reverse: true });
		});

		$('#friend-using-aire .footer').bind("tap", function() {
			$.mobile.changePage("#welcome",{transition: "slide"});
		});
		$('#welcome .footer').bind("tap", function() {
			$.mobile.changePage("#aire-pay",{transition: "slide"});
		});
		$('#start-deposit .footer').bind("tap", function() {
			$.mobile.changePage("#aire-pay",{transition: "slide"});
		});
		$('#aire-pay #aire-pay-balance').bind("tap", function() {
			$.mobile.changePage("#balance",{transition: "slideup"});
			
		});
	}

// convert //
	var convert_inputElement = $('#convert input')
	var currency_to = 'usd';
	var currency_from ='btc';
	var input_balance = 0;
	var convert_fee = 0;
	var rate = {
		"usd":1.18, "jpy":138.14, "gbp":0.78, "mxn":14.77, "cny":6.21, "krw":1275.89, "btc":0.004390
	};
	var rate_test = {
		"usd": {
			"usd":1.00, "jpy":118.11, "gbp":0.66, "mxn":17.29, "cny":7.31, "krw":1085.98, "btc":0.005532, "eur":0.86
		},
		"eur": {
			"usd":1.18, "jpy":138.14, "gbp":0.78, "mxn":17.29, "cny":7.31, "krw":1275.89, "btc":0.005532, "eur":1.0
		},
		"jpy": {
			"usd":0.00847, "jpy":1.00, "gbp":0.00559, "mxn":0.125, "cny":0.0526, "krw":9.19, "btc":0.00003729, "eur":0.00731
		},
		"gbp": {
			"usd":1.514, "jpy":178.81, "gbp":1.00, "mxn":22.37, "cny":9.4, "krw":1644.03, "btc":0.006641, "eur":0.765
		},
		"mxn": {
			"usd":0.0676, "jpy":7.99, "gbp":0.04469, "mxn":1.00, "cny":0.42, "krw":73.468, "btc":0.0002970, "eur":0.058
		},
		"cny": {
			"usd":0.16097, "jpy":18.98, "gbp":9.414, "mxn":2.37654, "cny":1.00, "krw":73.468, "btc":0.0006909, "eur":0.1386
		},
		"krw": {
			"usd":0.00092, "jpy":0.10888, "gbp":0.00061, "mxn":0.0136, "cny":0.0057, "krw":1, "btc":0.0002970, "eur": 0.0008
		},
		"btc": {
			"usd":227.7, "jpy":26800, "gbp":150.4, "mxn":3367, "cny":1416, "krw":241000, "btc":1, "eur":196.1
		}
	};
	var bConvertTutorial = true;
	var total_balance = 0;

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

		// if(bConvertTutorial)
		// 	convert_helper_goto_nextstep();
	});

	$('#convert-accept').click(function() {
		set_convert_balance();
		convert_clear_input();
	});

	$(document).on("pagebeforeshow", "#balance", function() {
		set_balance_init();
	});
	$(document).on("pagebeforeshow", "#convert", function() {
		set_convert_init()
	});

	get_TotalBalance();

	function convert_helper_goto_nextstep(){
		$('#convert .first-step').css("display","none");
		$('#convert .second-step').css("display","block");
	}

	function set_convert_balance(){
		var src = parseFloat($('#convert .convert-input .source').val());
		var tar = parseFloat($('#convert .convert-input .target').val());

		src = get_numberSub( balance[currency_from], src);
		src = get_numberSub( src, convert_fee );
		tar = get_numberAdd( balance[currency_to], tar);

		src = get_value(currency_from, src);
		tar = get_value(currency_to, tar);

		balance[currency_from] = (src>0) ? src : 0;
		balance[currency_to] = tar;

		// if(currency_to == 'usd'){
		// 	var to_usd = $('#balance .usd .amount');
		// 	var amount_balance = $('#balance .usd .amount').text();
		// 	var amount_usd = to_usd.text();
		// 	var tar_usd = $('#convert .convert-input .target').val();

		// 	console.log(tar_usd);
		// 	amount_usd = (parseFloat(amount_usd) + parseFloat(tar_usd)).toFixed(2);
		// 	to_usd.text(amount_usd);
		// }
	}

	

	function change_btn_to() {
		$('#convert .convert-btn .currency-to').text
		(currency_to.toUpperCase());
	}

	function calc_fee() {
		var total = $('#convert .convert-input .source').val();
		total = total/100;
		total = get_value(currency_from, total);

		convert_fee = total;

		var fee_str = currency_symbol[currency_from] + ' ' + total;

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
		var rate_str = rate_test[currency_from][currency_to]+ ' '+currency_to.toUpperCase();
		$('#convert .exchange-rate .amount').text(rate_str);
	}

	function calc_rate() {
		var source = $('#convert .convert-input .source');
		var target = $('#convert .convert-input .target');
		var amount = source.val() * rate_test[currency_from][currency_to];

		amount = get_value(currency_to, amount);
		target.val(amount);

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
		$('#convert-remain-balance').text( '  '+currency_symbol[currency_from]+' '+balance[currency_from]);
	}

	function convert_animation() {
		input_balance = $('#convert .convert-input .source').val();
		var percent = (balance[currency_from] - input_balance) / balance[currency_from];				
		percent = percent * 100 +'%';
		$('#convert .current-balance').css("width",percent);
		
	}

	function calc_remain() {
		var input_balance = $('#convert .convert-input .source').val();
		var amount = balance[currency_from] - input_balance;
		amount = get_value(currency_from, amount);

		$('#convert-remain-balance').text( '  '+currency_symbol[currency_from]+' '+amount );
	}

	function popup_init() {
		$(document).on("pageshow", "#balance", function() {
			if(bConvertPopup)
				$('#convert-popup').popup("open");
				
		});

		$(document).on("pageshow", "#deposit", function() {
			if(bDepositPopup)
				$('#deposit-popup').popup("open");
				
		});

		popup_bool();
		deposit_popup_close();
		convert_popup_close();
	}

	function deposit_popup_close() {
		$('#deposit-popup .action a').bind("tap", function(){
			$('#deposit-popup').popup("close");
		});
	}

	function convert_popup_close() {
		$('#convert-popup .action a').bind("tap", function(){
			$('#convert-popup').popup("close");
		});
	}
	
	function set_balance_init() {
		var sel_balances = $('#balance .property');

		sel_balances.each(function (){
			var curr = $(this).attr('class').replace("empty","").replace("property","").trim();
			var sel_link = $(this).find('.toConvert');

			$(this).find('.property-container .amount').text(balance[curr]);

			if(balance[curr]<=0) {
				$(this).addClass('empty');
				sel_link.attr('href','');
			}
			else {
				$(this).removeClass('empty');
				sel_link.attr('href','#convert');
				$(this).find('.property-container').bind("tap",function() {
					currency_from = curr;
				});
			}
		});
		get_TotalBalance();
		set_TotalBalance_toView();
		set_balanceRatio_toView();
	}

	function set_convert_init() {
		set_CurrencyFrom_toView();
		set_ConvertBalance_toView();
		set_SrcBalance_toView();
		calc_rate();
		calc_fee();
		set_convertFrom_toView();
		set_ConvertOption_toView();
		set_CurrencyTo_toView();
	}

	function set_convertFrom_toView() {
		var src = $('#convert-balance-src');

		src.removeClass();
		src.addClass(currency_from);
	}

	function set_SrcBalance_toView() {
		$('#convert .convert-input .source').val(balance[currency_from]);
	}

	function set_CurrencyFrom_toView() {
		var currency_text = $('#convert .currency-from');
		var convert_currency = $('#convert .convert-currency');

		currency_text.each(function() {
			$(this).text(currency_from.toUpperCase());
		});

		convert_currency.each(function() {
			$(this).removeClass();
			$(this).addClass('convert-currency');
			$(this).addClass(currency_from);
		});

		
	}

	function set_CurrencyTo_toView() {
		var convert_currency_to = $('#convert .convert-input .convert-currency-to');

		$.each(balance, function(key, value){
			currency_to = key;
			if(currency_to != currency_from)
				return false;
		});

		convert_currency_to.removeClass();
		convert_currency_to.addClass('convert-currency-to');
		convert_currency_to.addClass(currency_to);
	}

	function set_ConvertBalance_toView() {
		var selBalance = $('#convert .current-balance .money');
		var remainBalacne = $('#convert #convert-remain-balance');

		remainBalacne.text( '  '+currency_symbol[currency_from]+' '+balance[currency_from]);
		selBalance.text( balance[currency_from]);
	}

	function get_value(currency, amount) {
		// amount = parseFloat(amount);
		switch(currency){
			case 'btc':
				return amount.toFixed(6);
			case 'krw':
				return amount.toFixed(0);
			case  'jpy':
				return amount.toFixed(0);
			case 'cny':
				return amount.toFixed(0);
			case 'gbp':
				return amount.toFixed(2);
			case 'eur':
				return amount.toFixed(2);
			case 'usd':
				return amount.toFixed(2);
			case 'mxn':
				return amount.toFixed(2);
			default:
				return amount;
		}
	}

	function get_numberAdd(val1, val2){
		return parseFloat(val1) + parseFloat(val2);
	}

	function get_numberSub(val1,val2) {
		return parseFloat(val1) - parseFloat(val2);
	}

	function get_TotalBalance() {
		var tmp=0;
		var val;

		$.each(balance, function(key, value){
			// console.log(key+' '+value);
			tmp = tmp + value*rate_test[key][default_currency];
		});

		tmp = get_value(default_currency, tmp);
		total_balance = tmp;
	}

	function set_TotalBalance_toView() {
		var str = currency_symbol[default_currency]+' '+total_balance;
		$('#total_balance').text(str);
	}

	function set_balanceRatio_toView() {
		$('.property').each(function (){
			var curr = $(this).attr('class').replace("empty","").replace("property","").trim();
			var sel = $(this).find('.balance-bar');

			if(balance[curr] <= 0){
				sel.css("width","0%");
			}
			else {
				var curr_balance = balance[curr] * rate_test[curr][default_currency];
				var percent = (curr_balance/total_balance)*100;
				percent = percent+'%';
				sel.css("width",percent);
			}

		});
	}
	
	function set_ConvertOption_toView() {
		var convert_select = $('#convert .convert-input select');
		var select_option = convert_select.find('option');

		select_option.each(function() {
			$(this).remove();
		});

		$.each(balance, function(key,value){
			if(key === currency_from){

			}
			else{
				var opt = '<option val="'+key+'">'+key.toUpperCase()+"</option>";
				convert_select.append(opt);
			}
		});
	}

});

$(document).on("pageinit", "#start", function() {
	setTimeout(function() {
		$.mobile.changePage("#info-1",{transition: "slide"});
	}, 3000);
});

$(document).ready(function (){
	// if( $('#start').hasClass('.ui-page-active'))
	// 	console.log("fffff");

	// while( !$('#start').hasClass('.ui-page-active') ){
	// 	console.log('wtf!!');
	// }
	
});

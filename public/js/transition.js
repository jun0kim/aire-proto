$(function () {
     

    $('.profile-backbtn').on("click", function(){    
        nextPage({
            animation: 1,
            currPage: $('.page-profile'),
            nextPage: $('.page-pay')
        });
    });

    $('.nav-profile').on("click", function(){
        nextPage({
            animation: 2,
            currPage: $('.page-pay'),
            nextPage: $('.page-profile')
        });
    });

    $('.nav-activity').on("click", function(){    
        nextPage({
            animation: 1,
            currPage: $('.page-pay'),
            nextPage: $('.page-activity')
        });
    });

    $('.activity-backbtn').on("click", function(){
        nextPage({
            animation: 2,
            currPage: $('.page-activity'),
            nextPage: $('.page-pay')
        });
    });

    $('.balance').on("click", function(){    
        nextPage({
            animation: 3,
            currPage: $('.page-pay'),
            nextPage: $('.page-balance')
        });
    });

    $('.balance-backbtn').on("click", function(){
        nextPage({
            animation: 4,
            currPage: $('.page-balance'),
            nextPage: $('.page-pay')
        });
    });

    $('.deposit-btn').on("click", function(){    
        nextPage({
            animation: 1,
            currPage: $('.page-balance'),
            nextPage: $('.page-deposit')
        });
    });

    $('.deposit-backbtn').on("click", function(){
        nextPage({
            animation: 2,
            currPage: $('.page-deposit'),
            nextPage: $('.page-balance')
        });
    });

    $('.convert-btn').on("click", function(){    
        nextPage({
            animation: 1,
            currPage: $('.page-balance'),
            nextPage: $('.page-convert')
        });
    });

    $('.convert-backbtn').on("click", function(){
        nextPage({
            animation: 2,
            currPage: $('.page-convert'),
            nextPage: $('.page-balance')
        });
    });

    $('.page-confirm-convert').on("click", function(){
        nextPage({
            animation: 4,
            currPage: $('.page-confirm-convert'),
            nextPage: $('.page-pay')
        });
    });

    $('#name-btn').on("click", function(){
        nextPage({
            animation: 3,
            currPage: $('.balance'),
            nextPage: $('.balance-bar')
        });
    });

    $('.balance-bar').on("click", function(){
        nextPage({
            animation: 4,
            currPage: $('.balance-bar'),
            nextPage: $('.balance')
        });
    });

});

var isAnimating = false,
        endCurrPage = false,
        endNextPage = false,
        animEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
            'animation' : 'animationend'
        },
        animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

function nextPage(options ) {

        var animation = options.animation;

        
        if( isAnimating ) {
            // alert("if-isAnimating");
            return false;
        }

        isAnimating = true;
        
        var $currPage = (options.currPage);

        var $nextPage = (options.nextPage).addClass( 'on' ),
            outClass = '', inClass = '';

        switch( animation ) {

            case 1:
                outClass = 'pt-page-moveToLeft';
                inClass = 'pt-page-moveFromRight';
                break;
            case 2:
                outClass = 'pt-page-moveToRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 3:
                outClass = 'pt-page-moveToTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 4:
                outClass = 'pt-page-moveToBottom';
                inClass = 'pt-page-moveFromTop';
                break;
        }
        
        $currPage.addClass( outClass ).on( animEndEventName, function() {
            $currPage.off( animEndEventName );
            endCurrPage = true;
            
            if( endNextPage ) {
                
                endCurrPage = false;
                endNextPage = false;
                $currPage.removeClass('on');
                $currPage.removeClass(outClass);
                $nextPage.removeClass(inClass);
                isAnimating = false;
            }
        } );

        $nextPage.addClass( inClass ).on( animEndEventName, function() {
            $nextPage.off( animEndEventName );
            endNextPage = true;
            
            if( endCurrPage ) {
                
                endCurrPage = false;
                endNextPage = false;
                $currPage.removeClass('on');
                $currPage.removeClass(outClass);
                $nextPage.removeClass(inClass);
                isAnimating = false;
            }
            
        } );
    }
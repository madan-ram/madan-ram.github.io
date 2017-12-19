var winH,winW;
var isMobile,enableScroll,disableScroll,modalHeight,placeModal,hideModal,showModal,setCookie,getCookie,bindCheck,checkValue,fadeElem,getScrollTop,animateSlide;

(function($) {

    isMobile = function(){
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) || winW<=960
    }

    enableScroll = function(){
        $html = $('html');
        $body = $('body');
        $html.css('overflow', $html.data('previous-overflow'));
        var scrollPosition = $html.data('scroll-position');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);    
        $body.css({'margin-right': 0,'margin-bottom':0});
    }

    disableScroll = function(){
        $html = $('html'); 
        $body = $('body'); 
        var initWidth = $body.outerWidth();
        var initHeight = $body.outerHeight();

        var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
        ];
        $html.data('scroll-position', scrollPosition);
        $html.data('previous-overflow', $html.css('overflow'));
        $html.css('overflow', 'hidden');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);   

        var marginR = $body.outerWidth()-initWidth;
        var marginB = $body.outerHeight()-initHeight; 
        $body.css({'margin-right': marginR,'margin-bottom': marginB});
    }

    modalHeight = function(modal){
        var max_height = winH*0.9;
        var mbody = modal.find('.modal-body');
        var hheight = modal.find('.modal-head').height();
        var bheight = max_height-hheight-70;
        mbody.css({'max-height':bheight+'px'});
    }

    placeModal = function(modal){
        //var previousCss  = $("#myDiv").attr("style");
        var previousCss  = modal.attr("style");
        modal.css({visibility:'hidden', display:'block'});
        var marg_left = modal.width()/2;
        var marg_top = modal.height()/2;
        modal.attr("style",previousCss?previousCss:"");
        modal.css({'margin-top':-marg_top+'px','margin-left':-marg_left+'px'});
    }

    hideModal = function(modal){
        modal.fadeOut(300,function(){
            $(this).removeClass('active');
            $('.modal-backdrop').fadeOut(300);
            enableScroll();
        });
    }

    showModal = function(modal){
        $('.modal-backdrop').fadeIn(300,function(){
            modal.fadeIn(300).addClass('active');
            disableScroll();
        });
    }

    setCookie = function(cname, cvalue, exdays){
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    getCookie = function(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    bindCheck = function(){
        var onClass = "on";
        var showClass = "show";
        $(".fip input,.fip textarea").bind("checkval",function(){
            var label = $(this).parent().find(".fpl");
            if($(this).val() !== ""){
                label.addClass(showClass);
            }else{
                label.removeClass(showClass);
            }
        }).on("keyup",function(){
            $(this).trigger("checkval");
        }).on("focus",function(){
            $(this).parent().find(".fpl").addClass(onClass);
            $(this).parent().addClass('active');
        }).on("blur",function(){
            $(this).parent().find(".fpl").removeClass(onClass);
            $(this).parent().removeClass('active');
            $(this).trigger("checkval");
        }).trigger("checkval");
    }

    checkValue = function(){
        $(".fip input,.fip textarea").each(function(index,el){
            var label = $(this).parent().find(".fpl");
            if($(this).val() !== "")
                label.addClass("show");
            else
                label.removeClass("show");
        });
    }

    fadeElem = function(el){
        el.animate({'opacity':1},{
            step: function(now,fx){
              if(el.hasClass('zoom-elem')){
                  var amt = 0.8 + 0.2*now;
                  $(this).css('transform','scale('+amt+')');
              }
            },
            duration:400,
            complete:function(){}
        },'linear');
    }

    getScrollTop = function(){
        if(typeof pageYOffset!= 'undefined'){
            return pageYOffset;
        }
        else{
            var B= document.body; //IE 'quirks'
            var D= document.documentElement; //IE with doctype
            D= (D.clientHeight)? D: B;
            return D.scrollTop;
        }
    }
    
    $(document).ready(function(e){
        winW = $(window).width();
        winH = $(window).height();
        bindCheck();
        
        //Modal
        $('.modal-backdrop').appendTo('body');
        $('.modal').not('.static').appendTo('body');
        if($('.modal-backdrop').size()>1)
            $('.modal-backdrop.stat').remove();
        $('.modal').not('.static').each(function(index, element) {
            modalHeight($(this));
        });
        $('body').on('click','.modal-toggle',function(e) {
            var modal = $($(this).data('target'));
            placeModal(modal);
            showModal(modal);
        });
        $('body').on('click','.modal-switch',function(e) {
            var modal = $($(this).data('target'));
            placeModal(modal);
            $('.modal.active').fadeOut(300,function(){
                $(this).removeClass('active');
                modal.fadeIn(300).addClass('active');
            });
        });
        $('body').on('click','.modal-close',function(e) {
            hideModal($(this).closest('.modal'));
        });
        $('body').on('click','.modal-backdrop',function(e) {
            if(!$(this).hasClass('stat'))
              hideModal($('.modal.active'));
        });
        
        $('.anim-elem').each(function(index,el){
            $(this).attr('data-offset',$(this).offset().top);
        });
        $('.anim-elem').each(function(){
            startAnim($(this),0,winH);
        });
        
        //Menu
        $('body').on('click','.mtoggle',function(e) {
            if(!$(this).hasClass('active')){
                $(this).addClass('active');
                $('.tnav').addClass('show');
            }
            else{
                $(this).removeClass('active');
                $('.tnav').removeClass('show');
            }
        });

        //Nav
        $('.nlink').click(function(e){
           // alert("hi");
            var that = $(this);
            var tmarg = isMobile() ? 64 : 64;
            var index = $('.nlink').index(that);
            var target = $('.psect:not(".stat")').eq(index);
            var t_off = target.offset().top+25;
//            var t_off = target.offset().top-tmarg;
            $('html,body').animate({scrollTop:t_off+'px'},500);
            $('.nlink.active').removeClass('active');
            that.addClass('active');
        });
        
        //Hash link
        $('.hlink').click(function(e){
            var target = $($(this).data('target'));
            var t_off = target.offset().top-70;
            $('html,body').animate({scrollTop:t_off+'px'},500);
        });
        
    });
    
    var stimer;
    $(window).scroll(function(e){
        
        var scroll_top = getScrollTop();
        $('.anim-elem').each(function(){
            startAnim($(this),scroll_top,winH/2);
        });
        
        $('.ibanner').each(function(index, element) {
            var that = $(this);
            var wheight = $(window).height();
            var offset = that.offset().top;
            var diff = 200;

            var amt = offset - (scroll_top+winH);

            var min_vpoint = (offset - winH)>0 ? offset - winH : 0;
            var max_vpoint = offset + winH;
            var range = max_vpoint - min_vpoint;
            var mdist = (scroll_top<min_vpoint) ? min_vpoint : scroll_top;

            var pos = -((mdist-min_vpoint)/range)*diff;
            pos = pos>0 ? 0 : pos;
            pos = pos<-diff ? -diff : pos;	
            that.css({'background-position':'center '+(pos/5)+'px'});
        });
        
        $('.psect:not(".stat")').each(function(index,el){
            
            var that = $(this);
            if(scroll_top+winH/2>that.offset().top){
                $('.nlink.active').removeClass('active');
                $('.nlink').eq(index).addClass('active');
            }
        });
        
    });
    
    
    function getRandomInt(min,max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function startAnim(that,spos,woff){
        var el_off = that.attr('data-offset');
        if(!that.hasClass('done') && el_off<spos+woff){
            var rtime = getRandomInt(0,300);
            setTimeout(function(){
                //fadeElem(that);
                that.addClass('done');
            },rtime);
        }
    }
    
    function fadeElem(el){
        el.animate({'opacity':1},{
            step: function(now,fx){
              if(el.hasClass('zoom-elem')){
                  var amt = 0.8 + 0.2*now;
                  $(this).css('transform','scale('+amt+')');
              }
            },
            duration:400,
            complete:function(){}
        },'linear');
    }


})(jQuery);

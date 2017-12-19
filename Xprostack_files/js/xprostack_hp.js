$(document).ready(function(){
   
    $('img').on('dragstart', function(event) { event.preventDefault(); }); //Prevent image drag
    $(function() {
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    });

    //form actions
    $(document).on('submit','.contactUsForm',function(e){
        e.preventDefault();
        var ref=$(this);
        var formData=ref.serialize();
        $.post( "mail.php", formData ) 
        .done(function( data ) {
            ref.find('button').text('Submitted').attr('disabled','disabled');
            $('.contactUsForm')[0].reset();
            setTimeout(function(){
                hideModal($('#modal-contactUs'));
            },2000);
          })
        .error(function(){
            alert('Error in submitting form,Please Try Again!');
        });
    });

    $(document).on('submit','.getInTouchForm',function(e){
        e.preventDefault();
        var ref=$(this);
        var formData=ref.serialize();
        $.post( "mail.php", formData ) 
        .done(function( data ) {
            ref.find('button').text('Submitted').attr('disabled','disabled');
            $('.contactUsForm')[0].reset();
            setTimeout(function(){
                hideModal($('#modal-getInTouch'));
            },2000);
          })
        .error(function(){
            alert('Error in submitting form,Please Try Again!');
        })
        ;
    });

    $(document).on('submit','.subscribeForm',function(e){
        e.preventDefault();
        var ref=$(this);
        var formData=ref.serialize();
        $.post( "subscribe.php", formData )
        .done(function( data ) {
            console.log()
            if(data != 'Error'){
                ref.find('button').text('Submitted').attr('disabled','disabled');
                $('.subscribeForm')[0].reset();
                ref.find('button').text('Subscribed!')
                setTimeout(function(){
                    hideModal($('#modal-subscribe'));
                },2000);
            }
            else{
                alert('Name and valid email required.');
            }
          })
        .error(function(){
            alert('Error in submitting form,Please Try Again!');
        });
    });

});
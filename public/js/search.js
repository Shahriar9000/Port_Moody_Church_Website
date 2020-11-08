
$(window).on('load', function () {
    $('#butt').click(function () {
            // alert($("#input").val());
            var a = '/'+ $("#input").val();
            //alert(a);
            window.location.href=a;
    });
});
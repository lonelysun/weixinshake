/**
 * Created by Administrator on 2015/5/25 0025.
 */
(function(){
    $(function(){
        var i=false,des=$('.des'),deviceIpad=false;
    	if(window.navigator.userAgent.indexOf("iPad")>-1)
        {
            deviceIpad=true;
        	document.querySelector('.bottom').style.top="-.51rem";
        }
        function action()
        {
            des.on("click",function(e){
                if(!i)
                {
                    if(deviceIpad)
                    {
                        var div=$('.des');
                        div.css({"left":($('.one').offset().width-div.offset().width)/2.0+"px"});
                    }
                    $('body>div').css({"-webkit-transform":"translate(0,-"+$('.two').offset().height+"px)"});
                    i=true;
                }
                else
                {
                    $('body>div').css({"-webkit-transform":"translate(0,0)"});
                    i=false;
                }
            });
            $('.hand').on("click",function(e){
                if(e.clientY>=offset.top&& e.clientX>=offset.left)
                {
                    if(!i)
                    {
                        $('body>div').css({"-webkit-transform":"translate(0,-"+$('.two').offset().height+"px)"});
                        i=true;
                    }
                }
                else
                {
                    if(i)
                    {
                        $('body>div').css({"-webkit-transform":"translate(0,0)"});
                        i=false;
                    }

                }
            });

            $(".two_btn>div:nth-child(2)").on("click",function(e){
                $('.share').removeClass("none");
            });
        }
        var offset=des.offset();
        action();
    });
   
    function parents(target,elem)
    {
        var parent=target.parentNode;

        while(parent!==elem[0])
        {
            if(parent)
                parent=parent.parentNode;
            else
                return parent;
        }
        return parent;
    }
})();

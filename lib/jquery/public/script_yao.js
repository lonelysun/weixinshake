(function(){
    //var canvas=$("#loadui");
    //var ctx=canvas.getContext('2d');
    //canvas.width=document.documentElement.clientWidth;
    //canvas.height=document.documentElement.clientHeight;
    //ctx.fillStyle="rgba(51,51,51,0.8)"
    //ctx.fillRect(0,0,canvas.width,canvas.height);
    var SHAKE_THRESHOLD =1600;
    var last_update = 0;
    var x=y=z=last_x=last_y=last_z=0;
    var records = [[]];
    var u = navigator.userAgent, app = navigator.appVersion;
    //var shake_flag = $("body").attr("shake_flag");
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isiOS){
        SHAKE_THRESHOLD  = 2200;
    }
    var shake_flag = 1,temp_type,collect_user_info;
    $(function(){
        temp_type=$('#temp_type').val();
        collect_user_info=$('#collect_user_info').val();
        if(collect_user_info=='1')
        {
            pop($('.pop_userinfo'));
            //$('.pop_userinfo').css({"margin":"0 auto"});
        }
        bind();
    });

    function bind()
    {
        //弹窗相关脚本  begin
        $('.close1').on("touchend",function(e){
            e.preventDefault();
            $('body')[0].removeChild($(".pop_bg")[0]);
            $(".pop_2").addClass("none");
            $('body').css({"overflow":"hidden"});
        });
        //提交用户信息
        $('#userinfo_submit').on("click",function(e){
            e.preventDefault();
            var input=$('.pop_userinfo input');
            for(var k=0;k<input.length;k++)//验证空值
            {
                if($(input[k]).val()==$(input[k]).attr('warning'))
                {
                    alert('所有内容都必须填(๑• . •๑)');
                    return;
                }
            }
            if(parseInt($(".pop_userinfo input[name='phone']").val()).toString().length!=11)
            {
                alert('电话号码必须为11位数字哦(๑• . •๑)');
                return;
            }
            $('body')[0].removeChild($(".pop_bg")[0]);
            $(".pop_userinfo").addClass("none");
            var post_data = $("#form1").serializeArray();
            $.ajax({
                url: '/wxf/index/user_info_post',
                type: "post",
                dataType: "json",
                data: post_data,
                success: function (data) {
                    switch(data)
                    {
	                    case 1:
	                    	alert('用户不存在');
	                    	break;
	                    case 2:
	                    	alert('提交失败');
	                    	break;
	                    case 3:
	                    	location.reload();
	                    	break;
	                    case 4:
	                    	alert('验证码错误');
	                    	location.reload(true);
	                    	break;
	                    default:
	                    	alert('未知错误');
                    }
                }
            });
        });
        $('.pop_userinfo input').on('focus',function(e){
            var pop_userinfo_input = $(this).val();
            if(pop_userinfo_input==$(this).attr('warning'))
            {
                $(this).val('');
                $(this).removeClass('warning');
            }
        });
        $('.pop_userinfo input').on('blur',function(e){
            var pop_userinfo_input = $(this).val();
            if(pop_userinfo_input=='')
            {
                $(this).val($(this).attr('warning'));
                $(this).addClass('warning');
            }
        });
        $('.close_div').on("touchend",function(e){
            e.preventDefault();
            $('body')[0].removeChild($(".pop_bg")[0]);
            $(".couponsdetail").addClass("none");
            $(".input_pop").addClass("none");
            $('#pass').val('');
        });
        $('.close3').on("touchend",function(e){
            e.preventDefault();
            $('body')[0].removeChild($(".pop_bg")[0]);
            $(".reddetail").addClass("none");
        });
        $(".pop_1").on("click",function(e){//点击优惠券或者红包
            e.preventDefault();
            if($('.pop_1').attr('type')=='1')//点击红包
            {
                pop($('.red_loading'));
                var detail_id = $("#notice_red").attr('detail_id');
                var link_id   = $("#notice_red").attr('link_id');
                $.ajax({
                    url: '/wxf/red/ajax_get_red_info',
                    type: "post",
                    dataType: "json",
                    data: $.param({red_id: detail_id, link_id: link_id}),
                    success: function (data) {
                        if (data.info == 'succ') {
                            var red_info = data.red_info;
                            var img_src = data.img_src;
                            var red_record_info = data.red_record_info;

                            $(".redtext>p:nth-child(1)").html(red_record_info.money + "元");
                            $(".company").html("恭喜您获得"+$("#notice_p").html()+"红包");
                            $(".reddetail .logo").attr("src", $("#notice_img").attr('src'));
                            pop($('.reddetail'));
                            var div = $('.redtext'), logo = $('.logo');
                            div.css({"left": ($('.reddetail').offset().width - div.offset().width) / 2.0 + "px"});
                            //logo.css({"left": ($('.reddetail').offset().width - logo.offset().width) / 2.0 + "px"});

                        } else {
                            alert('暂时没有相关红包信息');
                            $('body')[0].removeChild($(".pop_bg")[0]);
                            $('.red_loading').addClass('none');
                        }
                    }
                });
            }
            else if($('.pop_1').attr('type')=='2'){//点击优惠券
                var code      = $("#notice_coupon").attr("code");
                var detail_id = $("#notice_coupon").attr("detail_id");
                var user_id   = $("#notice_coupon").attr("user_id");
                var act_id    = $("#notice_coupon").attr("act_id");
                var desc      = $("#notice_coupon").attr("desc");
                //获取优惠券具体信息
                $.ajax({
                    url:'/wxf/index/ajax_qrcode/'+model.admin_id + '/crazy',
                    type: "post",
                    async:false,
                    dataType: "json",
                    data: $.param({new_sn_code:code, coupon_id: detail_id, user_id: user_id, activity_id: act_id}),
                    success:
                        function (data)
                        {
                    	
                    	window.location.href = '/born_wevip_activity/static/bindingWevip.html';
                    	
//                            var arr = data;
//                            var coupon_arr = arr.coupon_arr;
//                            var activity_arr = arr.activity_arr;
//                            var coupon_set_type = arr.coupon_set_type;
//                            var content = arr.content;
//                            $(".coupons_title>img:nth-child(1)").attr('src', coupon_arr.background_img);
//
//                            if (parseInt(coupon_arr.coupon_cat) == 1) {
//                                var coupon_cover_str = '<i>￥</i>' + coupon_arr.coupon_cover;
//                            } else {
//                                var coupon_cover_str = coupon_arr.coupon_cover;
//                            }
//                            $(".coupons_title>div:nth-child(2)").html(coupon_cover_str);
//
//                            $(".couponsdes>P:nth-child(1)").html(desc);
//                            $(".couponsdes>P:nth-child(2)").html("优惠券有效期:" + arr.start_time_str + arr.end_time_str);
//                            $(".couponsdes>P:nth-child(3)").html("温馨提示：" + coupon_arr.kindly_reminder);
//							if(coupon_arr.c_address!= '' && coupon_arr.c_address!= null){
//			                	$("#coupons_details_eq3").html("商户地址："+coupon_arr.c_address);
//			                }else{
//			                	$("#coupons_details_eq3").hide();
//			                }
//                            
//                            if (parseInt(activity_arr.guide_attention) == 0) {
//                                $("#coupon_gzggzh").addClass("none");
//                            }
//                            if (parseInt(activity_arr.guide_attention) == 1) {
//                                $("#coupon_gzggzh").removeClass("none");
//                            }
//                            $(".coupons_detail_de").html(content);
//                            $(".coupons_detail>p").html("SN:" + code);
//                          //  $(".coupons_detail>img").attr("src", arr.img_src);
//                            $("#code").empty();
//                            //var str = toUtf8(code);
//                            $("#code").qrcode({
//                                render: "table",
//                                width: 120,
//                                height:120,
//                                text: code
//                            });
//                            if(data.send_flag=='1')
//                            {
//                                $("#c_sendto").attr("send_flag",data.send_flag);
//                                $("#c_sendto").attr("coupon_id",coupon_arr.id);
//                                $("#c_sendto").attr("sn_code",code);
//                                $('.two_btn').removeClass('none');
//                            }
//                            if (coupon_set_type == 2) {
//                                $("#coupon_hx").addClass("none");
//                            } else {
//                                $("#coupon_hx").removeClass("none");
//                            }
//                            $("#coupon_sn").val(code);
//                            alert(12);
//                            pop($('.couponsdetail'));
//                            var height=document.documentElement.clientHeight*0.65;
//                            $('.coupons_detail').css({"height":height+"px"});
//                            var ttop=(document.documentElement.clientHeight-$('.couponsdetail').offset().height)/2;
//                            $('.couponsdetail').css({"top":ttop+"px"});
                        },
                    error: function () {
                        alert('ajax请求失败');
                    }
                });
            }
            else if($('.pop_1').attr('type')=='4'){//点击卡券
                var link_id = $("#notice_kaquan").attr('link_id');
                //获取优惠券具体信息
                $.ajax({
                    url:'/wxf/index/ajax_get_cardid/'+model.admin_id+'/'+link_id,
                    type: "get",
                    dataType: "json",
                    data: $.param({}),
                    success:
                        function (rs)
                        {
                            if(parseInt(rs['errcode']) != 0){
                                alert(rs['errmsg']);
                            }else{
                                addCard(rs['cardid'],rs['nonceStr'],rs['timestamp'],rs['signature']);
                            }
                        },
                    error: function () {
                        alert('ajax请求失败');
                    }
                });
            }
            else if($('.pop_1').attr('type')=='3'){
            	 var url = $("#notice_page").attr('url');
            	 window.location.href=url;
            }
        });
        $(".two_btn>div:nth-child(2)").on("click",function(e){
            $('.share').removeClass("none");
        });
        $(".share").on("click",function(e){
            $(this).addClass("none");
        });
        $(".alertWarning").on("tap",function(e){
            $(this).addClass("none");
            $('body')[0].removeChild($(".pop_bg")[0]);
        });

        $("#coupon_gzggzh").click(function(){
            var selected_admin_id = $(this).attr("admin_id")
            add_gz(selected_admin_id);
        });
        $("#coupon_hx").click(function(){
            if(model.coupon_set_type == 3){
                pop($('.input_pop'),true);
            }else{
                do_check_destroy();
            }
        });

        $('.input_pop .cancel').on('tap',function(e){
            e.preventDefault();
            $(".input_pop").addClass("none");
            $('#pass').val('');
        });
        $('.input_pop .sure').on('tap',function(e){//点击确认
            e.preventDefault();
            var coupon_sn1 = $('#coupon_sn').val();
            var pass1 = $('#pass').val();
            $.post(
                '/wxf/index/ajax_check_destroy_passport',
                {pass:pass1,coupon_sn:coupon_sn1},
                function(data){
                    $(".load").attr("class",'load none');
                    var arr = eval('('+data+')');
                    if(arr.info =='succ'){
                        do_check_destroy();
                    }else{
                        alert(arr.info);
                        $('#pass').val('');
                    }
                }
            );
        });

        function do_check_destroy(){
            var coupon_sn = $('#coupon_sn').val();
            $.post(
                '/wxf/index/ajax_check_destroy',
                {openid:model.openid,coupon_sn:coupon_sn},
                function(data){
                    var arr = eval('('+data+')');
                    if(arr.info =='succ'){
                        alert('操作成功');
                        $('#pass').val('');
                        window.location.href="/wxf/index/my_award/"+model.admin_id;
                    }else{
                        alert('操作失败')
                    }
                }
            );
        }
        function f()//阻止弹窗穿透方法
        {
            document.addEventListener("touchmove",function(e){
                var touch= e.changedTouches[0];
                var target=touch.target;
                var detail=$(".coupons_detail");
                if($(target).parents(".reddetail").length>0)
                {
                    e.preventDefault();
                }
                else if($(target).parents(".couponsdetail").length>0)
                {
                    if($(target).parents(".coupons_detail").length==0)
                    {
                        if(target.className.indexOf("coupons_detail")>0)
                        {
                            if (detail[0].clientWidth >= detail[0].scrollHeight) {//未出现滚动条
                                e.preventDefault();
                            }
                        }
                        else
                            e.preventDefault();
                    }
                    else
                    {
                        if (detail[0].clientHeight >= detail[0].scrollHeight) {
                            e.preventDefault();
                        }
                    }
                }
            });
        }
        f();
        //弹窗脚本  end
    }
    function deviceMotionHandler(eventData) {
        var acceleration = eventData.accelerationIncludingGravity;
        var curTime = new Date().getTime(),pop_userinfo=$('.pop_userinfo');
        if(pop_userinfo.length>0&&!pop_userinfo.hasClass('none'))
            return;
        if ((curTime - last_update)> 100) {
            var diffTime = curTime -last_update;
            last_update = curTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
            
            if(speed>SHAKE_THRESHOLD){
            	
                if(shake_flag==1)
                {
                    if($('.pop_1').hasClass('none'))
                    {
                        // 发起ajax之前
                        shake_flag = 0;
                        //last_x = x;
                        //last_y = y;
                        //last_z = z;
                        x = y = z = last_x = last_y = last_z = 0;
                        if(temp_type!='1')//模板类型是4 表示端午模板
                        {
                            $(".zhong").css({
                                "-webkit-animation-name": "shake1",
                                "-webkit-animation-duration": "1.1s",
                                "-webkit-animation-iteration-count": "1",
                                "-webkit-transition-timing-function": "ease-out"
                            });
                            setTimeout(function () {//摇完的动作
                                document.querySelector(".zhong").style.webkitAnimation = "respire 3s ease infinite";
                                $('.face').addClass('none');
                                $(".face1").removeClass("none");
                                $(".face1").css({"left": ($(".zhong").offset().width - $(".face1").offset().width) / 2 + "px"});
                                $(".mouth2").css({"left": ($(".face1").offset().width - $(".mouth2").offset().width) / 2 + "px"});
                                document.querySelector(".face1 img:nth-child(1)").style.webkitAnimation = "yun_left 2s linear infinite";
                                document.querySelector(".face1 img:nth-child(2)").style.webkitAnimation = "yun_right 2s linear infinite";
                            }, 1200);
                        }
                        ajax_get_activity();
                        shakevice.play();
                        //post 代码在此
                    }
                }

            }
        }
    }
    function touchendHandler(eventData) {
    	
    	var curTime = new Date().getTime(),pop_userinfo=$('.pop_userinfo');
    	if(pop_userinfo.length>0&&!pop_userinfo.hasClass('none'))
    		return;
    	if (true) {
    	
    		if(true){
    			
    			if(shake_flag==1)
    			{
    				if($('.pop_1').hasClass('none'))
    				{
    					// 发起ajax之前
    					shake_flag = 0;
    					//last_x = x;
    					//last_y = y;
    					//last_z = z;
    					x = y = z = last_x = last_y = last_z = 0;
    					if(temp_type!='1')//模板类型是4 表示端午模板
    					{
    						$(".zhong").css({
    							"-webkit-animation-name": "shake1",
    							"-webkit-animation-duration": "1.1s",
    							"-webkit-animation-iteration-count": "1",
    							"-webkit-transition-timing-function": "ease-out"
    						});
    						setTimeout(function () {//摇完的动作
    							document.querySelector(".zhong").style.webkitAnimation = "respire 3s ease infinite";
    							$('.face').addClass('none');
    							$(".face1").removeClass("none");
    							$(".face1").css({"left": ($(".zhong").offset().width - $(".face1").offset().width) / 2 + "px"});
    							$(".mouth2").css({"left": ($(".face1").offset().width - $(".mouth2").offset().width) / 2 + "px"});
    							document.querySelector(".face1 img:nth-child(1)").style.webkitAnimation = "yun_left 2s linear infinite";
    							document.querySelector(".face1 img:nth-child(2)").style.webkitAnimation = "yun_right 2s linear infinite";
    						}, 1200);
    					}
    					ajax_get_activity();
    					shakevice.play();
    					//post 代码在此
    				}
    			}
    			
    		}
    	}
    }
    function ajax_get_activity(){
       // pop($('.load_ui'));
        $.ajax({
            url: '/yao/yao_api/get_activity_by_user',
            type: "post",
            dataType: "json",
            data: $.param({'activity_id':1,'user_id':2}, true),
            success: function (data) {
                var arr=data;
                if(arr.info== 'succ' ){
                    var detail    = arr.detail;
                    var link_id   = detail.link_id;
                    var detail_id = detail.detail_id;
                    //剩下的次数
                    var next_remain_times = arr.next_remain_times ;
                    var type      = detail.type;
                    var desc      = detail.desc;
                    var logo      = detail.logo;
                    var code      = detail.code;
                    var merchant_name = detail.merchant_name ;
                    var url = detail.url ;

                    $("#notice_p").html(merchant_name) ;
                    if(type ==1){//type=1表示红包
                        $("#notice_red").removeClass("none");
                        $("#notice_coupon").addClass("none");
                        $("#notice_kaquan").addClass("none");
                        $("#notice_page").addClass("none");
                        $("#notice_red").attr('detail_id',detail_id);
                        $("#notice_red").attr('link_id',link_id);
                        //$("#notice_red").attr('merchant_name',merchant_name);
                    }else if(type ==2){
                        $("#notice_coupon").removeClass("none");
                        $("#notice_red").addClass("none");
                        $("#notice_kaquan").addClass("none");
                        $("#notice_page").addClass("none");
                        $("#notice_coupon").attr('code',code);
                        $("#notice_coupon").attr('detail_id',detail_id);
                        $("#notice_coupon").attr('user_id',model.user_id);
                        $("#notice_coupon").attr('act_id',model.activity_id);
                        $("#notice_coupon").attr('desc',desc);

                        if(detail.color != ''){
                        	$('#get_award_notice > div').css('background-color',detail.color);
                        }
                        var sel_admin_id = detail.admin_id;
                        $("#coupon_gzggzh").attr('admin_id',sel_admin_id);
                    }else if(type ==4){//卡券
                        $("#notice_kaquan").removeClass("none");
                        $("#notice_coupon").addClass("none");
                        $("#notice_red").addClass("none");
                        $("#notice_page").addClass("none");
                        $("#notice_kaquan").attr('link_id',link_id);
                    }else if(type ==3){//其它
                    	$("#notice_kaquan").addClass("none");
                        $("#notice_coupon").addClass("none");
                        $("#notice_red").addClass("none");
                        $("#notice_page").removeClass("none");
                        $("#notice_page").attr('link_id',link_id);
                        $("#notice_page").attr('url',url);
                        $("#notice_page").html(desc);
                    }else if(type == 5){
                        $("#notice_coupon").addClass("none");
                        $("#notice_red").addClass("none");
                        $("#notice_kaquan").addClass("none");
                        $("#notice_page").addClass("none");
                        var hb_info_url = '/wxf/index/lottery_jump_hong_bao/'+link_id+'/'+model.openid;
                        $.getJSON(hb_info_url,function(srd){
                            BeaconShakehbJsBridge.ready(function(){
                                //跳转到抽红包页面
                                BeaconShakehbJsBridge.invoke('jumpHongbao', {
                                    lottery_id : srd.lottery_id,
                                    noncestr : srd.noncestr,
                                    openid : srd.openid,
                                    sign : srd.sign
                                });
                            });
                        })
                    }
                    $(".pop_1").attr("type",type);
                    $("#notice_img").attr("src",logo);
                    pop($(".pop_1"));
                }else if(arr.info=='not_have_accord'){
                    pop($(".pop_2"));

                }else if(arr.info =='out_per_limits'){
                    common.alert('您领取奖品的机会用完了!');
                    $('body')[0].removeChild($(".pop_bg")[0]);
                    $('.load_ui').addClass('none');
                }else if(arr.info =='acitvity_stoped'){
                    common.alert('本活动已经停止!',1,function(){
                        window.location.reload();
                    });
                }else if(arr.info =='gt_end_time'){
                    common.alert('本活动已结束');
                    //window.location.reload();
                    $('body')[0].removeChild($(".pop_bg")[0]);
                    $('.load_ui').addClass('none');
                }else if(arr.info == 'lt_start_time'){
                    common.alert('本活动尚未开始!',1,function(){
                        window.location.reload();
                    });

                }else if(arr.info == 'err_all'){
                    alert(arr.detail.return_msg);
                    window.location.reload();
                }else{
                    alert('系统错误');
                     window.location.reload();
                }
            },
            error: function () {
                shake_flag = 1;
                alert('网路异常,请检查你的网络.');
                $('body')[0].removeChild($(".pop_bg")[0]);
                $('.load_ui').addClass('none');
                
            },
            complete: function () {
                return;
            }

        })
    }
    function add_gz(selected_admin_id){
        $.post(
            '/wxf/index/ajax_do_subscribe',
            {appid:model.appid,admin_id:selected_admin_id},
            function(data){
                var arr = eval('('+data+')');
                if(arr.info=='access'){
                    //判断是否关注
                    BeaconAddContactJsBridge.invoke('checkAddContactStatus',{} ,function(apiResult){
                        if(apiResult.err_code == 0){
                            var status = apiResult.data;
                            if(status == 1){
                                common.alert('已关注');
                            }else{
                                //alert('未关注');
                                //跳转到关注页
                                BeaconAddContactJsBridge.invoke('jumpAddContact');
                            }
                        }else{
                            alert(apiResult.err_msg)
                        }
                    });
                }else if(arr.info =='succ_ios'){
                    if(arr.url ==''){

                    }else{
                        location.href= arr.url ;
                    }
                    //暂时先跳转到百度
                    //window.location.href="http://www.baidu.com";
                }else if(arr.info =='succ_android'){

                    if(arr.url ==''){

                    }else{
                        location.href= arr.url ;
                    }

                }else if(arr.info=='not_allowed'){
                    common.alert('手机类型不允许');
                }else{
                    common.alert('关注失败');
                }
            }
        );

    }
    window.pop=function(elem,multi)//调用该方法实现弹窗效果
    {
        var body=$('body');

        if(!$(".pop_bg")[0])
        {
            var div=document.createElement('div');
            div.className="pop_bg";
            div.setAttribute("style","width: 100%;height: 100%;position: fixed;top:0;left: 0;z-index:60;background-color: rgba(168,173,176,0.5)");
            body[0].appendChild(div);
        }

        if(!multi)
            $('.pop').addClass("none");
            shake_flag = 1;
            elem.removeClass("none");
        elem.css({"left":($(document.body).width()-$(elem).width())/2+"px"});
    }
})();

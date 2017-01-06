/**
 * Created by Administrator on 2017/1/5.
 */
/**
 * Created by Administrator on 2017/1/5.
 */
$(function(){
    var currentPath = window.location.pathname;
    var userId = currentPath.slice(12, -10);

    var $tabs = $(".ProfileMain-tabs");
    var finish = false;
    var $loadMore = $(".load-moreAsk");
    var $more = $loadMore.find(".more");
    var $loading = $loadMore.find(".loading");

    // 获取用户个人信息，“回答”、“提问”、“个人信息”都需要
    $.ajax({
        type: "GET",
        url: "/users/user/" + userId,
        contentType: "application/json",
        data: {

        },
        dataType: "json",
        success: function (data) {
            var user = data.user;
            $(".info-author-name").html(user.userName);
            var sex = user.sex ? "男" : "女";
            $(".info-author-gender").find("span").html(sex);
            $(".info-author-experience").find("span").html(user.integral);
            $tabs.find("li").eq(0).find("span").html(user.numOfAnswer);
            $tabs.find("li").eq(0).find("a").attr("href", "/users/user/" + userId + "/answers");
            $tabs.find("li").eq(1).find("span").html(user.numOfQuestion);
            $tabs.find("li").eq(1).find("a").attr("href", "/users/user/" + userId + "/questions");

            // 若是本人的主页，显示“个人信息”选项卡
            if($("#user_id").val() == userId) {
                $tabs.find("li").eq(2).removeClass("hide");
                $tabs.find("li").eq(2).find("a").attr("href", "/users/user/" + userId + "/infos");
            }
        }
    });

    // 获取回答列表
    $.ajax({
        type: "GET",
        url: "/users/u/" + userId + "/questions",
        contentType: "application/json",
        data: {
            page: 0,
            size: 2
        },
        dataType: "json",
        success: function (data) {
            if(data.content.length == 0){
                $loadMore.addClass("hide");
                $("#none-personal-ask").removeClass("hide");
                finish = true;
                return;
            }
            $.each(data.content, function () {
                console.log(this.id);

                var date = new Date(this.time);
                var Y = date.getFullYear() + '-',
                    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                var time = Y+M+D;

                var str = '<div class="ask-item List-item"><button class="delete del-answers commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button><span class="ask-title"><a href="/questions/question/'
                        + this.id + '" target="_blank" title="进入问题主页" id="que-'
                        + this.id + '">'
                        + this.title + '</a></span><div class="ask-status"><span class="ask-statusItem">'
                        + time + '</span><span class="ask-statusItem">'
                        + this.numOfAnswers + '个回答</span></div></div>';


                $("#profile-asks").find(".List-content").append(str);
            });
        }
    });

    // 自动“加载更多”
    $(window).scroll(function() {
        var ks_area = $(window).height();
        var wholeHeight = $(document).height();
        var scrollTop = $(window).scrollTop();

        if(ks_area + scrollTop >= wholeHeight){
            if(finish){
                return;
            }
            if(!this.page){
                this.page = 1;  // 若是第一次“加载更多”
            }else{
                this.page ++;   // 更新加载次数
            }
            var page = this.page;

            $more.addClass("hide");
            $loading.removeClass("hide");

            $.ajax({
                type:"GET",
                url:"/users/u/" + userId + "/answers",
                contentType:"application/json",
                data: {
                    page: page,
                    size: 2
                },
                dataType: "json",
                success: function(data){
                    // 若已没有可加载的数据
                    if(data.content.length == 0){
                        $loading.addClass("hide");
                        finish = true;
                        return;
                    }
                    $.each(data.content, function () {
                        console.log(this.id);

                        var date = new Date(this.time);
                        var Y = date.getFullYear() + '-',
                            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                            D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                        var time = Y+M+D;

                        var str = '<div class="ask-item List-item"><button class="delete del-answers commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button><span class="ask-title"><a href="/questions/question/'
                            + this.id + '" target="_blank" title="进入问题主页" id="que-'
                            + this.id + '">'
                            + this.title + '</a></span><div class="ask-status"><span class="ask-statusItem">'
                            + time + '</span><span class="ask-statusItem">'
                            + this.numOfAnswers + '个回答</span></div></div>';


                        $("#profile-asks").find(".List-content").append(str);
                    });

                    $loading.addClass("hide");
                    $more.removeClass("hide");
                }
            });
        }
    });


    // 删除回答
    $(document).on("click", ".del-answers", function() {
        var delModal = $("#deleteModal");
        var thisItem = $(this).parents(".ask-item");
        var titleOfQue = thisItem.find(".ask-title").find("a").html();
        // 设置模态框的 data-delId 属性为删除项的 id，方便后续删除
        delModal.attr("data-delId", thisItem.attr("id"));
        delModal.find(".modal-body").html('确定要删除你提出的问题 “<strong>' + titleOfQue + '</strong>” 吗？');
    });
    // 确认删除
    $(document).on("click", ".confirm-del", function() {
        var delModal = $(this).parents(".modal");
        var delId = delModal.attr("data-delId");
        var delItem = $("#" + delId);

        delModal.find(".close").click();


    });
});
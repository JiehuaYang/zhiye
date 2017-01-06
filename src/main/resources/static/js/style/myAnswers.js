/**
 * Created by Administrator on 2017/1/5.
 */
$(function(){
    var currentPath = window.location.pathname;
    var userId = currentPath.substr(9);
    if(userId.indexOf('/') != -1) {   // 从“提问”或“个人信息”跳转过来
        userId = currentPath.slice(12, -8);
    }


    var $tabs = $(".ProfileMain-tabs");
    var finish = false;
    var $loadMore = $(".load-moreAns");
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
        url: "/users/u/" + userId + "/answers",
        contentType: "application/json",
        data: {
            page: 0,
            size: 2
        },
        dataType: "json",
        success: function (data) {
            if(data.content.length == 0){
                $loadMore.addClass("hide");
                $("#none-personal-ans").removeClass("hide");
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

                var str = '<div class="answer-item List-item" id="ans-'
                        + this.id + '"><button class="delete del-answers commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button><div class="answer-head "><span class="answer-title"><a href="/questions/question/'
                        + this.question.id + '" target="_blank" title="进入问题主页" id="que-'
                        + this.question.id + '">'
                        + this.question.title + '</a></span><span class="author-link-line"><a href="/users/u/'
                        + this.authorId + '" class="author-link" data-authorId="'
                        + this.authorId + '">'
                        + this.authorName + '</a></span><br /><span class="voters"><span class="voteCount">'
                        + this.numOfSupport + '</span>&nbsp;人赞同</span></div><div class="feed-vote" title="赞一个">'
                        + this.numOfSupport + '</div><div class="answer-text">';
                if(this.type) {
                    var s = this.summary.replace(/<br\/>/g, ' ');
                    str = str + '<div class="feed-summary">'
                        + s + '<span class="expand">显示全部</span></div><div class="feed-summary-whole clearfix hide"></div>';
                }else {
                    str = str + '<div class="feed-summary">'
                        + this.summary + '</div>';
                }

                str = str + '</div><div class="answer-actions feed-meta"><div class="meta-panel"><span class="meta-item answer-date">编辑于'
                    + time + '</span><a href="#" class="meta-item toggle-comment"><span class="glyphicon glyphicon-comment"></span><span class="comment-num">'
                    + this.numOfAnswer + '</span>条评论</a></div><div class="comment-holder hide"><div class="comment-wrapper"><i class="icon icon-spike"></i><div class="comment-box"></div><div class="comment-box-expanded"><div class="comment-box-input"><textarea name="comment-publish" placeholder="写下你的评论" class="form-control"></textarea></div><div class="comment-box-actions clearfix"><button type="button" class="comment-box-submitButton btn btn-sm btn-primary">评论</button></div></div></div></div></div></div>';

                $("#Profile-answers").find(".List-content").append(str);
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
                    $.each(data.content, function(){
                        console.log(this.id);

                        var date = new Date(this.time);
                        var Y = date.getFullYear() + '-',
                            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                            D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                        var time = Y+M+D;

                        var str = '<div class="answer-item List-item" id="ans-'
                            + this.id + '" data-answerThread="'
                            + this.thread + '"><button class="delete del-answers commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button><div class="answer-head "><span class="answer-title"><a href="/questions/question/'
                            + this.question.id + '" target="_blank" title="进入问题主页" id="que-'
                            + this.question.id + '">'
                            + this.question.title + '</a></span><span class="author-link-line"><a href="/users/u/'
                            + this.authorId + '" class="author-link" data-authorId="'
                            + this.authorId + '">'
                            + this.authorName + '</a></span><br /><span class="voters"><span class="voteCount">'
                            + this.numOfSupport + '</span>&nbsp;人赞同</span></div><div class="feed-vote" title="赞一个">'
                            + this.numOfSupport + '</div><div class="answer-text">';
                        if(this.type) {
                            var s = this.summary.replace(/<br\/>/g, ' ');
                            str = str + '<div class="feed-summary">'
                                + s + '<span class="expand">显示全部</span></div><div class="feed-summary-whole clearfix hide"></div>';
                        }else {
                            str = str + '<div class="feed-summary">'
                                + this.summary + '</div>';
                        }

                        str = str + '</div><div class="answer-actions feed-meta"><div class="meta-panel"><span class="meta-item answer-date">编辑于'
                            + time + '</span><a href="#" class="meta-item toggle-comment"><span class="glyphicon glyphicon-comment"></span><span class="comment-num">'
                            + this.numOfAnswer + '</span>条评论</a></div><div class="comment-holder hide"><div class="comment-wrapper"><i class="icon icon-spike"></i><div class="comment-box"></div><div class="comment-box-expanded"><div class="comment-box-input"><textarea name="comment-publish" placeholder="写下你的评论" class="form-control"></textarea></div><div class="comment-box-actions clearfix"><button type="button" class="comment-box-submitButton btn btn-sm btn-primary">评论</button></div></div></div></div></div></div>';

                        $("#Profile-answers").find(".List-content").append(str);
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
        var thisItem = $(this).parents(".answer-item");
        var titleOfQue = thisItem.find(".answer-title").find("a").html();
        // 设置模态框的 data-delId 属性为删除项的 id，方便后续删除
        delModal.attr("data-delId", thisItem.attr("id"));
        delModal.find(".modal-body").html('确定要删除你对问题 “<strong>' + titleOfQue + '</strong>” 的回答吗？');
    });
    // 确认删除
    $(document).on("click", ".confirm-del", function() {
        var delModal = $(this).parents(".modal");
        var delId = delModal.attr("data-delId");
        var delItem = $("#" + delId);

        delModal.find(".close").click();


    });
});
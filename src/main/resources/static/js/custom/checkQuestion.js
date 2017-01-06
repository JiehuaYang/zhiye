/**
 * Created by Administrator on 2017/1/3.
 */

// 全局变量
var finish = false,
    page = 0;

// 获取数据，显示问题具体页
$(function() {
    var currentPath = window.location.pathname;   //    /questions/question/{id}
    var questionId = currentPath.substr(20);
    console.log("questionId: " + questionId);

    var userId = $("#user_id");
    var $loadMore = $(".load-moreAns");
    var $more = $loadMore.find(".more");
    var $loading = $loadMore.find(".loading");

    // 加载问题具体信息***********************************************************************
    $.ajax({
        type: "GET",
        url: "/questions/q/" + questionId,
        contentType: "application/json",
        data: {
            id: questionId
        },
        dataType: "json",
        success: function (data) {
            var question = data.question;

            var date = new Date(question.time);
            var Y = date.getFullYear() + '-',
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
                h = date.getHours() + ':',
                m = date.getMinutes();
            var time = Y+M+D+h+m;

            // 问题标题
            $(".question-title").html('<a href="/questions/question/'
                + question.id + '" class="question-link" target="_blank" id="que-'
                + question.id + '">'
                + question.title + '</a>');
            // 提问者
            $(".author-link-line").html('提出者： <a href="/users/u/'
                + question.authorId + '" class="author-link" data-authorId="'
                + question.authorId + '">'
                + question.authorName + '</a>');
            // 提出时间
            $(".time-line").html('提出时间： <span class="publish-time">'
                + time + '</span>');
            // 问题内容
            var str = '';
            if(question.type) {
                var s = question.summary.replace(/<br\/>/g, ' ');
                str = str + '<div class="feed-summary">'
                    + s + '<span class="expand">显示全部</span></div><div class="feed-summary-whole clearfix hide"></div>';
            }else {
                str = str + '<div class="feed-summary">'
                    + question.summary + '</div>';
            }
            $(".question-detail").html(str);
            // 回答标头（回答的数量）
            $(".answers-title").find("h3").html(question.numOfAnswers + '个回答')
                .attr("data-num", question.numOfAnswers);
        }
    });

    // 初始化问题的回答（默认“按赞数排序”）**********************************************
    updateAnswers("hot");


    // 滑到底部，自动加载更多***********************************************************
    $(window).scroll(function() {
        var ks_area = $(window).height();
        var wholeHeight = $(document).height();
        var scrollTop = $(window).scrollTop();
        // 排序方式不同，请求的路径不同
        var u = "";
        if($("#answers-filter").find("li a").html() == "按时间排序") {  // 现在为“按赞数排序”
            u = "/questions/q/" + questionId + "/comments/hot";
        }else {  // 现在为“按时间排序”
            u = "/questions/q/" + questionId + "/comments/time";
        }

        if(ks_area + scrollTop >= wholeHeight){
            if(finish){
                return;
            }
            if(!page){
                page = 1;  // 若是第一次“加载更多”
            }else{
                page ++;   // 更新加载次数
            }
            var page_ = page;

            $more.addClass("hide");
            $loading.removeClass("hide");

            $.ajax({
                type:"GET",
                url: u,
                contentType:"application/json",
                data: {
                    page: page_,
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
                        // 输出格式：2016-01-23
                        var date = new Date(this.time);
                        var Y = date.getFullYear() + '-',
                            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                            D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                        var time = Y+M+D;

                        console.log("answerId: " + this.id);

                        var str = '<div class="answer-item" id="ans-'
                            + this.id + '" data-answerThread="'
                            + this.thread + '">';
                        if(this.authorId == userId) {
                            str += '<button class="delete del-answers commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button>';
                        }
                        str = str + '<div class="answer-head "><span class="author-link-line"><a href="/users/u/'
                            + this.authorId + '" class="author-link" data-authorId="'
                            + this.authorId + '">'
                            + this.authorName + '</a></span><br /><span class="voters"><span class="voteCount">'
                            + this.numOfSupport + '</span>&nbsp;人赞同 </span></div><div class="feed-vote" title="赞一个">'
                            + this.numOfSupport + ' </div><div class="answer-text">';
                        if(this.type) {
                            var s = this.summary.replace(/<br\/>/g, ' ');
                            str = str + '<div class="feed-summary">'
                                + s + '<span class="expand">显示全部</span></div><div class="feed-summary-whole clearfix hide"></div>';
                        }else {
                            str = str + '<div class="feed-summary">'
                                + this.summary + '</div>';
                        }
                        str = str + '</div><div class="answer-actions"><div class="meta-panel"><span class="meta-item answer-date">编辑于'
                            + time + '</span><a href="#" class="meta-item toggle-comment"><span class="glyphicon glyphicon-comment"></span><span class="comment-num">'
                            + this.numOfAnswer + '</span>条评论</a></div><div class="comment-holder hide"><div class="comment-wrapper"><i class="icon icon-spike"></i><div class="comment-box"></div><div class="comment-box-expanded"><div class="comment-box-input">'
                            + '<textarea name="comment-publish" placeholder="写下你的评论" class="form-control"></textarea></div><div class="comment-box-actions clearfix">'
                            + '<button type="button" class="comment-box-submitButton btn btn-sm btn-primary">评论</button></div></div>';

                        // 插入文档流
                        $(".answers-wrap").append(str);
                    });

                    $loading.addClass("hide");
                    $more.removeClass("hide");
                }
            });
        }
    });

    // 切换排序方式*****************************************************************
    $(document).on("click", "#answers-filter li", function () {
        // 重置全局变量
        finish = false;
        page = 0;

        // 切换到“按赞数排序”
        if($(this).find("a").html() == "按赞数排序") {
            $(this).find("a").html("按时间排序");
            $(this).parent().siblings("button").html('按赞数排序 <span class="caret"></span>');

            updateAnswers("hot");
        }else {   // 切换到“按时间排序”
            $(this).find("a").html("按赞数排序");
            $(this).parent().siblings("button").html('按时间排序 <span class="caret"></span>');

            updateAnswers("time");
        }
    });




    // 回答问题，先清除模态框中输入框的内容
    $(document).on("click", ".btn-answer", function(){
        $("#answerModal textarea").val("");
    });

    // 提交回答
    $(document).on("click", ".btn-submit-answer", function(){
        alert("提交");

        var userName = $("#user_name").val();
        var $textarea = $(this).parents(".modal-content").find("textarea").eq(0);
        var answerContent = $textarea.val();
        if(checkEmpty($textarea)){
            alert("请输入你的回答！");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/comments/comment",
            contentType: "application/json",
            data: JSON.stringify({
                question: {
                    id: questionId
                },
                authorId: userId,
                authorName: userName,
                summary: answerContent
            }),
            dataType: "json",
            success: function (data) {
                // 关闭模态框
                // $(this).parents(".modal-content").find(".close").click();
                // $("#popModal").find(".modal-body").html("回答成功");
                // $("#popModal").modal("show");
                alert("提交成功");
            }
        });
    });
});


// 检查是否为空
function checkEmpty(target) {
    var value = target.val().replace(/\s+/g,"");  /*消除字符串所有空格*/
    if(value == ""){
        return true;
    }else{
        return false;
    }
}

// 更新回答
function updateAnswers(filter) {
    // 先清空
    $(".answers-wrap").html('<div id="none-question-ans" class="common-box none hide">暂时没有回答 ~</div>');

    var userId = $("#user_id").val();
    var questionId = window.location.pathname.substr(20);
    var $loadMore = $(".load-moreAns");

    if(filter == "time") {
        u = "/questions/q/" + questionId + "/comments/time";
    }else {
        u = "/questions/q/" + questionId + "/comments/hot";
    }

    $.ajax({
        type: "GET",
        url: u,
        contentType: "application/json",
        data: {
            page: 0,  // 初始化，页数为0
            size: 2
        },
        dataType: "json",
        success: function(data){
            console.log("data: " + data);

            // 若没有数据，回答为空
            if(data.content.length == 0){
                $loadMore.addClass("hide");
                $("#none-question-ans").removeClass("hide");
                finish = true;
                return;
            }
            $.each(data.content, function(){
                // 输出格式：2016-01-23
                var date = new Date(this.time);
                var Y = date.getFullYear() + '-',
                    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                var time = Y+M+D;

                console.log("answerId: " + this.id);

                var str = '<div class="answer-item" id="ans-'
                    + this.id + '" data-answerThread="'
                    + this.thread + '">';
                if(this.authorId == userId) {
                    str += '<button class="delete del-answers commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button>';
                }
                str = str + '<div class="answer-head "><span class="author-link-line"><a href="/users/u/'
                    + this.authorId + '" class="author-link" data-authorId="'
                    + this.authorId + '">'
                    + this.authorName + '</a></span><br /><span class="voters"><span class="voteCount">'
                    + this.numOfSupport + '</span>&nbsp;人赞同 </span></div><div class="feed-vote" title="赞一个">'
                    + this.numOfSupport + ' </div><div class="answer-text">';
                if(this.type) {
                    var s = this.summary.replace(/<br\/>/g, ' ');
                    str = str + '<div class="feed-summary">'
                        + s + '<span class="expand">显示全部</span></div><div class="feed-summary-whole clearfix hide"></div>';
                }else {
                    str = str + '<div class="feed-summary">'
                        + this.summary + '</div>';
                }
                str = str + '</div><div class="answer-actions"><div class="meta-panel"><span class="meta-item answer-date">编辑于'
                    + time + '</span><a href="#" class="meta-item toggle-comment"><span class="glyphicon glyphicon-comment"></span><span class="comment-num">'
                    + this.numOfAnswer + '</span>条评论</a></div><div class="comment-holder hide"><div class="comment-wrapper"><i class="icon icon-spike"></i><div class="comment-box"></div><div class="comment-box-expanded"><div class="comment-box-input">'
                    + '<textarea name="comment-publish" placeholder="写下你的评论" class="form-control"></textarea></div><div class="comment-box-actions clearfix">'
                    + '<button type="button" class="comment-box-submitButton btn btn-sm btn-primary">评论</button></div></div>';

                // 插入文档流
                $(".answers-wrap").append(str);
            });
        }
    });
}
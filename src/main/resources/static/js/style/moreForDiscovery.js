/**
 * Created by Administrator on 2017/1/4.
 */
/**
 * Created by Administrator on 2017/1/1.
 */

// 全局变量
var finish = false,
    page = 0;

$(document).ready(function(){
    var userId = $("#user_id").val();
    var $loadMore = $(".load-more");
    var $more = $loadMore.find(".more");
    var $loading = $loadMore.find(".loading");


    // 初始化发现
    updateDiscovery("hot");


    // 滑到底部，自动加载更多
    $(window).scroll(function() {
        var ks_area = $(window).height();
        var wholeHeight = $(document).height();
        var scrollTop = $(window).scrollTop();

        // 根据现在的排序方式确定请求路径
        var u = "";
        if($(".time-filter").hasClass("selected-filter")) {
            u = "/questions/time";
        }else {
            u = "/questions/hot";
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
            console.log("page: " + page_);
            $more.addClass("hide");
            $loading.removeClass("hide");

            $.ajax({
                type:"GET",
                url:u,
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
                        console.log("questionId: " + this.id);
                        console.log("content: " + this.summary);

                        console.log("time: " + this.time);

                        var date = new Date(this.time);
                        var Y = date.getFullYear() + '-',
                            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                            D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                        var time = Y+M+D;

                        var str = '<div class="feed-item common-box" id="que-' + this.id + '"><div class="feed-item-inner"><div class="feed-main">';
                        // 区分是不是用户自己“回答”的，加上“删除”
                        if(this.authorId == userId) {
                            str += '<button class="delete del-ask commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button>';
                        }
                        str = str + '<div class="feed-source"><span class="author-link-line"><a href="/users/u/'
                            + this.authorId + '" class="author-link">'
                            + this.authorName + '</a></span><span class="author-do"> 提出了问题</span></div><h2 class="feed-title ask-title"><a href="/questions/question/'
                            + this.id + '" class="question-link" target="_blank">'
                            + this.title + '</a></h2><div class="feed-content">';

                        // 若文本内容大于255，replace掉数据中的<br/>，并提供“显示全部”
                        // 若小于255，保留<br/>，不提供“显示全部”
                        if(this.type) {
                            var s = this.summary.replace(/<br\/>/g, ' ');
                            str = str + '<div class="feed-summary">'
                                + s + '<span class="expand">显示全部</span></div><div class="feed-summary-whole clearfix hide"></div>';
                        }else {
                            str = str + '<div class="feed-summary">'
                                + this.summary + '</div>';
                        }

                        str = str + '</div><div class="feed-meta"><span class="meta-item answer-date">编辑于'
                            + time + '</span><span class="meta-item meta-answer"><span class="answer-count">'
                            + this.numOfAnswers + '</span>个回答</span></div></div></div></div>';

                        // 插入文档流
                        $("#home-feed-list").append(str);
                    });

                    $loading.addClass("hide");
                    $more.removeClass("hide");
                }
            });
        }
    });


    // 切换排序方式
    $(document).on("click", ".question-filter span", function () {
        // 重新获取列表，重置全局变量
        finish = false;
        page = 0;

        // 重新请求问题列表
        if($(this).hasClass("time-filter")) {
            updateDiscovery("time");
        }else {
            updateDiscovery("hot");
        }
    });
});

// 更新“发现”
function updateDiscovery(filter) {
    // 先清空问题列表
    $("#home-feed-list").html('<div id="none-dynamic-ask" class="common-box none hide">暂时没有提问 ~</div>'
        + '<div class="question-filter common-box"><span class="logReg-textButton unselectable hot-filter selected-filter">热门排序</span><span class="logReg-textButton unselectable time-filter">时间排序</span></div>');

    var userId = $("#user_id").val();
    var $loadMore = $(".load-more");
    var u = "";   // 请求路径
    if(filter == "time") {
        $(".time-filter").addClass("selected-filter");
        $(".hot-filter").removeClass("selected-filter");
        u = "/questions/time";
    }else {
        $(".hot-filter").addClass("selected-filter");
        $(".time-filter").removeClass("selected-filter");
        u = "/questions/hot";
    }

    console.log("url: " + u);
    $.ajax({
        type:"GET",
        url:u,
        contentType:"application/json",
        data: {
            page: 0,  // 初始化，页数为0
            size: 2
        },
        dataType: "json",
        success: function(data){
            // 若没有数据，发现为空
            if(data.content.length == 0){
                $loadMore.addClass("hide");
                $("#none-dynamic-ask").removeClass("hide");
                finish = true;
                return;
            }
            $.each(data.content, function(){
                console.log("questionId: " + this.id);
                console.log("content: " + this.summary);

                console.log("time: " + this.time);
                
                var date = new Date(this.time);
                var Y = date.getFullYear() + '-',
                    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                var time = Y+M+D;

                var str = '<div class="feed-item common-box" id="que-' + this.id + '"><div class="feed-item-inner"><div class="feed-main">';
                // 区分是不是用户自己“回答”的，加上“删除”
                if(this.authorId == userId) {
                    str += '<button class="delete del-ask commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button>';
                }
                str = str + '<div class="feed-source"><span class="author-link-line"><a href="/users/u/'
                    + this.authorId + '" class="author-link">'
                    + this.authorName + '</a></span><span class="author-do"> 提出了问题</span></div><h2 class="feed-title ask-title"><a href="/questions/question/'
                    + this.id + '" class="question-link" target="_blank">'
                    + this.title + '</a></h2><div class="feed-content">';

                // 若文本内容大于255，replace掉数据中的<br/>，并提供“显示全部”
                // 若小于255，保留<br/>，不提供“显示全部”
                if(this.type) {
                    var s = this.summary.replace(/<br\/>/g, ' ');
                    str = str + '<div class="feed-summary">'
                        + s + '<span class="expand">显示全部</span></div><div class="feed-summary-whole clearfix hide"></div>';
                }else {
                    str = str + '<div class="feed-summary">'
                        + this.summary + '</div>';
                }

                str = str + '</div><div class="feed-meta"><span class="meta-item answer-date">编辑于'
                    + time + '</span><span class="meta-item meta-answer"><span class="answer-count">'
                    + this.numOfAnswers + '</span>个回答</span></div></div></div></div>';

                // 插入文档流
                $("#home-feed-list").append(str);
            });
        }
    });
}
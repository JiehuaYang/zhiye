/**
 * Created by Administrator on 2017/1/1.
 */
$(document).ready(function(){
    var userId = $("#user_id").val();
    var finish = false;
    var $loadMore = $(".load-moreH");
    var $more = $loadMore.find(".more");
    var $loading = $loadMore.find(".loading");
    // 初始化首页
    $.ajax({
        type:"GET",
        url:"/comments/hot",
        contentType:"application/json",
        data: {
            page: 0,  // 初始化，页数为0
            size: 2
        },
        dataType: "json",
        success: function(data){
            // 若没有数据，首页为空
            if(data.content.length == 0){
                $loadMore.addClass("hide");
                $("#none-dynamic-ans").removeClass("hide");
                finish = true;
                return;
            }
            $.each(data.content, function(){
                // console.log(this.id);
                // console.log(this.summary);
                // console.log(this.type);

                // 输出格式：2016-01-23
                var date = new Date(this.time);
                var Y = date.getFullYear() + '-',
                    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                    // h = date.getHours() + ':',
                    // m = date.getMinutes() + ':',
                    // s = date.getSeconds();
                var time = Y+M+D;
                // var time = Y+M+D+h+m+s;

                var str = '<div class="feed-item common-box" id="ans-'
                    + this.id + '" data-answerThread="'
                    + this.thread + '"><div class="feed-item-inner"><div class="feed-main">';
                // 区分是不是用户自己“回答”的，加上“删除”
                if(this.authorId == userId) {
                    str += '<button class="delete del-answers commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button>';
                }
                str = str + '<div class="feed-source"><span class="author-link-line"><a href="/users/u/'
                    + this.authorId + '" class="author-link" data-authorId="'
                    + this.authorId + '">'
                    + this.authorName + '</a></span> <span class="author-do">回答了问题</span></div><div class="feed-vote';
                if(this.support){
                    str=str+' voted" title="取消赞">';
                }else{
                    str=str+'" title="赞一个">';
                }
                str=str+this.numOfSupport + '</div><h2 class="feed-title"><a href="/questions/question/'
                    + this.question.id + '" class="question-link" target="_blank" id="que-'
                    + this.question.id + '">'
                    + this.question.title + '</a></h2><div class="feed-content">';
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

                str = str + '</div><div class="answer-actions feed-meta"><div class="meta-panel"><span class="meta-item answer-date">编辑于'
                    + time + '</span><a href="#" class="meta-item toggle-comment"><span class="glyphicon glyphicon-comment"></span><span class="comment-num">'
                    + this.numOfAnswer + '</span>条评论</a></div><div class="comment-holder hide"><div class="comment-wrapper"><i class="icon icon-spike"></i><div class="comment-box"></div><div class="comment-box-expanded"><div class="comment-box-input"><textarea name="comment-publish" placeholder="写下你的评论" class="form-control"></textarea></div><div class="comment-box-actions clearfix"><button type="button" class="comment-box-submitButton btn btn-sm btn-primary">评论</button></div></div></div></div></div></div></div></div>';

                // 插入文档流
                $("#home-feed-list").append(str);
            });
        }
    });


    // 滑到底部，自动加载更多
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
                url:"/comments/hot",
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
                        // console.log(this.id);
                        // console.log(this.summary);
                        // console.log(this.type);

                        // 输出格式：2016-01-23
                        var date = new Date(this.time);
                        var Y = date.getFullYear() + '-',
                            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                            D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                        // h = date.getHours() + ':',
                        // m = date.getMinutes() + ':',
                        // s = date.getSeconds();
                        var time = Y+M+D;
                        // var time = Y+M+D+h+m+s;

                        var str = '<div class="feed-item common-box" id="ans-'
                            + this.id + '" data-answerThread="'
                            + this.thread + '"><div class="feed-item-inner"><div class="feed-main">';
                        // 区分是不是用户自己“回答”的，加上“删除”
                        if(this.authorId == userId) {
                            str += '<button class="delete del-answers commentBox-textButton" data-toggle="modal" data-target="#deleteModal">删除</button>';
                        }
                        str = str + '<div class="feed-source"><span class="author-link-line"><a href="/users/u/'
                            + this.authorId + '" class="author-link" data-authorId="'
                            + this.authorId + '">'
                            + this.authorName + '</a></span> <span class="author-do">回答了问题</span></div><div class="feed-vote';
                        if(this.support){
                            str=str+' voted" title="取消赞">';
                        }else{
                            str=str+'" title="赞一个">';
                        }
                        str=str+this.numOfSupport + '</div><h2 class="feed-title"><a href="/questions/question/'
                            + this.question.id + '" class="question-link" target="_blank" id="que-'
                            + this.question.id + '">'
                            + this.question.title + '</a></h2><div class="feed-content">';
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

                        str = str + '</div><div class="answer-actions feed-meta"><div class="meta-panel"><span class="meta-item answer-date">编辑于'
                            + time + '</span><a href="#" class="meta-item toggle-comment"><span class="glyphicon glyphicon-comment"></span><span class="comment-num">'
                            + this.numOfAnswer + '</span>条评论</a></div><div class="comment-holder hide"><div class="comment-wrapper"><i class="icon icon-spike"></i><div class="comment-box"></div><div class="comment-box-expanded"><div class="comment-box-input"><textarea name="comment-publish" placeholder="写下你的评论" class="form-control"></textarea></div><div class="comment-box-actions clearfix"><button type="button" class="comment-box-submitButton btn btn-sm btn-primary">评论</button></div></div></div></div></div></div></div></div>';

                        // 插入文档流
                        $("#home-feed-list").append(str);
                    });

                    $loading.addClass("hide");
                    $more.removeClass("hide");
                }
            });
        }
    });

});
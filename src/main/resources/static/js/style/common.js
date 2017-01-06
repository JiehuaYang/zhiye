$(function(){
    var userId = $("#user_id").val();
	// “显示全部”与“收起”***********************************************************
	$(document).on("click", ".expand", function(){
		var $parent = $(this).parent();
		$parent.addClass("hide");
		$parent.next().removeClass("hide");	
	});
	$(document).on("click", ".pack-up", function(){
		var $parent = $(this).parent();
		$parent.addClass("hide");
		$parent.prev().removeClass("hide");
	});
	$(document).on("click", ".feed-summary", function(event){
		if($(event.target).hasClass("expand")){
			return true;
		}
		$(this).find(".expand").click();
	});

	// 显示评论******************************************************************8
	$(document).on("click", ".toggle-comment", function(event){
		event.preventDefault();

		// 取得对应回答id的评论
		// var $item = $(this).parents(".feed-item") == undefined ? $(this).parents(".feed-item") : $(this).parents(".List-item");
		if($(this).parents(".feed-item").html()) {
			var $item = $(this).parents(".feed-item");
		}else if($(this).parents(".List-item").html()) {
			var $item = $(this).parents(".List-item");
		}else {
			var $item = $(this).parents(".answer-item");
		}

		// 收起评论，不进行请求
		if(!$item.find(".comment-holder").hasClass("hide")) {
			// alert("收起评论");
            $(this).parent().next().toggleClass("hide");
            $(this).toggleClass("on");
			return true;
		}

        $item.find(".comment-box").empty();       // 清空评论区域
		var answerId = $item.attr("id").substr(4);
		var answerThread = $item.attr("data-answerThread");
		var questionId = $(this).parents(".feed-main").find(".question-link").attr("id").slice(4);
		//alert(questionId);
        $.ajax({
            type: "GET",
            url: "/comments/q/" + questionId + "/child",
            contentType: "application/json",
            data: {
				uid: userId,
				thread: answerThread + answerId + '/'
            },
            dataType: "json",
            success: function (data) {
                console.log("answerId: " + answerId);
                console.log("newThread: " + answerThread + answerId + '/');
                if(data.length == 0){
                	alert("id为" + answerId + "的回答没有评论");
                    return;
                }
                $.each(data, function(){
                	alert("此评论的id：" + this.id);

                    // 输出格式：01-23 18:55
                    var date = new Date(this.time);
                    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                        D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
                        h = date.getHours() + ':',
                        m = date.getMinutes();
                    var time = M+D+h+m;

                    var str = '<div class="commentItem" data-commentId="'
						+ this.id + '"><div class="commentItem-header"><a href="/users/u/'
						+ this.authorId + '" class="author-link">'
						+ this.authorName + '</a>';
                    // 此为回复
                    if(this.replyId) {
						str = str + ' 回复 <a href="/users/u/'
                            + this.replyId + '" class="author-link">'
                            + this.replyName + '</a>';
                    }
                    // 此为本人发起的评论或回复
                    if(this.authorId == userId) {
                    	str += '<button type="button" class="btn commentBox-textButton delete-button">删除</button>';
					}
					str = str + '</div><div class="commentItem-content">'
						+ this.summary + '</div><div class="commentItem-footer"><span class="commentItem-likes"><span>'
						+ this.numOfSupport + '</span><span>赞</span></span><time>'    // 10-29&nbsp;17:23
						+ time + '</time><a class="commentItem-action action-reply unselectable"><span class="glyphicon glyphicon-comment"></span><span>回复</span></a>';
                    // 用户之前是否点赞过此评论或回复
                    if(this.support) {
                    	str += '<a class="commentItem-action action-like unselectable on"><span class="glyphicon glyphicon-thumbs-up"></span><span>赞</span></a></div></div>';
					}else {
						str += '<a class="commentItem-action action-like unselectable"><span class="glyphicon glyphicon-thumbs-up"></span><span>赞</span></a></div></div>';
                    }
                    // 插入文档流
                    $item.find(".comment-box").append(str);
                });
            }
        });


		$(this).parent().next().toggleClass("hide");
		$(this).toggleClass("on");
	});

	// 具体评论中显示回复和点赞
	$(document).on("mouseenter", ".commentItem", function(event){
		$(this).find(".commentItem-action").css("visibility", "visible");
	});
	$(document).on("mouseleave", ".commentItem", function(event){
		$(this).find(".commentItem-action").css("visibility", "hidden");
	});

	// 蓝色方框的点赞（点赞回答）*******************************************************
	$(document).on("click", ".feed-vote", function(){
        // var $item = $(this).parents(".feed-item") == "undefined" ? $(this).parents(".feed-item") : $(this).parents(".List-item");
        if($(this).parents(".feed-item").html()) {
            var $item = $(this).parents(".feed-item");
        }else if ($(this).parents(".List-item").html()){
            var $item = $(this).parents(".List-item");
        }else {
        	var $item = $(this).parents(".answer-item");
		}
        var answerId = $item.attr("id").substr(4);
		var $this = $(this);

		console.log("userId: " + userId + "     answerId: " + answerId);

		// 点赞
		if(!$this.hasClass("voted")){
			//alert(userId);
			//alert(answerId);
            $.ajax({
                type: "POST",
                url: "/supports/support",
                contentType: "application/json",
                data: JSON.stringify({
                    userId: userId,
                    commentId: answerId
                }),
                dataType: "json",
                success: function (data) {
                	//alert(data.result);
                    var voteNum;
                    $this.toggleClass("voted");
					voteNum = parseInt($this.html()) + 1;
					$this.attr("title", "取消赞");
                    $this.html(voteNum);
                    if($this.siblings(".answer-head").find(".voteCount")){
                        $this.siblings(".answer-head").find(".voteCount").html(voteNum);
                    }
                }
            });
		}else {  // 取消赞
			//alert(userId);
			//alert(answerId);
            $.ajax({
                type: "POST",
                url: "/supports/support/remove",
                data:{
                    userId: userId,
                    commentId: answerId
                },
                dataType: "json",
                success: function (data) {
                    var voteNum;
                    $this.toggleClass("voted");
					voteNum = parseInt($this.html()) - 1;
					$this.attr("title", "赞一个");
                    $this.html(voteNum);
                    if($this.siblings(".answer-head").find(".voteCount")){
                        $this.siblings(".answer-head").find(".voteCount").html(voteNum);
                    }
                }
            });
		}
	});

	// 对评论的点赞、回复*************************************************************
	$(document).on("click", ".commentItem-action", function(event){
		event.preventDefault();
		var $comment = $(this).parents(".commentItem");
		var commentId = $comment.attr("data-commentId");
		console.log("commentId: " + commentId);

		$(this).toggleClass("on");
		var $this = $(this);

		if($(this).hasClass("action-like")){
			if($this.hasClass("on")) {
                $.ajax({
                    type: "POST",
                    url: "/supports/support",
                    contentType: "application/json",
                    data: JSON.stringify({
                        userId: userId,
                        commentId: commentId
                    }),
                    dataType: "json",
                    success: function (data) {
                        var $numLikes = $this.siblings(".commentItem-likes").find("span").eq(0);
                        var newNumLikes = parseInt($numLikes.html()) + 1;
                        $numLikes.html(newNumLikes);
                    }
                });
			}else {
                $.ajax({
                    type: "POST",
                    url: "/supports/support/remove",
                    data: {
                        userId: userId,
                        commentId: commentId
                    },
                    dataType: "json",
                    success: function (data) {
                        var $numLikes = $this.siblings(".commentItem-likes").find("span").eq(0);
                        var newNumLikes = parseInt($numLikes.html()) - 1;
                        $numLikes.html(newNumLikes);
                    }
                });
			}
		}else if($(this).hasClass("action-reply")){
			var writeReply = '<div class="commentReply-expanded"><div class="commentReply-input"><textarea name="comment-reply" placeholder="写下你的评论" class="form-control"></textarea></div><div class="commentReply-actions"><button type="button" class="commentReply-submitButton btn btn-sm btn-primary">评论</button><button type="button" class="commentReply-cancelButton commentBox-textButton">取消</button></div></div>';
			var $writeReply = $(writeReply);
			if($(this).hasClass("on")){
				$(this).parents(".commentItem").append($writeReply);
			}else{
				$(this).parents(".commentItem").find(".commentReply-expanded").remove();
			}
		}
	});
	// 取消回复或确认回复
	$(document).on("click", ".commentReply-actions button", function(){
		if($(this).hasClass("commentReply-cancelButton")){
			$(this).parents(".commentItem").find(".action-reply").click();
		}else if($(this).hasClass("commentReply-submitButton")){
			// 回复评论后，添加到评论区
			// 取得原评论的信息
			var $item = $(this).parents(".commentItem");
			var $author = $item.find(".commentItem-header").find(".author-link").eq(0);
			var $input = $item.find(".commentReply-input textarea").eq(0);
			if(checkEmpty($input)){
				alert("请输入你的回复！");
				return false;
			}

            // 回复评论******************************************************




            var replyLink = "xuedinge.html";
			var replyName = "鬼怪大叔";
			var beRepliedLink = $author.attr("href");
			var beRepliedName = $author.html();
			var commentContent = $input.val();
			var voteCount = 0;
			// 取得当前时间
			var date = new Date();
			var timeTitle = date.getFullYear() + "-" + setPreZero((date.getMonth() + 1)) + "-" + setPreZero(date.getDate()) + " "
					+ setPreZero(date.getHours()) + ":" + setPreZero(date.getMinutes()) + ":" + setPreZero(date.getSeconds());
			var time = setPreZero((date.getMonth() + 1)) + "-" + setPreZero(date.getDate()) + "&nbsp;" + setPreZero(date.getHours()) + ":" + setPreZero(date.getMinutes());

			var newComment = '<div class="commentItem"><div class="commentItem-header"><a href="' 
						+ replyLink + '" class="author-link">' 
						+ replyName + '</a> 回复 <a href="' 
						+ beRepliedLink + '" class="author-link">' 
						+ beRepliedName + '</a><button type="button" class="btn commentBox-textButton delete-button">删除</button></div><div class="commentItem-content">' 
						+ commentContent + '</div><div class="commentItem-footer"><span class="commentItem-likes"><span>' 
						+ voteCount + '</span> <span>赞</span></span><time title="' 
						+ timeTitle + '">' 
						+ time + '</time><a class="commentItem-action action-reply unselectable"><span class="glyphicon glyphicon-comment"></span><span>回复</span></a><a class="commentItem-action action-like unselectable"><span class="glyphicon glyphicon-thumbs-up"></span><span>赞</span></a></div></div>';
			var $newComment = $(newComment);
			$newComment.insertBefore($(this).parents(".comment-box").find(".commentItem").eq(0));	

			// 更新总评论数
			var newNum = parseInt($(this).parents(".answer-actions").find(".comment-num").html()) + 1;
			$(this).parents(".answer-actions").find(".comment-num").html(newNum);
			// 模拟“取消”被点击
			$(this).siblings(".commentReply-cancelButton").click();
		}
	});
	// 提交评论
	$(document).on("click", ".comment-box-actions .comment-box-submitButton", function(){
		var $input = $(this).parent().prev().find("textarea").eq(0);
        // var $item = $(this).parents(".feed-item") == "undefined" ? $(this).parents(".feed-item") : $(this).parents(".List-item");
        if($(this).parents(".feed-item").html()) {
            var $item = $(this).parents(".feed-item");
        }else if($(this).parents(".List-item").html()) {
            var $item = $(this).parents(".List-item");
        }else {
        	var $item = $(this).parents(".answer-item");
		}
        var answerId = $item.attr("id").substr(4),
			answerThread = $item.attr("data-answerThread");
		var $authorLink = $item.find(".author-link"),
			authorId = $authorLink.attr("data-authorId"),
			authorName = $authorLink.html();

		var $questionLink = $item.find(".question-link"),
			questionId = $questionLink.attr("id").substr(4);

		var $this = $(this);

		console.log(answerId);
		console.log(questionId);
		if(checkEmpty($input)){
			alert("请输入你的评论！");
			return false;
		}
		// 提交评论*******************************************************
		$.ajax({
			type: "POST",
			url: "/comments/comment",
			contentType: "application/json",
			data: JSON.stringify({
				parentId: answerId,
				question: {
					id: questionId
				},
				authorId: userId,
				authorName: $("#user_name").val(),
                replyId: authorId,
                replyName: authorName,
				thread: answerThread + answerId + "/",
				summary: $input.val()
			}),
			dataType: "json",
			success: function (data) {
				var content = data.content;
				console.log("提交评论后：" + content);

                // 输出格式：01-23 18:55
                var date = new Date(content.time);
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
               	 	D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
                	h = date.getHours() + ':',
                	m = date.getMinutes();
                var time = M+D+h+m;

                var newComment = '<div class="commentItem" data-commentId="'
					+ content.id + '"><div class="commentItem-header"><a href="/users/u/'
                    + content.authorId + '" class="author-link">'
                    + content.authorName + '</a> 回复 <a href="/users/u/'
                    + content.replyId + '" class="author-link">'
                    + content.replyName + '</a><button type="button" class="btn commentBox-textButton delete-button">删除</button></div><div class="commentItem-content">'
                    + content.summary + '</div><div class="commentItem-footer"><span class="commentItem-likes"><span>'
                    + 0 + '</span> <span>赞</span></span><time title="'
                    + time + '">'
                    + time + '</time><a class="commentItem-action action-reply unselectable"><span class="glyphicon glyphicon-comment"></span><span>回复</span></a><a class="commentItem-action action-like unselectable"><span class="glyphicon glyphicon-thumbs-up"></span><span>赞</span></a></div></div>';


				var $newComment = $(newComment);
                // 更新总评论数
                var $ansActions = $this.parents(".answer-actions");
                var oldNum = parseInt($ansActions.find(".comment-num").html());
                $ansActions.find(".comment-num").html(oldNum + 1);
                // 插入DOM
                if(oldNum == 0){
                    $ansActions.find(".comment-box").append($newComment);
                    // $ansActions.find(".load-more").removeClass("hide");
                }else{
                    $newComment.insertBefore($ansActions.find(".comment-box .commentItem").eq(0));
                }
                // 清空输入框
                $input.val("");
            }
		});
	});
	// 删除回复或评论
	$(document).on("click", ".commentItem .delete-button", function(){
		// 更新总评论数
		var $ansActions = $(this).parents(".answer-actions");
		var oldNum = parseInt($ansActions.find(".comment-num").html());
		$ansActions.find(".comment-num").html(oldNum - 1);
		// 若删除后，评论数为 0，隐藏“加载更多”
		if(oldNum - 1 == 0){
			// $ansActions.find(".load-more").addClass("hide");
		}
		$(this).parents(".commentItem").remove();
	});



	// 提问，先清除模态框中输入框的内容
	$(document).on("click", ".SearchBar-askButton", function(){
		$("#askModal textarea").val("");
	});
	// 提交提问
	/*
	$(document).on("click", ".btn-submit-ask", function(){
		var $questionTitle = $(this).parents(".modal-content").find("textarea").eq(0);
		var $questionDesc = $(this).parents(".modal-content").find("textarea").eq(1);
		if(checkEmpty($questionTitle)){
			alert("请输入你的问题！");
			return false;
		}else if(checkEmpty($questionDesc)){
			alert("请输入你的问题描述！");
			return false;
		}

		var askerLink = "xuedinge.html";
		var askerName = "鬼怪大叔";
		var answerCount = 0;   // 回答数为 0

		// -------------------------------------------------------------------------
		// -------------------------------------------------------------------------
		// 从 textarea 取得的文本，保留空格和换行
		var reg = new RegExp("\r\n","g");
		var reg1 = new RegExp(" ","g"); 
		var questionTitle = $questionTitle.val();
		var briefDesc = $questionDesc.val();
		var wholeDesc = $questionDesc.val().replace(reg,"<br/>");
		wholeDesc = wholeDesc.replace(reg1,"&nbsp;");

		var date = new Date();
		var publishTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

		// 将发布的提问的相关信息 askerLink, askerName, answerCount,
		// questionTitle, briefDesc, wholeDesc, publishTime 传入后台（ajax）
		$.ajax({ 
            type: "POST",   
            url: "",
            data: {
                askerLink: askerLink,
                askerName: askerName,
                answerCount: answerCount,
                questionTitle: questionTitle,
                briefDesc: briefDesc,
                wholeDesc: wholeDesc,
                publishTime: publishTime
            },
            dataType: "json",
            success: function(data){   
            	alert("提问发布成功！");
                return true;
            },
            error: function(jqXHR){    // post请求失败
                alert("发生错误：" + jqXHR.status);  
            }   
        });

		// 关闭模态框
		$(this).parents(".modal-content").find(".close").click();
	});
	*/
});



// 为Date时间设置前导零
function setPreZero(value){
	var valString = value + "";
	var length = valString.length;
	if(value == 0 || valString == "00"){
		return "00";
	}else if(length == 1){
		return "0" + value;
	}else{
		return value;
	}
}
// 检查是否为空
function checkEmpty(target) {
    var value = target.val().replace(/\s+/g,"");  /*消除字符串所有空格*/
    if(value == ""){
        return true;
    }else{
        return false;
    }
}       
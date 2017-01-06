$(function(){
	// 回答问题，先清除模态框中输入框的内容
	$(document).on("click", ".btn-answer", function(){
		$("#answerModal textarea").val("");
	});

	// 提交回答
	$(document).on("click", ".btn-submit-answer", function(){
		var $textarea = $(this).parents(".modal-content").find("textarea").eq(0);
		if(checkEmpty($textarea)){
			alert("请输入你的回答！");
			return false;
		}
		var answererLink = "xuedinge.html";
		var answererName = "鬼怪大叔";
		var voteCount = 0;

		// -------------------------------------------------------------------------
		// -------------------------------------------------------------------------
		// 从 textarea 取得的文本，保留空格和换行
		var reg = new RegExp("\r\n","g");
		var reg1 = new RegExp(" ","g"); 
		var briefContent = $textarea.val();
		var wholeContent = $textarea.val().replace(reg,"<br/>");
		wholeContent = wholeContent.replace(reg1,"&nbsp;");


		var commentCount = 0;

		var date = new Date();
		var publishTime = date.getFullYear() + "-" + setPreZero((date.getMonth() + 1)) + "-" + setPreZero(date.getDate());

		var newAnswer = '<div class="answer-item"><div class="answer-head "><span class="author-link-line"><a href="'
				 + answererLink + '" class="author-link">' 
				 + answererName + '</a></span><br /><span class="voters"><span class="voteCount">' 
				 + voteCount + '</span>&nbsp;人赞同</span></div><div class="feed-vote" title="赞一个">' 
				 + voteCount + '</div><div class="answer-text"><div class="feed-summary">' 
				 + briefContent + '...<span class="expand">显示全部</span></div><div class="feed-summary-whole clearfix hide">' 
				 + wholeContent + '<button type="button" class="btn pack-up">收起</button></div></div><div class="answer-actions"><div class="meta-panel"><span class="meta-item answer-date">编辑于' 
				 + publishTime + '</span><a href="#" class="meta-item toggle-comment"><span class="glyphicon glyphicon-comment"></span><span class="comment-num">' 
				 + commentCount + '</span>条评论</a></div><div class="comment-holder hide"><div class="comment-wrapper"><i class="icon icon-spike"></i><div class="comment-box"></div><div class="load-more hide"><span class="more">加载更多>></span><span class="loading hide">加载中...</span></div><div class="comment-box-expanded"><div class="comment-box-input"><textarea name="comment-publish" placeholder="写下你的评论" class="form-control"></textarea></div><div class="comment-box-actions clearfix"><button type="button" class="comment-box-submitButton btn btn-sm btn-primary">评论</button></div></div></div></div></div></div>';
		var $newAnswer = $(newAnswer);
		$newAnswer.insertBefore($(".answers-wrap").find(".answer-item").eq(0));
		// 关闭模态框
		$(this).parents(".modal-content").find(".close").click();
	});

	// 选择排序方式
	// var $filter = $("#answers-filter");
	// var $checkedOne = $filter.find("button");
	// var $anotherOne = $filter.find("ul li a");
	// 下拉菜单中的选项被选中时
	// $anotherOne.click(function(event){
	// 	event.preventDefault();
	// 	if($(this).html() == "按时间排序"){
	// 		$(this).html("按赞数排序");
	// 		$checkedOne.html('按时间排序 <span class="caret"></span>');
	// 	}else{
	// 		$(this).html("按时间排序");
	// 		$checkedOne.html('按赞数排序 <span class="caret"></span>');
	// 	}
	// });
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
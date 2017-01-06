/**
 * Created by Administrator on 2017/1/3.
 */
// 超过250字的问题的“显示全部”和“收起”
// 两种场景：1、“发现”中的问题  2、问题具体页的问题描述
$(function() {
    // “显示全部”与“收起”
    $(document).on("click", ".feed-content .feed-summary .expand, .question-detail .feed-summary .expand", function(){
        var $parent = $(this).parent();
        if($parent.parents(".feed-item").html()) {
            var $item = $parent.parents(".feed-item");
        }else {
            var $item = $parent.parents(".List-item");
        }
        var questionId = $item.attr("id").substr(4);  // 取得问题的id


        console.log("questionId: " + questionId);
        // 取得全文的内容
        $.ajax({
            url: "/questions/q/" + questionId + "/detail",
            type: "GET",
            data: {
                id: questionId
            },
            dataType: "json",
            success: function(data){
                console.log("data: " + data);
                console.log("data.result: " + data.result);
                console.log("data.content: " + data.content);
                // 设置全文的 html 为 data.content
                var str = data.content;
                $parent.next().html(str + '<button type="button" class="btn pack-up">收起</button>');
            }
        });

        $parent.addClass("hide");            // 隐藏简文
        $parent.next().removeClass("hide");  // 显示全文
    });
});
/**
 * Created by Administrator on 2017/1/4.
 */
// 回答的展开
// 两种场景：1、首页里“回答”的展开  2、个人主页“回答”的展开
$(function () {
    $(document).on("click", ".expand", function () {
        var $parent = $(this).parent();
        if($parent.parents(".feed-item").html()) {
            var $item = $parent.parents(".feed-item");
        }else {
            var $item = $parent.parents(".List-item");
        }
        var answerId = $item.attr("id").substr(4);

        $.ajax({
            url: "/comments/c/" + answerId + "/detail",
            type: "GET",
            data: {},
            dataType: "json",
            success: function(data){
                // 设置全文的 html 为 data.content
                var str = data.content;
                $parent.next().html(str + '<button type="button" class="btn pack-up">收起</button>');
            }
        });

        $parent.addClass("hide");            // 隐藏简文
        $parent.next().removeClass("hide");  // 显示全文
    });
});
$(function() {
	// 删除 “回答”
	$(document).on("click", ".del-answers", function() {
		var delModal = $("#deleteModal");
		var thisItem = $(this).parents(".feed-item");
		var titleOfQue = thisItem.find(".feed-title").find(".question-link").html();
		// 设置模态框的 data-delId 属性为删除项的 id，方便后续删除
		delModal.attr("data-delId", thisItem.attr("id"));
		delModal.find(".modal-body").html('确定要删除你对问题 “<strong>' + titleOfQue + '</strong>” 的回答吗？');
	});
	// 删除“提问”
	$(document).on("click", ".del-ask", function() {
		var delModal = $("#deleteModal");
		var thisItem = $(this).parents(".feed-item");
		var titleOfQue = thisItem.find(".feed-title").find(".question-link").html();
		delModal.attr("data-delId", thisItem.attr("id"));
		delModal.find(".modal-body").html('确定要删除你提出的问题 “<strong>' + titleOfQue + '</strong>” 吗？');
	});


	// 确认删除
	$(document).on("click", ".confirm-del", function() {
		var delModal = $(this).parents(".modal");
		var delId = delModal.attr("data-delId");
		var delItem = $("#" + delId);

		delModal.find(".close").click();

		// 删除的是“提问”还是“回答”，做不同处理，url不同
		var delType = delId.substr(8, 3);
		if(delType == "ans") {
			$.ajax({
	        	type: "POST",
	        	url: "",
	        	data:{
        			ansId: delId,
        			userId: $("#user_id").val()
        		},
	        	success: function(data){
	        		if(data == "success"){
	        			alert("成功");
						delItem.remove();
	        		}else{
	        			alert("失败");
	        		}
	        	}
	        });
		}else {
			$.ajax({
	        	type: "POST",
	        	url: "",
	        	data:{
        			ansId: delId,
        			userId: $("#user_id").val()
        		},
	        	success: function(data){
	        		if(data == "success"){
	        			alert("成功");
						delItem.remove();
	        		}else{
	        			alert("失败");
	        		}
	        	}
	        });
		}
	});
});
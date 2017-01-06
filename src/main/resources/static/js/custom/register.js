/**
 * Created by pc on 2016/12/30.
 */
//var path="/zhiye";
$(document).ready(function(){
   var $popModal = $("#popModal");
   $("#register").click(function(event){
      var $email = $("#email");
      var $username = $("#username");
      var $password1 = $("#password");
      var $password2 = $("#password2");

      var email = $email.val();
      var username = $username.val();
      var password1 = $password1.val();
      var password2 = $password2.val();

      var $errorMessage = $(".errorMessage");
      var errorMessage = "";
      var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;

      if(!reg.test(email)) {
          errorMessage = "请填入正确的邮箱";
          $errorMessage.html(errorMessage);
      }
      else if(username.replace(/\s+/g,'') == "") {
          errorMessage = "请输入用户名";
          $errorMessage.html(errorMessage);
      }
      else if(username.length > 20) {
          errorMessage = "用户名不能超过20个字符";
          $errorMessage.html(errorMessage);
      }
      else if(password1.replace(/\s+/g,'') == "") {
          errorMessage = "请输入密码";
          $errorMessage.html(errorMessage);
      }
      else if(password2 != password1) {
          errorMessage = "两次密码输入不一致";
          $errorMessage.html(errorMessage);
      }
      else {
          $errorMessage.html("");
          $.ajax({
              type:"POST",
              url:"/users/user",
              data:{
                  email:email,
                  username:username,
                  password1:password1,
                  password2:password2
              },
              dataType:"json",
              success:function(data){
                  console.log(JSON.stringify(data));
                  if(data.flag=="success"){
                      $popModal.find(".modal-body").html("注册成功");
                      $popModal.modal("show");
                  }else{
                      $popModal.find(".modal-body").html("注册失败，"+data.content);
                      $popModal.modal("show");
                  }
              }
          })
      }
   });

    $popModal.find(".modal-footer button").click(function () {
        $popModal.find(".close").click();
    });
});
package com.scut.controller;

import com.scut.dto.*;
import com.scut.entity.*;
import com.scut.service.*;
import com.scut.util.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

import javax.annotation.*;
import javax.servlet.http.*;
import java.util.*;

/**
 * Created by pc on 2017/1/2.
 */
@Controller
@RequestMapping(value = "/comments")
public class CommentController {
    @Resource
    private CommentService commentService;
//插入评论
    @PostMapping(value = "/comment")
    @ResponseBody
    public Message<Comment> insertComment(@RequestBody Comment comment){
        Message<Comment> message=new Message<>();
        Comment comment1=commentService.saveComment(comment);
        comment1.setSummary(ContentUtil.transform(comment1.getSummary()));
        if(comment1!=null){
            message.setFlag("success");
            message.setContent(comment1);
        }else{
            message.setFlag("fail");
        }
        return message;
    }
//查看热门回答（首页)
    @GetMapping(value = "/hot")
    @ResponseBody
    public Map<String,Object> showHotCommentsByPage(@RequestParam(value = "page",defaultValue = "0")Integer page,
                                                    @RequestParam(value = "size",defaultValue = "2")Integer size,
                                                    HttpSession session){
        User user=(User)session.getAttribute("user");
        Integer userId;
        if(user==null){
            userId=null;
        }else{
            userId=user.getId();
        }
        Sort sort=new Sort(Sort.Direction.DESC,"numOfSupport");
        Pageable pageable=new PageRequest(page,size,sort);
        Page<Comment> commentPage=commentService.getHotCommentsByPage(pageable,userId);
        Map<String,Object> map=new HashMap<>();
        map.put("content",commentPage.getContent());
        return map;
    }
//查看回答的子评论
    @GetMapping(value = "/q/{qid}/child")
    @ResponseBody
    public List<Comment> getChildComment(@RequestParam(required = false)Integer uid,
                                         @RequestParam("thread")String thread,
                                         @PathVariable("qid")Integer qid){
        List<Comment> commentList = commentService.getChildComment(uid,qid, thread);
        return commentList;
    }
//查看回答的具体内容
    @GetMapping(value = "/c/{id}/detail")
    @ResponseBody
    public Map<String,String> showCommentDetail(@PathVariable("id")Integer id){
        CommentContent commentContent=commentService.findByCommentId(id);
        Map<String,String> map=new HashMap<>();
        if(commentContent!=null){
            map.put("result","success");
            map.put("content", commentContent.getContent());
        }else{
            map.put("result", "fail");
        }
        return map;
    }

    @PostMapping(value = "/comment/{cid}/remove")
    @ResponseBody
    public int removeComment(@PathVariable("cid")Integer cid,
                                @RequestParam("uid")Integer uid){
        //更新的评论数
        int number = commentService.removeComment(cid, uid);
        return number;
    }

}

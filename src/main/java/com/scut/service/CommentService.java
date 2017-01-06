package com.scut.service;

import com.scut.dao.*;
import com.scut.entity.*;
import com.scut.util.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;
import org.springframework.web.bind.annotation.*;

import javax.annotation.*;
import java.sql.*;
import java.util.*;

/**
 * Created by pc on 2017/1/2.
 */
@Service
public class CommentService {
    @Resource
    private CommentDao commentDao;
    @Resource
    private CommentContentDao commentContentDao;
    @Resource
    private SupportDao supportDao;
    @Resource
    private QuestionDao questionDao;

    @Transactional
    public Comment saveComment(Comment comment) {
        if(comment.getQuestion().getId()==null
                || comment.getAuthorId()==null || comment.getAuthorName()==null
                ||comment.getSummary()==null){
            return null;
        }
        Timestamp time=new Timestamp(System.currentTimeMillis());
        comment.setTime(time);
        System.out.println(comment);
        String summary=comment.getSummary();
        if(summary.length()>200){
            comment.setSummary(summary.substring(0,200));
            comment=commentDao.save(comment);
            CommentContent commentContent=new CommentContent(comment.getId(),summary);
            commentContentDao.save(commentContent);
        }else{
           comment=commentDao.save(comment);
        }
        //问题增加一个评论
        questionDao.addComment(comment.getQuestion().getId());
        //评论增加一个评论
        if(comment.getParentId()!=null){
            commentDao.addChildComment(comment.getParentId());
        }
//        comment.setSummary(ContentUtil.transform(comment.getSummary()));
        return comment;
    }


    public Page<Comment> getHotCommentsByPage(Pageable pageable,Integer uid) {
        Page<Comment> commentPage = commentDao.findByHot(pageable);
        List<Comment> commentList = commentPage.getContent();
        if(uid!=null){
            for(Comment comment:commentList){
                comment.setSummary(ContentUtil.transform(comment.getSummary()));
                if(supportDao.isSupportExisted(uid,comment.getId())>0){
                    comment.setSupport(true);
                }
            }
        }
        return commentPage;
    }

    public List<Comment> getChildComment(Integer uid, Integer qid, String thread) {
        List<Comment> commentList=commentDao.findByThread(qid,thread);
        if(uid!=null){
            for(Comment comment:commentList){
                comment.setSummary(ContentUtil.transform(comment.getSummary()));
                if(supportDao.isSupportExisted(uid,comment.getId())>0){
                    comment.setSupport(true);
                }
            }
        }
        return commentList;
    }


    public CommentContent findByCommentId(Integer id) {
        CommentContent commentContent = commentContentDao.findByCommentId(id);
        if(commentContent!=null){
            commentContent.setContent(ContentUtil.transform(commentContent.getContent()));
        }
        return commentContent;
    }

    @Transactional
    public int removeComment(Integer cid, Integer uid) {
        Comment comment=commentDao.findById(cid);
        if(comment==null || !comment.getAuthorId().equals(uid)){
            return 0;
        }
        //获得要删除的评论数（该评论+子评论）
        int number = commentDao.getNumOfChildComment(comment.getThread()+cid+"/")+1;
        //删除该评论,获得删除的评论数(该评论及其子评论)
        commentDao.removeComment(cid,comment.getThread()+cid+"/");
        System.out.println("number:"+number);
        //如果有父评论，则其回答数减number
        if(comment.getParentId()!=null){
            commentDao.subNumOfAnswer(comment.getParentId(),number);
        }

        //更新问题评论数
        questionDao.substractComment(comment.getQuestion().getId(),number);
        return number;
    }
}

package com.scut.service;

import com.scut.dao.*;
import com.scut.entity.*;
import com.scut.util.*;
import com.sun.org.apache.xml.internal.utils.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;

import javax.annotation.*;
import javax.naming.event.*;
import java.sql.*;
import java.util.*;

/**
 * Created by pc on 2016/12/31.
 */
@Service
public class QuestionService {
    @Resource
    private QuestionDao questionDao;
    @Resource
    private QuestionContentDao questionContentDao;
    @Resource
    private CommentDao commentDao;
    @Resource
    private SupportDao supportDao;

    @Transactional
    public Question insert(Question question) {
        Timestamp time=new Timestamp(System.currentTimeMillis());
        question.setTime(time);
        String summary=question.getSummary();
//        System.out.print("summary:"+summary);
        question.setNumOfAnswers(0);
        if(summary.length()>200){
            question.setSummary(summary.substring(0,200));
            question.setType(1);
            question=questionDao.save(question);
            QuestionContent questionContent=new QuestionContent(question.getId(),summary);
            questionContentDao.save(questionContent);
        }else{
            question=questionDao.save(question);
        }
        question.setSummary(ContentUtil.transform(question.getSummary()));
        return question;
    }


    public QuestionContent getQuestionContent(Integer id) {
        QuestionContent q=questionContentDao.findByQuestionId(id);
        if(q!=null){
            q.setContent(ContentUtil.transform(q.getContent()));
        }
        return q;
    }

    public Page<Question> getQuestionListByPageOrderByTime(Pageable pageable) {
        Page<Question> questionPage = questionDao.findAll(pageable);
        List<Question> questions = questionPage.getContent();
        for(Question q:questions){
            q.setSummary(ContentUtil.transform(q.getSummary()));
        }
        return questionPage;
    }

    public Page<Question> getQuestionListByPageOrderByHot(Pageable pageable) {
        Page<Question> questionPage = questionDao.findAll(pageable);
        List<Question> questions = questionPage.getContent();
        for(Question q:questions){
            q.setSummary(ContentUtil.transform(q.getSummary()));
        }
        return questionPage;
    }

    public int  getQuestionCountByAuthorId(Integer uid){
        return questionDao.getQuestionCountByAuthorId(uid);
    }

    public Question getQuestionById(Integer qid) {
        Question question = questionDao.findById(qid);
       if(question!=null){
           question.setSummary(ContentUtil.transform(question.getSummary()));
       }
        return question;
    }

    public Map<String,Object> getQuestionComments(Integer uid,Integer qid, Pageable pageable) {
        Page<Comment> commentPage = commentDao.getQuestionComments(qid, pageable);
        List<Comment> commentList=commentPage.getContent();
        if(uid!=null){
            for(Comment comment:commentList){
                comment.setSummary(ContentUtil.transform(comment.getSummary()));
                if(supportDao.isSupportExisted(uid,comment.getId())>0){
                    comment.setSupport(true);
                }
            }
        }
        Map<String, Object> map = new HashMap<>();
        map.put("last", commentPage.isLast());
        map.put("content", commentList);
        return map;
    }

    @Transactional
    public boolean removeQuestion(Integer qid, Integer uid) {
        if(questionDao.removeQuestion(qid,uid)>0){
            return true;
        }else{
            return false;
        }
    }

    public List<Question> searchQuestion(String key) {
        List<Question> questionList=questionDao.getQuestionsByKey(key);
        for(Question q:questionList){
            q.setSummary(ContentUtil.transform(q.getSummary()));
        }
        return questionList;
    }
}

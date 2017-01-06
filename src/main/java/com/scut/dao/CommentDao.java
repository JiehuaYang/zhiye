package com.scut.dao;


import com.scut.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.*;
import org.springframework.data.repository.Repository;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;

import java.util.*;

/**
 * Created by pc on 2017/1/2.
 */
@org.springframework.stereotype.Repository
public interface CommentDao extends Repository<Comment,Integer>{
//    Comment save(Comment comment);

    Comment save(Comment comment);

    @Query("select c from Comment c where c.thread='/'")
    Page<Comment> findByHot(Pageable pageable);

    @Query("select count(c.id) from Comment c where c.authorId=?1 and c.thread='/'")
    Integer getCommentCountByUserId(Integer id);

    @Query("select c from Comment c where c.thread='/' and c.authorId=?1")
    Page<Comment> getUserAnswers(Integer uid, Pageable pageable);

    @Query("select c from Comment c where c.question.id=?1 and c.thread like CONCAT(?2,'%') order by c.time desc")
    List<Comment> findByThread(Integer qid,String thread);

    @Query("select c from Comment c where c.question.id=?1")
    Page<Comment> getQuestionComments(Integer qid, Pageable pageable);


    @Query("update Comment c set c.numOfAnswer=c.numOfAnswer+1 where c.id=?1")
    @Modifying
    void addChildComment(Integer parentId);

    Comment findById(Integer cid);

    @Query("update Comment c set c.numOfAnswer=c.numOfAnswer-?2 where c.id=?1")
    void subNumOfAnswer(Integer parentId,Integer number);

    @Query("delete from Comment c where c.id=?1 or c.thread like concat(?2,'%') ")
    @Modifying
    int removeComment(Integer cid, String thread);

    @Query("update Comment c set c.numOfSupport=c.numOfSupport+1 where c.id=?1")
    @Modifying
    void addSupport(Integer commentId);

    @Query("update Comment c set c.numOfSupport=c.numOfSupport-1 where c.id=?1")
    @Modifying
    void removeSupport(Integer commentId);

    @Query("select count(c.id) from Comment c where c.thread like concat(?1,'%')")
    int getNumOfChildComment(String thread);
}

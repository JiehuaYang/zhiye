package com.scut.dao;

import com.scut.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.*;
import org.springframework.data.repository.Repository;
import org.springframework.stereotype.*;

import java.util.*;

/**
 * Created by pc on 2016/12/31.
 */
@org.springframework.stereotype.Repository
public interface QuestionDao extends Repository<Question,Integer>{
    Question save(Question question);

    //    List<Question> findAll();
    Page<Question> findAll(Pageable pageable);

    @Query("select q from Question q where q.authorId=?1")
    Page<Question> getUserQuestion(Integer uid, Pageable pageable);

    @Query("select count(q.id) from Question q where q.authorId=?1")
    int getQuestionCountByAuthorId(Integer uid);


    Question findById(Integer qid);

    @Query("delete from Question q where q.id=?1 and q.authorId=?2")
    int removeQuestion(Integer qid, Integer uid);

    @Query("select q from Question q where q.title like concat('%',?1,'%') ")
    List<Question> getQuestionsByKey(String key);

    @Query("update Question  q set q.numOfAnswers=q.numOfAnswers+1 where q.id=?1")
    @Modifying
    void addComment(Integer id);

    @Query("update Question q set q.numOfAnswers=q.numOfAnswers-?2 where q.id=?1")
    @Modifying
    void substractComment(int qid,int number);
}

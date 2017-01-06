package com.scut.dao;

import com.scut.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.*;
import org.springframework.data.repository.Repository;
import org.springframework.stereotype.*;

/**
 * Created by pc on 2017/1/3.
 */
@org.springframework.stereotype.Repository
public interface SupportDao extends Repository<Support,Integer> {

    @Query("select count(s.id) from Support s where s.userId=?1 and s.commentId=?2")
    int isSupportExisted(Integer uid, Integer id);

    void save(Support support);

    @Query("delete from Support s where s.userId=?1 and s.commentId=?2")
    @Modifying
    int deleteByUserIdAndCommentId(Integer uid, Integer commentId);
}

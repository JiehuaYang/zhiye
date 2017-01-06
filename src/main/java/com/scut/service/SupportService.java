package com.scut.service;

import com.scut.dao.*;
import com.scut.entity.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;

import javax.annotation.*;

/**
 * Created by pc on 2017/1/3.
 */
@Service
public class SupportService {
    @Resource
    private SupportDao supportDao;
    @Resource
    private CommentDao commentDao;

    @Transactional
    public boolean save(Support support) {
        try{
            supportDao.save(support);
            //增加评论的赞数
            commentDao.addSupport(support.getCommentId());
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public boolean removeSupport(Integer uid, Integer commentId) {
        if(supportDao.deleteByUserIdAndCommentId(uid,commentId)>0){
            commentDao.removeSupport(commentId);//评论的赞数减一
            return true;
        }else{
            return false;
        }
    }
}

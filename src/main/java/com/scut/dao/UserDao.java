package com.scut.dao;

import com.scut.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.Repository;
import java.util.*;

/**
 * Created by pc on 2016/12/30.
 */
@org.springframework.stereotype.Repository
public interface UserDao extends Repository<User,Integer> {
    //增加用户
    void save(User user);
    //根据id查找用户
    User findOne(Integer id);

    //根据email跟password查找用户
    @Query("select u from User u where u.email=?1 and u.password=?2")
    User findByEmailAndPassword(String email, String password);


    @Modifying
    @Query("update User u set u.sex=?2 where u.id=?1")
    void updateUserSex(Integer uid, Integer sex);

    @Modifying
    @Query("update User u set u.password=?3 where u.id=?1 and u.password=?2")
    int updatePassword(Integer uid, String oldPass, String newPass);

    @Query("select u from User u where u.userName like concat('%',?1,'%') ")
    List<User> searchUserByKey(String key);
}

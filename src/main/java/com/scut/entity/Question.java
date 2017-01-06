package com.scut.entity;

import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.*;
import java.util.*;

/**
 * Created by pc on 2016/12/31.
 */
@Entity
@Table(name = "question")
@DynamicInsert
public class Question {
    private Integer id;
    private Integer authorId;
    private String authorName;
    private String title;
    private String summary;
    private Integer numOfAnswers;
    private Timestamp time;
    private Integer type;

//    private List<Comment> commentList=new ArrayList<>();

//    @OneToMany(fetch = FetchType.EAGER)
//    public List<Comment> getCommentList() {
//        return commentList;
//    }
//
//    public void setCommentList(List<Comment> commentList) {
//        this.commentList = commentList;
//    }

    @Id
    @GeneratedValue
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "author_id")
    public Integer getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Integer authorId) {
        this.authorId = authorId;
    }

    @Column(name = "author_name")
    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    @Column(name = "num_of_answer")
    public Integer getNumOfAnswers() {
        return numOfAnswers;
    }

    public void setNumOfAnswers(Integer numOfAnswers) {
        this.numOfAnswers = numOfAnswers;
    }

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", authorId=" + authorId +
                ", authorName='" + authorName + '\'' +
                ", title='" + title + '\'' +
                ", summary='" + summary + '\'' +
                ", numOfAnswers=" + numOfAnswers +
                ", time=" + time +
                ", type=" + type +
                '}';
    }
}

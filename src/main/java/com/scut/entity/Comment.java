package com.scut.entity;

import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.*;

/**
 * Created by pc on 2017/1/2.
 */
@Entity
@Table
@DynamicInsert
public class Comment {
    private Integer id;
    private Integer parentId;
    private Integer authorId;
    private String authorName;
    private Integer replyId;
    private String replyName;
    private String thread;
    private String summary;
    private Timestamp time;
    private Integer numOfSupport;
    private Integer numOfAnswer;
    private Question question;
    private boolean isSupport;
    private Integer type;

    public Comment(){
        isSupport=false;
    }

    @ManyToOne
    @JoinColumn(name = "question_id",nullable = false)
    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    @Column(name = "num_of_support")
    public Integer getNumOfSupport() {
        return numOfSupport;
    }

    public void setNumOfSupport(Integer numOfSupport) {
        this.numOfSupport = numOfSupport;
    }

    @Id
    @GeneratedValue
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "parent_id")
    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

//    @Column(name = "question_id")
//    public Integer getQuestionId() {
//        return questionId;
//    }
//
//    public void setQuestionId(Integer questionId) {
//        this.questionId = questionId;
//    }

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

    @Column(name = "reply_id")
    public Integer getReplyId() {
        return replyId;
    }

    public void setReplyId(Integer replyId) {
        this.replyId = replyId;
    }

    @Column(name = "reply_name")
    public String getReplyName() {
        return replyName;
    }

    public void setReplyName(String replyName) {
        this.replyName = replyName;
    }

    public String getThread() {
        return thread;
    }

    public void setThread(String thread) {
        this.thread = thread;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    @Column(name = "num_of_answer")
    public Integer getNumOfAnswer() {
        return numOfAnswer;
    }

    public void setNumOfAnswer(Integer numOfAnswer) {
        this.numOfAnswer = numOfAnswer;
    }

    @Transient
    public boolean isSupport() {
        return isSupport;
    }

    public void setSupport(boolean support) {
        isSupport = support;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", parentId=" + parentId +
                ", authorId=" + authorId +
                ", authorName='" + authorName + '\'' +
                ", replyId=" + replyId +
                ", replyName='" + replyName + '\'' +
                ", thread='" + thread + '\'' +
                ", summary='" + summary + '\'' +
                ", time=" + time +
                ", numOfSupport=" + numOfSupport +
                ", numOfAnswer=" + numOfAnswer +
                ", question=" + question +
                ", isSupport=" + isSupport +
                ", type=" + type +
                '}';
    }
}

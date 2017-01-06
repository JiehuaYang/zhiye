package com.scut.entity;

import javax.persistence.*;

/**
 * Created by pc on 2017/1/2.
 */
@Entity
@Table(name = "question_content")
public class QuestionContent {
    private Integer id;
    private Integer questionId;
    private String content;

    public QuestionContent(Integer questionId, String content) {
        this.questionId = questionId;
        this.content = content;
    }

    public QuestionContent() {
    }

    @Id
    @GeneratedValue
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Column(name = "question_id")
    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }
}

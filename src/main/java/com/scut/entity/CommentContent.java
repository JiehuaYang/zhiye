package com.scut.entity;

import javax.persistence.*;

/**
 * Created by pc on 2017/1/2.
 */
@Entity
@Table(name = "comment_content")
public class CommentContent {
    private Integer id;
    private Integer commentId;
    private String content;

    public CommentContent(Integer commentId, String content) {
        this.commentId = commentId;
        this.content = content;
    }
    public CommentContent(){

    }

    @Id
    @GeneratedValue
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "comment_id")
    public Integer getCommentId() {
        return commentId;
    }

    public void setCommentId(Integer commentId) {
        this.commentId = commentId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "CommentContent{" +
                "id=" + id +
                ", commentId=" + commentId +
                ", content='" + content + '\'' +
                '}';
    }
}

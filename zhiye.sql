drop database zhiye;
create database zhiye;
use zhiye;
#用户表
create table `user`(
	id int primary key auto_increment comment '用户id',
    email varchar(255) unique not null comment '用户邮箱',
    username varchar(20) not null comment '用户名',
    password varchar(255) not null comment '用户密码md5加密',
    sex int(1) not null default 1 comment '0表示女，1表示男',
    integral int not null default 0 comment '用户经验'
);
#问题表
create table `question`(
	id int primary key auto_increment,
    author_id int not null,
    author_name varchar(20) not null comment '提出者昵称',
    title varchar(255) not null comment '问题标题',
    summary varchar(255) not null comment '问题内容摘要',
    num_of_answer int not null default 0 comment '回答数',
    type int(1) not null default 0 comment '内容长度是否大于255，默认为不大于（0）',
    time datetime not null comment '提出时间',
    foreign key (author_id) references user(id) on delete cascade
    );

#提问内容
create table `question_content`(
	id int primary key auto_increment,
    question_id int not null,
    content text comment '提问内容',
    foreign key (question_id) references question(id) on delete cascade
    );

#回答表
create table `comment`(
	id int primary key auto_increment,
    parent_id int comment '回复的评论id(可为空)',
    question_id int not null comment '回答的问题id',
    author_id int not null comment '回答者id',
    author_name varchar(20) not null comment '回答者昵称(不变)',
    reply_id int comment '回复者id',
    reply_name varchar(20) comment '回复者昵称',
    thread varchar(255) not null default '/' comment '用于表示嵌套关系',
    summary varchar(255) not null comment '回答内容摘要',
    time datetime not null comment '回答时间',
    num_of_support int not null default 0 comment '点赞人数',
    num_of_answer int not null default 0 comment '评论人数',
    type int(1) not null default 0 comment '内容长度是否大于255，默认为不大于（0）',
    foreign key (parent_id) references comment(id) on delete cascade,
    foreign key (question_id) references question(id) on delete cascade,
    foreign key (author_id) references user(id) on delete cascade,
    foreign key (reply_id) references user(id) on delete cascade
	);
#回答内容表

create table `comment_content`(
	id int primary key auto_increment,
    comment_id int not null,
    content text comment '回答内容',
    foreign key (comment_id) references comment(id) on delete cascade
	);
    
#点赞表
create table `support`(
	id int primary key auto_increment,
    user_id int not null comment '点赞用户id',
    comment_id int not null comment '被点赞的评论id',
    foreign key (user_id) references user(id) on delete cascade,
    foreign key (comment_id) references comment(id) on delete cascade
	);
use zhiye;
delete from user;
insert into user(id,email,username,password)
value(1,'1803240383@qq.com','dragon','e10adc3949ba59abbe56e057f20f883e');
insert into user(id,email,username,password)
value(2,'111112@qq.com','小明','e10adc3949ba59abbe56e057f20f883e');
insert into user(id,email,username,password)
value(3,'222222@qq.com','小红','e10adc3949ba59abbe56e057f20f883e');
insert into user(id,email,username,password)
value(4,'222223@qq.com','小伟','e10adc3949ba59abbe56e057f20f883e');
delete from question;
insert into question(id,author_id,author_name,title,summary,time)
values(1,1,'dragon','手机电池的发展遇到了什么瓶颈？现在出现了比较靠谱的新技术吗？',
'手机电池感觉近几年都没有太大的发展，倒是各个厂商都开始另辟蹊径研究快充、无线充电，但终归解决不了耗电的问题。所以到底是什么制约着手机电池的发展？现在有出现一些比较靠谱的电池新技术、新材料吗？',
curtime());
insert into question(id,author_id,author_name,title,summary,time)
values(2,2,'小明','在家里做哪些运动可以减脂或增肌？',
'题主没有手机(因为是学生党所以手机被没收)因此无法看视频做健身操或下载nike的app，想知道在家可以做的运动有哪些？希望这些运动对设备的要求不是太严格，这些条件或许有些挑剔，但是拜托各位了。

补充:不知道大家有没有注意到，题主没有手机，所以无法看郑多燕之类的健身操视频。我是想知道一些如深蹲之类的不需要观看视频的运动。大家都回答得很热情，十分感谢(鞠躬)',
curtime());
insert into question(id,author_id,author_name,title,summary,time)
values(3,3,'小红','年龄越大读金庸会有什么不同感受吗？',
'少读神雕涕微碧，浩荡游侠气。壮读神雕觅花城，点滴离愁，唏嘘叹真情。

今读神雕港京昆，五色耀目昏。影视剧书纵有方，未若戏曲染却两鬓苍。


看了这么多版本的神雕侠侣，论叙事，我必然推崇查公原书，百般桀骜，千重苦情，跃然纸上。但是只有看了香港京昆剧团的京剧《神雕侠侣》，你才能明白，论舞台张力，还是传统戏剧，给人的印象深刻。岁数越大，越能明白，不论倜傥豪侠，还是儿女情长，终究抵不过人生如戏。',
curtime());

delete from comment;
insert into comment(id,question_id,author_id,author_name,summary,time)
values(1,1,2,'小明','其实很疑惑的就是手机为什么不能像笔记本一样有轻薄款和性能款。性能版6.0尺寸起步，一两厘米的厚度，这样的话手机的散热和电池都解决了。而且因为是性能款所以虽然不是主流但是也会有相当一部分人购买的……',curtime());
insert into comment(id,question_id,author_id,author_name,summary,time)
values(2,1,3,'小红','跟自己的专业相关，也答一个吧。
其实这题基本上是有标准答案的，深度懒惰者看这里：
电池技术为什么如此高深莫测，以至于一直是手机等相关行业的短板？ - 哥淡定的回答 - 知乎
究竟是什么限制了电池的容量？ - 陈远威的回答 - 知乎
但是因为最近量产了比较火热的新闻，我觉得有些问题该澄清的还是要澄清。
可能在各位读者看来，这只不过生活中再常见不过的东西了：',curtime());
insert into comment(id,question_id,author_id,author_name,summary,time)
values(3,2,3,'小红','跟自己的专业相关，也答一个吧。
其实这题基本上是有标准答案的，深度懒惰者看这里：
电池技术为什么如此高深莫测，以至于一直是手机等相关行业的短板？ - 哥淡定的回答 - 知乎
究竟是什么限制了电池的容量？ - 陈远威的回答 - 知乎
但是因为最近量产了比较火热的新闻，我觉得有些问题该澄清的还是要澄清。
可能在各位读者看来，这只不过生活中再常见不过的东西了：',curtime());
insert into comment(id,parent_id,question_id,author_id,author_name,reply_id,reply_name,thread,summary,time)
values(4,1,1,3,'小红',2,'小明','/1/','专业的东西关注就少…
答主是做哪一块的啊？',curtime());
update question set num_of_answer=3 where id=1;
update question set num_of_answer=1 where id=2;
update comment set num_of_answer=1 where id=1;
select * from question;
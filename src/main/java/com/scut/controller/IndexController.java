package com.scut.controller;

import com.scut.entity.*;
import com.scut.service.*;
import com.scut.util.*;
import org.springframework.stereotype.*;
import org.springframework.util.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.*;

import javax.annotation.*;
import javax.imageio.*;
import javax.servlet.http.*;
import java.awt.image.*;
import java.io.*;
import java.util.*;

/**
 * Created by pc on 2016/12/30.
 */
@Controller
public class IndexController {
    @Resource
    private UserService userService;
    @Resource
    private QuestionService questionService;

    @GetMapping(value = {"/","/login"})
    public String index(HttpSession session){
//        return "login";
        User user=new User();
        user.setUserName("dragon");
        user.setId(1);
        user.setSex(1);
        user.setEmail("1803240383@qq.com");
        user.setIntegral(0);
        session.setAttribute("user",user);
        return "redirect:/index";
    }

    @GetMapping(value = "/register")
    public String register(){
        return "register";
    }

    @GetMapping(value = "/index")
    public String showIndex(){
        return "home";
    }

    @GetMapping(value = "/discovery")
    public String showDescovery(){
        return "discovery";
    }

    @GetMapping(value = "/searchQuestion")
    public String searchQuestion(){
        return "searchResultQue";
    }

    @GetMapping(value = "/searchUser")
    public String searchUser(){
        return "searchResultUser";
    }

    @PostMapping(value = "/searchQResult")
    @ResponseBody
    public Map<String,Object> getSearchQResult(@RequestParam("key")String key){
        Map<String,Object> map=new HashMap<>();
        if(key==null || "".equals(key.trim())){
            map.put("count",0);
            return map;
        }
        List<Question> questionList=questionService.searchQuestion(key);
        if(questionList.size()==0){
            map.put("count",0);
        }else{
            map.put("count",questionList.size());
            map.put("content",questionList);
        }
        return map;
    }

    @PostMapping(value = "/searchUResult")
    @ResponseBody
    public Map<String,Object> getSearchUResult(@RequestParam("key")String key){
        Map<String,Object> map=new HashMap<>();
        if(key==null || "".equals(key.trim())){
            map.put("count",0);
            return map;
        }
        List<User> userList=userService.searchUser(key);
        if(userList.size()==0){
            map.put("count",0);
        }else{
            map.put("count",userList.size());
            map.put("content",userList);
        }
        return map;
    }

    @RequestMapping(value = "/images/imagecode")
    public String imagecode(HttpServletRequest request, HttpServletResponse response) throws Exception {
        OutputStream os = response.getOutputStream();
        Map<String,Object> map = ImageCode.getImageCode(60, 20, os);
        String simpleCaptcha = "simpleCaptcha";
        request.getSession().setAttribute(simpleCaptcha, map.get("strEnsure").toString().toLowerCase());
        request.getSession().setAttribute("codeTime",new Date().getTime());
        try {
            ImageIO.write((BufferedImage) map.get("image"), "JPEG", os);
        } catch (IOException e) {
            return "";
        }
        return null;
    }

    @RequestMapping(value = "/test")
    public String test(){
        return "test";
    }

//    @RequestMapping(value = "/checkcode")
//    @ResponseBody
//    public String checkcode(HttpServletRequest request, HttpSession session) throws Exception {
//        String checkCode = request.getParameter("checkCode");
//        Object cko = session.getAttribute("simpleCaptcha") ; //验证码对象
//        if(cko == null){
//            request.setAttribute("errorMsg", "验证码已失效，请重新输入！");
//            return "验证码已失效，请重新输入！";
//        }
//        String captcha = cko.toString();
//        Date now = new Date();
//        Long codeTime = Long.valueOf(session.getAttribute("codeTime")+"");
//        if(StringUtils.isEmpty(checkCode) || captcha == null ||  !(checkCode.equalsIgnoreCase(captcha))) {
//            request.setAttribute("errorMsg", "验证码错误！");
//            return "验证码错误！";
//        } else if ((now.getTime()-codeTime)/1000/60>5) {
//            //验证码有效时长为5分钟
//            request.setAttribute("errorMsg", "验证码已失效，请重新输入！");
//            return "验证码已失效，请重新输入！";
//        }else {
//            session.removeAttribute("simpleCaptcha");
//            return "1";
//        }
//    }
}

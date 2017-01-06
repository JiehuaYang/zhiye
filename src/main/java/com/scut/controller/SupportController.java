package com.scut.controller;

import com.scut.entity.*;
import com.scut.service.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

import javax.annotation.*;
import java.util.*;

/**
 * Created by pc on 2017/1/3.
 */
@Controller
@RequestMapping(value = "/supports")
public class SupportController {
    @Resource
    private SupportService supportService;
//对回答点赞
    @PostMapping(value = "/support")
    @ResponseBody
    public Map<String, String> save(@RequestBody Support support){
        Map<String, String> map = new HashMap<>();
        if(supportService.save(support)){
            map.put("result", "success");
        }else{
            map.put("result", "fail");
        }
        return map;
    }
//取消点赞
    @PostMapping("/support/remove")
    @ResponseBody
    public Map<String,String> removeSupport(@RequestParam("userId")Integer uid,
                                            @RequestParam("commentId")Integer commentId){
        Map<String, String> map = new HashMap<>();
        if(supportService.removeSupport(uid,commentId)){
            map.put("result", "success");
        }else{
            map.put("result", "fail");
        }
        return map;
    }

}

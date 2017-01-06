package com.scut.util;

import com.scut.entity.*;

/**
 * Created by pc on 2017/1/4.
 */
public class ContentUtil {
   public static String transform(String content){
       content = content.replaceAll("\\n", "<br/>");
       content = content.replaceAll("\\r\\n", "<br/>");
       return content;
   }
}

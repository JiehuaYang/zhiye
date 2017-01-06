package com.scut.service;

import com.scut.controller.*;
import com.scut.dao.*;
import org.junit.*;
import org.junit.runner.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.autoconfigure.web.servlet.*;
import org.springframework.boot.test.context.*;
import org.springframework.boot.test.mock.mockito.*;
import org.springframework.boot.test.web.client.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.http.*;
import org.springframework.test.context.junit4.*;
import org.springframework.test.web.servlet.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
/**
 * Created by pc on 2017/1/5.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(SupportController.class)
public class SupportServiceTests {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private SupportService supportService;
//    @Test
//    public void test() throws Exception {
//        RequestBuilder request=null;
//        request=get("/test");
//        mockMvc.perform(request)
//                .andExpect(status().isOk()).andExpect(content().string("hello"));
//    }
    @Test
    public void testSupportRemove() throws Exception {
        //测试SupportController
        RequestBuilder request=null;

//        request = get("/supports");
        //post提交删除一个Support
        request=post("/supports/support/remove")
                .param("userId","1")
                .param("commentId","1");
        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(content().string("{\"result\":\"success\"}"));
    }


}

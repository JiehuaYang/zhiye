package com.scut;

import org.junit.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.*;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ZhiyeApplicationTests {

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	public void test(){
		String s=restTemplate.getForObject("/test",String.class);
		assertThat(s).isEqualTo("hello");
	}
}

package com.myapp.client.slack;

import com.tommeijer.javalib.http.BearerAuthInterceptor;
import com.tommeijer.javalib.http.DefaultHttpClient;
import com.tommeijer.javalib.http.HttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.ArrayList;

@Configuration
public class SlackConfig {
    private static final String BASE_URL = "https://slack.com/api";

    private final String token;

    public SlackConfig(@Value("${app.config.logging.slack.token}") String token) {
        this.token = token;
    }

    @Bean
    public HttpClient slackHttpClient() {
        var restTemplate = new RestTemplate();
        restTemplate.setUriTemplateHandler(new org.springframework.web.util.DefaultUriBuilderFactory(BASE_URL));
        
        var interceptors = new ArrayList<ClientHttpRequestInterceptor>();
        interceptors.add(new BearerAuthInterceptor(() -> token));
        restTemplate.setInterceptors(interceptors);
        
        return new DefaultHttpClient(restTemplate);
    }
}

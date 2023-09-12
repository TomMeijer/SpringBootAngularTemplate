package com.myapp.client.slack;

import com.myapp.utils.auth.BearerAuthInterceptor;
import com.myapp.utils.http.DefaultHttpClient;
import com.myapp.utils.http.HttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SlackConfig {
    private static final String BASE_URL = "https://slack.com/api";

    private final String token;

    public SlackConfig(@Value("${app.config.logging.slack.token}") String token) {
        this.token = token;
    }

    @Bean
    public HttpClient slackHttpClient() {
        var restTemplate = new RestTemplateBuilder()
                .rootUri(BASE_URL)
                .interceptors(new BearerAuthInterceptor(() -> token))
                .build();
        return new DefaultHttpClient(restTemplate);
    }
}

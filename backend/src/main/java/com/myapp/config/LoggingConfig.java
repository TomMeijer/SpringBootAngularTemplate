package com.myapp.config;

import com.tommeijer.javalib.error.logging.ConsoleErrorLogger;
import com.tommeijer.javalib.error.logging.DelegatingErrorLogger;
import com.tommeijer.javalib.error.logging.ErrorLogger;
import com.tommeijer.javalib.error.logging.SlackErrorLogger;
import com.tommeijer.javalib.http.HttpClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;

@Configuration
public class LoggingConfig {
    private final boolean slackEnabled;
    private final String slackChannel;
    private final HttpClient httpClient;

    public LoggingConfig(@Value("${app.config.logging.slack.enabled}") boolean slackEnabled,
                         @Value("${app.config.logging.slack.channel}") String slackChannel,
                         @Qualifier("slackHttpClient") HttpClient httpClient) {
        this.slackEnabled = slackEnabled;
        this.slackChannel = slackChannel;
        this.httpClient = httpClient;
    }

    @Bean
    public ErrorLogger errorLogger() {
        var errorLoggers = new ArrayList<ErrorLogger>();
        errorLoggers.add(new ConsoleErrorLogger());
        if (slackEnabled) {
            errorLoggers.add(new SlackErrorLogger(slackChannel, httpClient));
        }
        return new DelegatingErrorLogger(errorLoggers);
    }
}

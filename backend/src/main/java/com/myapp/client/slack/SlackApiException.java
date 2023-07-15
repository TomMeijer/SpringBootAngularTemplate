package com.myapp.client.slack;

public class SlackApiException extends RuntimeException {

    public SlackApiException(String message) {
        super(message);
    }
}

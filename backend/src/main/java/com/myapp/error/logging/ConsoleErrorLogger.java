package com.myapp.error.logging;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Slf4j
public class ConsoleErrorLogger implements ErrorLogger {

    @Override
    public void log(String message, Throwable t) {
        log.error(message, t);
    }
}

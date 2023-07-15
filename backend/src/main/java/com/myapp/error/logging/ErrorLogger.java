package com.myapp.error.logging;

public interface ErrorLogger {

    void log(String message, Throwable t);
}

package com.myapp.error;

import com.myapp.error.logging.ErrorLogger;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
public class ControllerExceptionHandler {
    private final ErrorLogger errorLogger;

    @ExceptionHandler(Exception.class)
    public void handleException(Exception e, HttpServletRequest request) throws Exception {
        errorLogger.log("Call to %s caused an exception".formatted(request.getRequestURI()), e);
        throw e;
    }
}

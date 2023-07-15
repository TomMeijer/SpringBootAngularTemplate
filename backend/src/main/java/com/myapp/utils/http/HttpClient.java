package com.myapp.utils.http;

public interface HttpClient {

    <T> T executeRequest(HttpRequest request, Class<T> responseType);
}

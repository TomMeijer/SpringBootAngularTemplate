package com.myapp.utils.auth;

public interface TokenProvider<T> {

    T getToken();
}

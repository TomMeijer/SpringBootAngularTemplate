package com.myapp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Date;
import java.util.Map;

@Component
public class JwtService implements TokenService {
	private final String secret;
	private final long expirationMillis;

	public JwtService(@Value("${app.config.jwt.secret}") String secret,
					  @Value("${app.config.jwt.expiration-millis}") long expirationMillis) {
		this.secret = secret;
		this.expirationMillis = expirationMillis;
	}

	@Override
	public String create(String subject, Map<String, Object> claims) {
		var now = new Date();
		return Jwts.builder()
				.setSubject(subject)
				.setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + expirationMillis))
				.addClaims(claims)
				.signWith(SignatureAlgorithm.HS256, secret.getBytes())
				.compact();
	}

	@Override
	public String create(String subject) {
		return create(subject, Collections.emptyMap());
	}

	@Override
	public Map<String, Object> validate(String token) {
		return Jwts.parser()
				.setSigningKey(secret.getBytes())
				.parseClaimsJws(token)
				.getBody();
	}
}

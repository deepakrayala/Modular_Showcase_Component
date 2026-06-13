package com.showcase.security;

import java.security.Principal;

public class JwtUserPrincipal implements Principal {

    private final Integer userId;
    private final String email;
    private final String role;

    public JwtUserPrincipal(Integer userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    @Override
    public String getName() {
        return email;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}

package com.showcase.dto;

public class AuthResponse {

    private String message;
    private String token;
    private UserInfo user;

    public AuthResponse() {}

    public AuthResponse(String message, String token, UserInfo user) {
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }

    public static class UserInfo {
        private Integer id;
        private String name;
        private String email;
        private Integer roleId;
        private String roleName;

        public UserInfo() {}

        public UserInfo(Integer id, String name, String email, Integer roleId, String roleName) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.roleId = roleId;
            this.roleName = roleName;
        }

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Integer getRoleId() { return roleId; }
        public void setRoleId(Integer roleId) { this.roleId = roleId; }

        public String getRoleName() { return roleName; }
        public void setRoleName(String roleName) { this.roleName = roleName; }
    }
}

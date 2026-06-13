package com.showcase.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserListResponse {

    private List<UserItem> users;

    public UserListResponse() {}

    public UserListResponse(List<UserItem> users) {
        this.users = users;
    }

    public List<UserItem> getUsers() { return users; }
    public void setUsers(List<UserItem> users) { this.users = users; }

    public static class UserItem {
        private Integer id;
        private String name;
        private String email;
        private Integer roleId;
        private String roleName;
        private LocalDateTime createdAt;

        public UserItem() {}

        public UserItem(Integer id, String name, String email, Integer roleId, String roleName, LocalDateTime createdAt) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.roleId = roleId;
            this.roleName = roleName;
            this.createdAt = createdAt;
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

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}

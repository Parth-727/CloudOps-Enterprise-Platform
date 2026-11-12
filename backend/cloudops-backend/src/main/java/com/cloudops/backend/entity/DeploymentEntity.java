package com.cloudops.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "cloud_deployments")
public class DeploymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String application;

    @NotBlank
    @Column(nullable = false)
    private String status;

    @NotBlank
    @Column(nullable = false)
    private String environment;

    public DeploymentEntity() {
    }

    public DeploymentEntity(String application, String status, String environment) {
        this.application = application;
        this.status = status;
        this.environment = environment;
    }

    public Long getId() {
        return id;
    }

    public String getApplication() {
        return application;
    }

    public String getStatus() {
        return status;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }
}

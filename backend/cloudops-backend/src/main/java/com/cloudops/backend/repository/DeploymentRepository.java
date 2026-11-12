package com.cloudops.backend.repository;

import com.cloudops.backend.entity.DeploymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeploymentRepository extends JpaRepository<DeploymentEntity, Long> {
    long countByStatusIgnoreCase(String status);
}

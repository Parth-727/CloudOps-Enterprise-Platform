package com.cloudops.backend.repository;

import com.cloudops.backend.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    long countByStatusIgnoreCase(String status);
}

package com.crm.recommendation.repository;

import com.crm.recommendation.model.CustomerBehavior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerBehaviorRepository extends JpaRepository<CustomerBehavior, Long> {
    Optional<CustomerBehavior> findByCustomerId(Long customerId);
    void deleteByCustomerId(Long customerId);
}

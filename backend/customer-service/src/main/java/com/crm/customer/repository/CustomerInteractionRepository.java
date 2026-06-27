package com.crm.customer.repository;

import com.crm.customer.model.CustomerInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerInteractionRepository extends JpaRepository<CustomerInteraction, Long> {
    List<CustomerInteraction> findByCustomerIdOrderByInteractionDateDesc(Long customerId);
}

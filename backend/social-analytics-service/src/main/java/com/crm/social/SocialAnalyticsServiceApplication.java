package com.crm.social;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SocialAnalyticsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SocialAnalyticsServiceApplication.class, args);
    }
}

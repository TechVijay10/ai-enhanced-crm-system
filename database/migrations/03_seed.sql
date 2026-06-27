-- Part 3: Seed Data

INSERT INTO roles (name, description) VALUES ('ADMIN',    'System Administrator with full access');
INSERT INTO roles (name, description) VALUES ('MANAGER',  'Sales Manager with team access');
INSERT INTO roles (name, description) VALUES ('EMPLOYEE', 'Sales Employee with limited access');

-- Password for all users: "password" (BCrypt encoded)
INSERT INTO users (username, email, password, first_name, last_name, phone, role_id, is_active)
VALUES ('admin','admin@crm.com','$2a$10$.f0h0AzEGtvIEL4/9Nbw1.O9/dDuZ9eh.PBPsk0kM55HxzE8xPR4i','System','Admin','9999999999',1,1);

INSERT INTO users (username, email, password, first_name, last_name, phone, role_id, is_active)
VALUES ('manager1','manager@crm.com','$2a$10$.f0h0AzEGtvIEL4/9Nbw1.O9/dDuZ9eh.PBPsk0kM55HxzE8xPR4i','John','Manager','9888888888',2,1);

INSERT INTO users (username, email, password, first_name, last_name, phone, role_id, is_active)
VALUES ('emp1','emp1@crm.com','$2a$10$.f0h0AzEGtvIEL4/9Nbw1.O9/dDuZ9eh.PBPsk0kM55HxzE8xPR4i','Alice','Smith','9777777777',3,1);

INSERT INTO customers (first_name,last_name,email,phone,company,industry,status,category,city,country,assigned_to,created_by)
VALUES ('Robert','Johnson','robert.j@example.com','9111222333','TechCorp Ltd','Technology','ACTIVE','PREMIUM','Mumbai','India',1,1);

INSERT INTO customers (first_name,last_name,email,phone,company,industry,status,category,city,country,assigned_to,created_by)
VALUES ('Sarah','Williams','sarah.w@example.com','9222333444','Finance Pro','Finance','ACTIVE','STANDARD','Delhi','India',2,1);

INSERT INTO customers (first_name,last_name,email,phone,company,industry,status,category,city,country,assigned_to,created_by)
VALUES ('Michael','Brown','michael.b@example.com','9333444555','Retail Hub','Retail','INACTIVE','STANDARD','Bangalore','India',3,1);

INSERT INTO leads (first_name,last_name,email,phone,company,source,status,priority,visits,purchases,responses,social_engagement,score,assigned_to,created_by)
VALUES ('David','Lee','david.l@example.com','9444555666','StartupX','LinkedIn','NEW','HIGH',8,3,12,5,85,2,1);

INSERT INTO leads (first_name,last_name,email,phone,company,source,status,priority,visits,purchases,responses,social_engagement,score,assigned_to,created_by)
VALUES ('Emily','Chen','emily.c@example.com','9555666777','DataSoft','Website','CONTACTED','MEDIUM',4,1,6,2,45,3,1);

INSERT INTO leads (first_name,last_name,email,phone,company,source,status,priority,visits,purchases,responses,social_engagement,score,assigned_to,created_by)
VALUES ('James','Wilson','james.w@example.com','9666777888','OldRetail','Facebook','NEGOTIATION','LOW',1,0,2,1,20,2,1);

INSERT INTO tasks (title,description,status,priority,due_date,customer_id,created_by)
VALUES ('Follow up with Robert','Call to discuss renewal','PENDING','HIGH',SYSTIMESTAMP+INTERVAL '3' DAY,1,1);

INSERT INTO tasks (title,description,status,priority,due_date,lead_id,created_by)
VALUES ('Send proposal to David','Prepare product proposal','IN_PROGRESS','HIGH',SYSTIMESTAMP+INTERVAL '1' DAY,1,2);

INSERT INTO tasks (title,description,status,priority,due_date,customer_id,created_by)
VALUES ('Monthly review Sarah','Monthly performance meeting','PENDING','MEDIUM',SYSTIMESTAMP+INTERVAL '7' DAY,2,1);

INSERT INTO task_assignments (task_id,assigned_to,assigned_by) VALUES (1,3,1);
INSERT INTO task_assignments (task_id,assigned_to,assigned_by) VALUES (2,3,2);
INSERT INTO task_assignments (task_id,assigned_to,assigned_by) VALUES (3,2,1);

INSERT INTO revenue_reports (month,year,revenue,expenses,profit) VALUES (12,2024,250000,120000,130000);
INSERT INTO revenue_reports (month,year,revenue,expenses,profit) VALUES (1,2025,280000,130000,150000);
INSERT INTO revenue_reports (month,year,revenue,expenses,profit) VALUES (2,2025,310000,140000,170000);
INSERT INTO revenue_reports (month,year,revenue,expenses,profit) VALUES (3,2025,290000,135000,155000);
INSERT INTO revenue_reports (month,year,revenue,expenses,profit) VALUES (4,2025,340000,150000,190000);
INSERT INTO revenue_reports (month,year,revenue,expenses,profit) VALUES (5,2025,380000,160000,220000);

INSERT INTO social_sources (platform,campaign_name,clicks,conversions,revenue)
VALUES ('LinkedIn','B2B Lead Gen Q1',1200,45,125000);
INSERT INTO social_sources (platform,campaign_name,clicks,conversions,revenue)
VALUES ('Facebook','Brand Awareness 2025',3500,28,65000);
INSERT INTO social_sources (platform,campaign_name,clicks,conversions,revenue)
VALUES ('Instagram','Product Launch Spring',2800,35,78000);
INSERT INTO social_sources (platform,campaign_name,clicks,conversions,revenue)
VALUES ('Website','SEO Organic',5000,62,175000);
INSERT INTO social_sources (platform,campaign_name,clicks,conversions,revenue)
VALUES ('Referral','Partner Program',800,40,98000);

INSERT INTO analytics_reports (report_type,report_month,report_year,total_revenue,total_leads,converted_leads,new_customers)
VALUES ('MONTHLY',5,2025,380000,25,8,12);

INSERT INTO notifications (user_id,title,message,type,is_read)
VALUES (1,'New Lead Assigned','David Lee assigned as high-priority lead.','LEAD',0);
INSERT INTO notifications (user_id,title,message,type,is_read)
VALUES (2,'Task Due Tomorrow','Send proposal to David Lee due tomorrow.','TASK',0);

INSERT INTO customer_behavior (customer_id,response_rate,purchase_frequency,interaction_gap_days,total_purchases,last_contact_date)
VALUES (1,85.5,8,5,12,SYSTIMESTAMP-INTERVAL '5' DAY);
INSERT INTO customer_behavior (customer_id,response_rate,purchase_frequency,interaction_gap_days,total_purchases,last_contact_date)
VALUES (2,62.0,4,15,6,SYSTIMESTAMP-INTERVAL '15' DAY);
INSERT INTO customer_behavior (customer_id,response_rate,purchase_frequency,interaction_gap_days,total_purchases,last_contact_date)
VALUES (3,20.0,1,75,2,SYSTIMESTAMP-INTERVAL '75' DAY);

COMMIT;

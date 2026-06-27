-- ============================================================
-- AI-Enhanced CRM System - Oracle XE 11g Compatible Schema
-- ============================================================

-- Drop existing tables
DECLARE
  TYPE v_tbl_type IS TABLE OF VARCHAR2(100);
  v_tables v_tbl_type := v_tbl_type(
    'USER_TOKENS', 'CUSTOMER_INTERACTIONS', 'CUSTOMER_BEHAVIOR',
    'RECOMMENDATIONS', 'REMINDER_LOGS', 'SOCIAL_SOURCES',
    'CAMPAIGN_REPORTS', 'REVENUE_REPORTS', 'TASK_ASSIGNMENTS',
    'LEAD_ASSIGNMENTS', 'LEAD_SCORES', 'TASKS', 'LEADS',
    'CUSTOMERS', 'CUSTOMER_CATEGORIES', 'USERS', 'ROLES',
    'ANALYTICS_REPORTS', 'SALES_REPORTS', 'CUSTOMER_REPORTS',
    'NOTIFICATIONS'
  );
BEGIN
  FOR i IN 1..v_tables.COUNT LOOP
    BEGIN
      EXECUTE IMMEDIATE 'DROP TABLE "' || v_tables(i) || '" CASCADE CONSTRAINTS';
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;
  END LOOP;
END;
/

-- Drop sequences
DECLARE
  TYPE v_seq_type IS TABLE OF VARCHAR2(100);
  v_seqs v_seq_type := v_seq_type(
    'SEQ_ROLES', 'SEQ_USERS', 'SEQ_USER_TOKENS', 'SEQ_CUSTOMERS',
    'SEQ_INTERACTIONS', 'SEQ_CATEGORIES', 'SEQ_LEADS', 'SEQ_LEAD_SCORES',
    'SEQ_LEAD_ASSIGN', 'SEQ_TASKS', 'SEQ_TASK_ASSIGN', 'SEQ_ANALYTICS',
    'SEQ_SALES_REP', 'SEQ_CUST_REP', 'SEQ_BEHAVIOR', 'SEQ_RECS',
    'SEQ_NOTIFS', 'SEQ_REMINDERS', 'SEQ_SOCIAL', 'SEQ_CAMPAIGNS',
    'SEQ_REVENUE'
  );
BEGIN
  FOR i IN 1..v_seqs.COUNT LOOP
    BEGIN
      EXECUTE IMMEDIATE 'DROP SEQUENCE ' || v_seqs(i);
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;
  END LOOP;
END;
/

-- ============================================================
-- SEQUENCES
-- ============================================================
CREATE SEQUENCE seq_roles      START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_users      START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_user_tokens START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_customers  START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_interactions START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_categories START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_leads      START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_lead_scores START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_lead_assign START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_tasks      START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_task_assign START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_analytics  START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_sales_rep  START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_cust_rep   START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_behavior   START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_recs       START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_notifs     START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_reminders  START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_social     START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_campaigns  START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_revenue    START WITH 1 INCREMENT BY 1;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE roles (
    id          NUMBER PRIMARY KEY,
    name        VARCHAR2(50) NOT NULL,
    description VARCHAR2(200),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_role_name UNIQUE(name)
);

CREATE TABLE users (
    id           NUMBER PRIMARY KEY,
    username     VARCHAR2(100) NOT NULL,
    email        VARCHAR2(150) NOT NULL,
    password     VARCHAR2(255) NOT NULL,
    first_name   VARCHAR2(100),
    last_name    VARCHAR2(100),
    phone        VARCHAR2(20),
    role_id      NUMBER REFERENCES roles(id),
    is_active    NUMBER(1) DEFAULT 1,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_username UNIQUE(username),
    CONSTRAINT uq_user_email UNIQUE(email)
);

CREATE TABLE user_tokens (
    id           NUMBER PRIMARY KEY,
    user_id      NUMBER REFERENCES users(id),
    token        VARCHAR2(1000) NOT NULL,
    is_revoked   NUMBER(1) DEFAULT 0,
    expires_at   TIMESTAMP,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id           NUMBER PRIMARY KEY,
    first_name   VARCHAR2(100) NOT NULL,
    last_name    VARCHAR2(100) NOT NULL,
    email        VARCHAR2(150) NOT NULL,
    phone        VARCHAR2(20),
    company      VARCHAR2(200),
    industry     VARCHAR2(100),
    status       VARCHAR2(50) DEFAULT 'ACTIVE',
    category     VARCHAR2(50) DEFAULT 'STANDARD',
    address      VARCHAR2(500),
    city         VARCHAR2(100),
    country      VARCHAR2(100),
    assigned_to  NUMBER REFERENCES users(id),
    created_by   NUMBER REFERENCES users(id),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_customer_email UNIQUE(email)
);

CREATE TABLE customer_interactions (
    id               NUMBER PRIMARY KEY,
    customer_id      NUMBER REFERENCES customers(id) ON DELETE CASCADE,
    interaction_type VARCHAR2(50),
    notes            CLOB,
    interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by       NUMBER REFERENCES users(id)
);

CREATE TABLE customer_categories (
    id          NUMBER PRIMARY KEY,
    name        VARCHAR2(100) NOT NULL,
    description VARCHAR2(300),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cat_name UNIQUE(name)
);

CREATE TABLE leads (
    id                NUMBER PRIMARY KEY,
    first_name        VARCHAR2(100) NOT NULL,
    last_name         VARCHAR2(100) NOT NULL,
    email             VARCHAR2(150),
    phone             VARCHAR2(20),
    company           VARCHAR2(200),
    source            VARCHAR2(100),
    status            VARCHAR2(50) DEFAULT 'NEW',
    priority          VARCHAR2(20) DEFAULT 'MEDIUM',
    visits            NUMBER DEFAULT 0,
    purchases         NUMBER DEFAULT 0,
    responses         NUMBER DEFAULT 0,
    social_engagement NUMBER DEFAULT 0,
    score             NUMBER DEFAULT 0,
    assigned_to       NUMBER REFERENCES users(id),
    created_by        NUMBER REFERENCES users(id),
    converted_at      TIMESTAMP,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_scores (
    id            NUMBER PRIMARY KEY,
    lead_id       NUMBER REFERENCES leads(id) ON DELETE CASCADE,
    score         NUMBER DEFAULT 0,
    category      VARCHAR2(20),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_assignments (
    id          NUMBER PRIMARY KEY,
    lead_id     NUMBER REFERENCES leads(id) ON DELETE CASCADE,
    assigned_to NUMBER REFERENCES users(id),
    assigned_by NUMBER REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id          NUMBER PRIMARY KEY,
    title       VARCHAR2(200) NOT NULL,
    description CLOB,
    status      VARCHAR2(50) DEFAULT 'PENDING',
    priority    VARCHAR2(20) DEFAULT 'MEDIUM',
    due_date    TIMESTAMP,
    customer_id NUMBER REFERENCES customers(id) ON DELETE CASCADE,
    lead_id     NUMBER REFERENCES leads(id) ON DELETE CASCADE,
    created_by  NUMBER REFERENCES users(id),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_assignments (
    id          NUMBER PRIMARY KEY,
    task_id     NUMBER REFERENCES tasks(id) ON DELETE CASCADE,
    assigned_to NUMBER REFERENCES users(id),
    assigned_by NUMBER REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_reports (
    id              NUMBER PRIMARY KEY,
    report_type     VARCHAR2(100),
    report_month    NUMBER,
    report_year     NUMBER,
    total_revenue   NUMBER(15,2) DEFAULT 0,
    total_leads     NUMBER DEFAULT 0,
    converted_leads NUMBER DEFAULT 0,
    new_customers   NUMBER DEFAULT 0,
    report_data     CLOB,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_reports (
    id           NUMBER PRIMARY KEY,
    user_id      NUMBER REFERENCES users(id),
    month        NUMBER,
    year         NUMBER,
    deals_closed NUMBER DEFAULT 0,
    revenue      NUMBER(15,2) DEFAULT 0,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_reports (
    id                NUMBER PRIMARY KEY,
    month             NUMBER,
    year              NUMBER,
    total_customers   NUMBER DEFAULT 0,
    active_customers  NUMBER DEFAULT 0,
    churned_customers NUMBER DEFAULT 0,
    retention_rate    NUMBER(5,2) DEFAULT 0,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_behavior (
    id                   NUMBER PRIMARY KEY,
    customer_id          NUMBER REFERENCES customers(id) ON DELETE CASCADE,
    response_rate        NUMBER(5,2) DEFAULT 0,
    purchase_frequency   NUMBER DEFAULT 0,
    interaction_gap_days NUMBER DEFAULT 0,
    total_purchases      NUMBER DEFAULT 0,
    last_contact_date    TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
    id             NUMBER PRIMARY KEY,
    customer_id    NUMBER REFERENCES customers(id) ON DELETE CASCADE,
    category       VARCHAR2(50),
    recommendation VARCHAR2(500),
    priority       VARCHAR2(20),
    is_actioned    NUMBER(1) DEFAULT 0,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id         NUMBER PRIMARY KEY,
    user_id    NUMBER REFERENCES users(id),
    title      VARCHAR2(200),
    message    CLOB,
    type       VARCHAR2(50),
    is_read    NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reminder_logs (
    id            NUMBER PRIMARY KEY,
    user_id       NUMBER REFERENCES users(id),
    task_id       NUMBER REFERENCES tasks(id) ON DELETE CASCADE,
    reminder_time TIMESTAMP,
    is_sent       NUMBER(1) DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_sources (
    id            NUMBER PRIMARY KEY,
    platform      VARCHAR2(100) NOT NULL,
    lead_id       NUMBER REFERENCES leads(id) ON DELETE CASCADE,
    campaign_name VARCHAR2(200),
    clicks        NUMBER DEFAULT 0,
    conversions   NUMBER DEFAULT 0,
    revenue       NUMBER(15,2) DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campaign_reports (
    id            NUMBER PRIMARY KEY,
    campaign_name VARCHAR2(200) NOT NULL,
    platform      VARCHAR2(100),
    start_date    TIMESTAMP,
    end_date      TIMESTAMP,
    impressions   NUMBER DEFAULT 0,
    clicks        NUMBER DEFAULT 0,
    conversions   NUMBER DEFAULT 0,
    cost          NUMBER(15,2) DEFAULT 0,
    revenue       NUMBER(15,2) DEFAULT 0,
    roi           NUMBER(10,2) DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE revenue_reports (
    id         NUMBER PRIMARY KEY,
    month      NUMBER,
    year       NUMBER,
    revenue    NUMBER(15,2) DEFAULT 0,
    expenses   NUMBER(15,2) DEFAULT 0,
    profit     NUMBER(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TRIGGERS (Auto-increment via sequences)
-- ============================================================
CREATE OR REPLACE TRIGGER trg_roles BEFORE INSERT ON roles FOR EACH ROW
BEGIN SELECT seq_roles.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_users BEFORE INSERT ON users FOR EACH ROW
BEGIN SELECT seq_users.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_user_tokens BEFORE INSERT ON user_tokens FOR EACH ROW
BEGIN SELECT seq_user_tokens.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_customers BEFORE INSERT ON customers FOR EACH ROW
BEGIN SELECT seq_customers.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_interactions BEFORE INSERT ON customer_interactions FOR EACH ROW
BEGIN SELECT seq_interactions.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_leads BEFORE INSERT ON leads FOR EACH ROW
BEGIN SELECT seq_leads.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_lead_scores BEFORE INSERT ON lead_scores FOR EACH ROW
BEGIN SELECT seq_lead_scores.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_lead_assign BEFORE INSERT ON lead_assignments FOR EACH ROW
BEGIN SELECT seq_lead_assign.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_tasks BEFORE INSERT ON tasks FOR EACH ROW
BEGIN SELECT seq_tasks.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_task_assign BEFORE INSERT ON task_assignments FOR EACH ROW
BEGIN SELECT seq_task_assign.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_analytics BEFORE INSERT ON analytics_reports FOR EACH ROW
BEGIN SELECT seq_analytics.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_behavior BEFORE INSERT ON customer_behavior FOR EACH ROW
BEGIN SELECT seq_behavior.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_recs BEFORE INSERT ON recommendations FOR EACH ROW
BEGIN SELECT seq_recs.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_notifs BEFORE INSERT ON notifications FOR EACH ROW
BEGIN SELECT seq_notifs.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_social BEFORE INSERT ON social_sources FOR EACH ROW
BEGIN SELECT seq_social.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_campaigns BEFORE INSERT ON campaign_reports FOR EACH ROW
BEGIN SELECT seq_campaigns.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_revenue BEFORE INSERT ON revenue_reports FOR EACH ROW
BEGIN SELECT seq_revenue.NEXTVAL INTO :NEW.id FROM DUAL; END;
/
CREATE OR REPLACE TRIGGER trg_reminders BEFORE INSERT ON reminder_logs FOR EACH ROW
BEGIN SELECT seq_reminders.NEXTVAL INTO :NEW.id FROM DUAL; END;
/

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_users_email     ON users(email);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_leads_status    ON leads(status);
CREATE INDEX idx_tasks_status    ON tasks(status);
CREATE INDEX idx_notifs_user     ON notifications(user_id);
CREATE INDEX idx_social_platform ON social_sources(platform);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO roles (name, description) VALUES ('ADMIN',    'System Administrator with full access');
INSERT INTO roles (name, description) VALUES ('MANAGER',  'Sales Manager with team access');
INSERT INTO roles (name, description) VALUES ('EMPLOYEE', 'Sales Employee with limited access');

-- Default password for all: "password" BCrypt encoded
INSERT INTO users (username, email, password, first_name, last_name, phone, role_id, is_active)
VALUES ('admin', 'admin@crm.com', '$2a$10$.f0h0AzEGtvIEL4/9Nbw1.O9/dDuZ9eh.PBPsk0kM55HxzE8xPR4i', 'System', 'Admin', '9999999999', 1, 1);

INSERT INTO users (username, email, password, first_name, last_name, phone, role_id, is_active)
VALUES ('manager1', 'manager@crm.com', '$2a$10$.f0h0AzEGtvIEL4/9Nbw1.O9/dDuZ9eh.PBPsk0kM55HxzE8xPR4i', 'John', 'Manager', '9888888888', 2, 1);

INSERT INTO users (username, email, password, first_name, last_name, phone, role_id, is_active)
VALUES ('emp1', 'emp1@crm.com', '$2a$10$.f0h0AzEGtvIEL4/9Nbw1.O9/dDuZ9eh.PBPsk0kM55HxzE8xPR4i', 'Alice', 'Smith', '9777777777', 3, 1);

-- Customers
INSERT INTO customers (first_name, last_name, email, phone, company, industry, status, category, city, country, assigned_to, created_by)
VALUES ('Robert','Johnson','robert.j@example.com','9111222333','TechCorp Ltd','Technology','ACTIVE','PREMIUM','Mumbai','India',1,1);

INSERT INTO customers (first_name, last_name, email, phone, company, industry, status, category, city, country, assigned_to, created_by)
VALUES ('Sarah','Williams','sarah.w@example.com','9222333444','Finance Pro','Finance','ACTIVE','STANDARD','Delhi','India',2,1);

INSERT INTO customers (first_name, last_name, email, phone, company, industry, status, category, city, country, assigned_to, created_by)
VALUES ('Michael','Brown','michael.b@example.com','9333444555','Retail Hub','Retail','INACTIVE','STANDARD','Bangalore','India',3,1);

-- Leads
INSERT INTO leads (first_name, last_name, email, phone, company, source, status, priority, visits, purchases, responses, social_engagement, score, assigned_to, created_by)
VALUES ('David','Lee','david.l@example.com','9444555666','StartupX','LinkedIn','NEW','HIGH',8,3,12,5,85,2,1);

INSERT INTO leads (first_name, last_name, email, phone, company, source, status, priority, visits, purchases, responses, social_engagement, score, assigned_to, created_by)
VALUES ('Emily','Chen','emily.c@example.com','9555666777','DataSoft','Website','CONTACTED','MEDIUM',4,1,6,2,45,3,1);

INSERT INTO leads (first_name, last_name, email, phone, company, source, status, priority, visits, purchases, responses, social_engagement, score, assigned_to, created_by)
VALUES ('James','Wilson','james.w@example.com','9666777888','OldRetail','Facebook','NEGOTIATION','LOW',1,0,2,1,20,2,1);

-- Tasks
INSERT INTO tasks (title, description, status, priority, due_date, customer_id, created_by)
VALUES ('Follow up with Robert Johnson','Call to discuss renewal contract','PENDING','HIGH',SYSTIMESTAMP + INTERVAL '3' DAY,1,1);

INSERT INTO tasks (title, description, status, priority, due_date, lead_id, created_by)
VALUES ('Send proposal to David Lee','Prepare and send product proposal','IN_PROGRESS','HIGH',SYSTIMESTAMP + INTERVAL '1' DAY,1,2);

INSERT INTO tasks (title, description, status, priority, due_date, customer_id, created_by)
VALUES ('Monthly review with Sarah','Monthly performance review meeting','PENDING','MEDIUM',SYSTIMESTAMP + INTERVAL '7' DAY,2,1);

-- Task Assignments
INSERT INTO task_assignments (task_id, assigned_to, assigned_by) VALUES (1,3,1);
INSERT INTO task_assignments (task_id, assigned_to, assigned_by) VALUES (2,3,2);
INSERT INTO task_assignments (task_id, assigned_to, assigned_by) VALUES (3,2,1);

-- Revenue Reports
INSERT INTO revenue_reports (month, year, revenue, expenses, profit) VALUES (12,2024,250000,120000,130000);
INSERT INTO revenue_reports (month, year, revenue, expenses, profit) VALUES (1,2025,280000,130000,150000);
INSERT INTO revenue_reports (month, year, revenue, expenses, profit) VALUES (2,2025,310000,140000,170000);
INSERT INTO revenue_reports (month, year, revenue, expenses, profit) VALUES (3,2025,290000,135000,155000);
INSERT INTO revenue_reports (month, year, revenue, expenses, profit) VALUES (4,2025,340000,150000,190000);
INSERT INTO revenue_reports (month, year, revenue, expenses, profit) VALUES (5,2025,380000,160000,220000);

-- Social Sources
INSERT INTO social_sources (platform, campaign_name, clicks, conversions, revenue) VALUES ('LinkedIn','B2B Lead Gen Q1',1200,45,125000);
INSERT INTO social_sources (platform, campaign_name, clicks, conversions, revenue) VALUES ('Facebook','Brand Awareness 2025',3500,28,65000);
INSERT INTO social_sources (platform, campaign_name, clicks, conversions, revenue) VALUES ('Instagram','Product Launch Spring',2800,35,78000);
INSERT INTO social_sources (platform, campaign_name, clicks, conversions, revenue) VALUES ('Website','SEO Organic',5000,62,175000);
INSERT INTO social_sources (platform, campaign_name, clicks, conversions, revenue) VALUES ('Referral','Partner Program',800,40,98000);

-- Analytics Reports
INSERT INTO analytics_reports (report_type, report_month, report_year, total_revenue, total_leads, converted_leads, new_customers)
VALUES ('MONTHLY',5,2025,380000,25,8,12);

-- Notifications
INSERT INTO notifications (user_id, title, message, type, is_read)
VALUES (1,'New Lead Assigned','David Lee has been assigned as a high-priority lead.','LEAD',0);
INSERT INTO notifications (user_id, title, message, type, is_read)
VALUES (2,'Task Due Tomorrow','Task: Send proposal to David Lee is due tomorrow.','TASK',0);

-- Customer Behavior
INSERT INTO customer_behavior (customer_id, response_rate, purchase_frequency, interaction_gap_days, total_purchases, last_contact_date)
VALUES (1,85.5,8,5,12,SYSTIMESTAMP - INTERVAL '5' DAY);
INSERT INTO customer_behavior (customer_id, response_rate, purchase_frequency, interaction_gap_days, total_purchases, last_contact_date)
VALUES (2,62.0,4,15,6,SYSTIMESTAMP - INTERVAL '15' DAY);
INSERT INTO customer_behavior (customer_id, response_rate, purchase_frequency, interaction_gap_days, total_purchases, last_contact_date)
VALUES (3,20.0,1,75,2,SYSTIMESTAMP - INTERVAL '75' DAY);

COMMIT;

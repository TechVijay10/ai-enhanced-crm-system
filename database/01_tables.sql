-- Part 1: Sequences
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

-- Part 2: Independent Tables
CREATE TABLE roles (
    id          NUMBER PRIMARY KEY,
    name        VARCHAR2(50) NOT NULL UNIQUE,
    description VARCHAR2(200),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id         NUMBER PRIMARY KEY,
    username   VARCHAR2(100) NOT NULL UNIQUE,
    email      VARCHAR2(150) NOT NULL UNIQUE,
    password   VARCHAR2(255) NOT NULL,
    first_name VARCHAR2(100),
    last_name  VARCHAR2(100),
    phone      VARCHAR2(20),
    role_id    NUMBER,
    is_active  NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id          NUMBER PRIMARY KEY,
    first_name  VARCHAR2(100) NOT NULL,
    last_name   VARCHAR2(100) NOT NULL,
    email       VARCHAR2(150) NOT NULL UNIQUE,
    phone       VARCHAR2(20),
    company     VARCHAR2(200),
    industry    VARCHAR2(100),
    status      VARCHAR2(50) DEFAULT 'ACTIVE',
    category    VARCHAR2(50) DEFAULT 'STANDARD',
    address     VARCHAR2(500),
    city        VARCHAR2(100),
    country     VARCHAR2(100),
    assigned_to NUMBER,
    created_by  NUMBER,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_categories (
    id          NUMBER PRIMARY KEY,
    name        VARCHAR2(100) NOT NULL UNIQUE,
    description VARCHAR2(300),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    assigned_to       NUMBER,
    created_by        NUMBER,
    converted_at      TIMESTAMP,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id          NUMBER PRIMARY KEY,
    title       VARCHAR2(200) NOT NULL,
    description CLOB,
    status      VARCHAR2(50) DEFAULT 'PENDING',
    priority    VARCHAR2(20) DEFAULT 'MEDIUM',
    due_date    TIMESTAMP,
    customer_id NUMBER,
    lead_id     NUMBER,
    created_by  NUMBER,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_interactions (
    id               NUMBER PRIMARY KEY,
    customer_id      NUMBER,
    interaction_type VARCHAR2(50),
    notes            CLOB,
    interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by       NUMBER
);

CREATE TABLE lead_scores (
    id            NUMBER PRIMARY KEY,
    lead_id       NUMBER,
    score         NUMBER DEFAULT 0,
    category      VARCHAR2(20),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_assignments (
    id          NUMBER PRIMARY KEY,
    lead_id     NUMBER,
    assigned_to NUMBER,
    assigned_by NUMBER,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_assignments (
    id          NUMBER PRIMARY KEY,
    task_id     NUMBER,
    assigned_to NUMBER,
    assigned_by NUMBER,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_tokens (
    id         NUMBER PRIMARY KEY,
    user_id    NUMBER,
    token      VARCHAR2(1000) NOT NULL,
    is_revoked NUMBER(1) DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    user_id      NUMBER,
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
    customer_id          NUMBER,
    response_rate        NUMBER(5,2) DEFAULT 0,
    purchase_frequency   NUMBER DEFAULT 0,
    interaction_gap_days NUMBER DEFAULT 0,
    total_purchases      NUMBER DEFAULT 0,
    last_contact_date    TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
    id             NUMBER PRIMARY KEY,
    customer_id    NUMBER,
    category       VARCHAR2(50),
    recommendation VARCHAR2(500),
    priority       VARCHAR2(20),
    is_actioned    NUMBER(1) DEFAULT 0,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id         NUMBER PRIMARY KEY,
    user_id    NUMBER,
    title      VARCHAR2(200),
    message    CLOB,
    type       VARCHAR2(50),
    is_read    NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reminder_logs (
    id            NUMBER PRIMARY KEY,
    user_id       NUMBER,
    task_id       NUMBER,
    reminder_time TIMESTAMP,
    is_sent       NUMBER(1) DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_sources (
    id            NUMBER PRIMARY KEY,
    platform      VARCHAR2(100) NOT NULL,
    lead_id       NUMBER,
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

FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY social-analytics-service/pom.xml social-analytics-service/pom.xml
RUN mvn dependency:go-offline -pl social-analytics-service -am -q 2>&1 | tail -3 || true
COPY social-analytics-service/src social-analytics-service/src
RUN mvn clean package -pl social-analytics-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/social-analytics-service/target/social-analytics-service-1.0.0.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY analytics-service/pom.xml analytics-service/pom.xml
RUN mvn dependency:go-offline -pl analytics-service -am -q 2>&1 | tail -3 || true
COPY analytics-service/src analytics-service/src
RUN mvn clean package -pl analytics-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/analytics-service/target/analytics-service-1.0.0.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY task-service/pom.xml task-service/pom.xml
RUN mvn dependency:go-offline -pl task-service -am -q 2>&1 | tail -3 || true
COPY task-service/src task-service/src
RUN mvn clean package -pl task-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/task-service/target/task-service-1.0.0.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java", "-jar", "app.jar"]

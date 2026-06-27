FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY notification-service/pom.xml notification-service/pom.xml
RUN mvn dependency:go-offline -pl notification-service -am -q 2>&1 | tail -3 || true
COPY notification-service/src notification-service/src
RUN mvn clean package -pl notification-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/notification-service/target/notification-service-1.0.0.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]

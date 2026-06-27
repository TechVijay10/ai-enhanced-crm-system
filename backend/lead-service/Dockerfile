FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY lead-service/pom.xml lead-service/pom.xml
RUN mvn dependency:go-offline -pl lead-service -am -q 2>&1 | tail -3 || true
COPY lead-service/src lead-service/src
RUN mvn clean package -pl lead-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/lead-service/target/lead-service-1.0.0.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY recommendation-service/pom.xml recommendation-service/pom.xml
RUN mvn dependency:go-offline -pl recommendation-service -am -q 2>&1 | tail -3 || true
COPY recommendation-service/src recommendation-service/src
RUN mvn clean package -pl recommendation-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/recommendation-service/target/recommendation-service-1.0.0.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]

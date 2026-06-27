FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY customer-service/pom.xml customer-service/pom.xml
RUN mvn dependency:go-offline -pl customer-service -am -q 2>&1 | tail -3 || true
COPY customer-service/src customer-service/src
RUN mvn clean package -pl customer-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/customer-service/target/customer-service-1.0.0.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]

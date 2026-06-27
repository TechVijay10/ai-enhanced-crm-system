FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/pom.xml
RUN mvn dependency:go-offline -pl api-gateway -am -q 2>&1 | tail -3 || true
COPY api-gateway/src api-gateway/src
RUN mvn clean package -pl api-gateway -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/api-gateway/target/api-gateway-1.0.0.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]

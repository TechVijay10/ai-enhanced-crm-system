FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
COPY config-server/pom.xml config-server/pom.xml
RUN mvn dependency:go-offline -pl config-server -am -q 2>&1 | tail -3 || true
COPY config-server/src config-server/src
RUN mvn clean package -pl config-server -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/config-server/target/config-server-1.0.0.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]

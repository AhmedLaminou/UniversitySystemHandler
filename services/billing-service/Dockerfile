FROM eclipse-temurin:21-jdk-alpine

# Install Maven
RUN apk add --no-cache maven

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

EXPOSE 8085

CMD ["java", "-jar", "target/billing-service-0.0.1-SNAPSHOT.jar"]

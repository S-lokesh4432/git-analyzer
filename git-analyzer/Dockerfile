# Step 1: Build the Spring Boot application using Maven and Java 17
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Step 2: Run the built jar file inside a lightweight Java runtime container
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/git_analyzer-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
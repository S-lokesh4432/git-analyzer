# Step 1: Build using official stable Maven image
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Step 2: Use the official eclipse-temurin image for a flawless Java 17 runtime layer
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/git-analyzer-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
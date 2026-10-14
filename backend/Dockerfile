# Build Stage
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Cache dependencies
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN sed -i 's/\r$//' ./mvnw && chmod +x ./mvnw && ./mvnw dependency:go-offline -B || true

# Copy source code and build jar
COPY src src
RUN sed -i 's/\r$//' ./mvnw && ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy built artifact
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]

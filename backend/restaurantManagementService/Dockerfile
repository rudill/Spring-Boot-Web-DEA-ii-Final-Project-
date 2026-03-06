# ── Stage 1: Build ──
FROM eclipse-temurin:24-jdk-alpine AS build
WORKDIR /app

RUN apk add --no-cache dos2unix

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN dos2unix mvnw && chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw clean package -DskipTests -Djava.version=24

# ── Stage 2: Minimal runtime ──
FROM eclipse-temurin:24-jre-alpine
WORKDIR /app

RUN apk add --no-cache tzdata

# Copy fat JAR
COPY --from=build /app/target/restaurantManagementService-0.0.1-SNAPSHOT.jar app.jar

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8086

ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]

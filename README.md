# Expense Tracker

Personal finance tracker — Spring Boot REST API with a React frontend.

## Stack
- Java 17, Spring Boot 4.1.1
- Spring Data JPA, H2 (in-memory)
- Bean Validation

## Run
./mvnw spring-boot:run

Runs on http://localhost:8080
H2 console: http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:expensedb`, user `sa`)

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | /api/expenses | List all, optional `?category=FOOD` |
| GET | /api/expenses/summary | Running total and per-category breakdown |
| POST | /api/expenses | Create an expense |
| DELETE | /api/expenses/{id} | Delete by id |
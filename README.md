# Expense Tracker

Full-stack personal finance tracker. Log expenses by category, see a running total and a per-category breakdown.

## Stack

**API** — Java 21, Spring Boot, Spring Data JPA, H2, Bean Validation
**UI** — React, Vite, ESLint

## Running locally

Both need to be running. API first.

```
cd expense-tracker
./mvnw spring-boot:run          # http://localhost:8080
```

```
cd expense-tracker-ui
npm install
npm run dev 			# http://localhost:5173
```

H2 console at `http://localhost:8080/h2-console` — JDBC URL `jdbc:h2:mem:expensedb`, user `sa`, no password.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/expenses` | List all; optional `?category=FOOD` |
| GET | `/api/expenses/summary` | Running total, count, per-category breakdown |
| GET | `/api/expenses/categories` | Allowed category values |
| POST | `/api/expenses` | Create an expense |
| DELETE | `/api/expenses/{id}` | Delete by id |

## Design notes

- **`BigDecimal` throughout for money.** `double` accumulates binary rounding error; on a financial tracker that means a total that is quietly wrong.
- **Categories are an enum, persisted as `EnumType.STRING`.** Stops invalid values at the API boundary, and keeps stored data readable and stable if the enum is ever reordered.
- **Validation errors return a field-keyed map** from a `@RestControllerAdvice`, so the React form maps each message to its own input with no translation layer.
- **Filtering and aggregation run in SQL**, not in the browser. Derived queries for category filtering, JPQL with `coalesce` for totals so an empty database returns `0` rather than `null`.
- **DTOs are records, separate from the JPA entity**, so the HTTP contract doesn't move every time the schema does.

## Status

API complete and manually verified. UI in progress.
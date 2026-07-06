# Skopje Marathon — Registration & Payment Simulation

A full-stack web app for managing marathon participant registration, simulated
race-fee payment, and registration status lookup.

## Tech Stack

**Backend:** Java, Spring Boot, Spring Data JPA, PostgreSQL, Lombok, Bean
Validation (Jakarta Validation)

**Frontend:** React, TypeScript, Vite, Material UI (MUI), Axios, React Router

## Features

### Core (required by spec)

1. **Participant registration** — name, email, age, and race category
   (5&nbsp;km, 10&nbsp;km, half marathon, marathon). Enforces age ≥ 16 and a
   unique email, and returns a generated registration number.
2. **Simulated payment** — a coin-flip payment attempt. On success, the
   participant is marked paid and issued a start number. On failure, they can
   retry.
3. **Status check** — look up a participant by email or registration number.
   Paid participants get back their start number; unpaid participants get
   their registration number and a way to complete payment.

### Bonus

- **Run With Us** — a public page listing all successfully paid participants,
  with search-by-name and category filtering.

### Not implemented

- Organizer accounts, race creation/management, and ratings/comments (the
  second bonus feature) were left out due to time constraints. This would
  require introducing Spring Security, user roles, and a `Race` entity, which
  is a substantial addition beyond the core scope.

## Project Structure

```
sk-marathon/                  (Spring Boot backend)
├── controller/                ParticipantController — REST endpoints
├── service/                   ParticipantService (interface) + Impl
├── repository/                ParticipantRepository (Spring Data JPA)
├── entity/                    Participant, RaceCategory
├── dto/                       Request/response DTOs (see below)
└── exception/                 Custom exceptions + global exception handler

sk-marathon-web/               (React frontend)
└── src/
    ├── api/                   axios instance + shared error-parsing helper
    ├── components/             Header, reusable error alert
    ├── pages/                  HomePage, RegisterPage, PaymentPanel,
    │                           StatusCheckPage, RunWithUsPage
    ├── theme/                  MUI theme (Wizz Air-inspired brand colors)
    └── types/                  Shared TypeScript types mirroring backend DTOs
```

## Design Decisions Worth Knowing About

- **DTOs, not raw entities, wherever a client submits data that could affect
  server-controlled state.** Registration and update both go through
  `ParticipantRegistrationDto`, which deliberately excludes `paymentStatus`,
  `startNumber`, and `id` — a client cannot set these fields directly, no
  matter what they send in the request body. These are only ever set by the
  backend's own payment-simulation logic.
- **Registration and update share one DTO.** They currently need the same
  fields, so a second near-identical class was avoided (YAGNI). If update and
  registration requirements diverge later (e.g. email becomes non-editable
  after registration), splitting them out is a small, low-risk change.
- **Not every endpoint uses a DTO — deliberately.** `getParticipantById` (a
  general-purpose, non-public lookup) returns the raw `Participant` entity.
  There's no client-submitted data to protect there and no public-exposure
  concern, so a dedicated DTO wouldn't add meaningful value — it would just
  be extra code mirroring the entity's fields one-for-one. DTOs are used
  specifically where they solve a real problem: protecting server-controlled
  fields on write operations, or trimming what's exposed on public-facing
  reads.
- **The public participant list (`GET /participants`, via
  `ParticipantPublicDto`) is filtered to paid participants only, and omits
  email.** This endpoint is unauthenticated and powers the public "Run With
  Us" page — registered-but-unpaid participants haven't secured their spot
  and shouldn't appear on a public "who's running" showcase, and personal
  contact details have no reason to be exposed there either.
- **Payment (`POST /participants/{id}/pay`) returns `ParticipantResponseDto`
  regardless of outcome** — success or a simulated failure both return the
  same shape (with a different `message`), so the controller and frontend
  always know what to expect rather than branching on response shape.
- **Start numbers are sequential**, based on a count of already-paid
  participants at the time of payment, matching how bib numbers work in real
  races (and the reference screenshots provided with the spec) rather than
  using a random/UUID value.
- **HTTP 402 (Payment Required)** is used to represent a failed simulated
  payment attempt — a deliberate, if slightly unconventional, choice to
  communicate "the request succeeded, but the payment did not" more precisely
  than a generic 400 would.

## Running the Backend

1. Create a PostgreSQL database, e.g.:
   ```sql
   CREATE DATABASE marathon_db;
   ```
2. Configure `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/marathon_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```
3. Run via IntelliJ, or from the command line:
   ```
   ./mvnw spring-boot:run
   ```
4. The API runs on `http://localhost:8085` (or whatever port is configured).

## Running the Frontend

```bash
cd sk-marathon-web
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default. Update the `baseURL` in
`src/api/axiosInstance.ts` if the backend runs on a different port.

## API Reference

| Method | Endpoint                          | Description                                            | Response shape |
|--------|-------------------------------------|---------------------------------------------------------|-----------------|
| POST   | `/participants`                    | Register a new participant                              | `ParticipantResponseDto` |
| POST   | `/participants/{id}/pay`           | Simulate a payment attempt                              | `ParticipantResponseDto` |
| GET    | `/participants/status`             | Check status by `?email=` or `?registrationNumber=`      | `ParticipantStatusDto` |
| GET    | `/participants`                    | List all paid participants (public)                     | `ParticipantPublicDto[]` |
| GET    | `/participants/participant/{id}`   | Get a single participant by id                          | `Participant` (entity) |
| PUT    | `/participants/update/{id}`        | Update a participant's details                          | `ParticipantResponseDto` |
| DELETE | `/participants/delete/{id}`        | Delete a participant                                    | — |

## Testing

The backend was manually tested via Postman, covering:
- Successful registration, underage rejection, duplicate email rejection,
  missing/invalid field rejection, and attempted injection of protected
  fields (`paymentStatus`, `startNumber`) via the registration DTO
- Both payment outcomes (success/failure), and payment against a
  non-existent participant
- Status check by email and by registration number, for both paid and
  unpaid participants, plus the "neither provided" and "both provided"
  edge cases
- The public participant list correctly excludes unpaid participants and
  email addresses

No automated test suite is included due to time constraints.

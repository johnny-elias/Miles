# 📊 Miles – Award Data Schema

> **Purpose:** Define a single, version‑controlled contract for how flight‑award availability, pricing, and metadata are ingested, stored, and exposed across the Miles stack (crawlers ⇄ API ⇄ UI).  The schema must be **carrier‑agnostic**, **idempotent**, and **diff‑friendly** so that repeated crawls update only what changed.

---

## 1 ▪ Design Goals

|  Goal                                                           |  Why it matters                                                     |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
|  🔗 **Normalise** core entities (airports, airlines, programs)  | keeps duplicates out & enables fast join‑based queries              |
|  ⚡ **Delta‑friendly** ingestion                                 | crawlers can `UPSERT` seats & prices without race conditions        |
|  🧩 **Composable itineraries**                                  | multi‑segment journeys share the same segment rows                  |
|  📐 **Strict typing**                                           | prevents silent crawler bugs (e.g., wrong mileage currency)         |
|  📜 **Audit trail**                                             | store crawl timestamps & diff history for price‑drop notifications  |

---

## 2 ▪ Entity Overview

```text
Program ─┬─┐
         │  many‑to‑many (TransferPartner)
Currency ┘  │
            │
Airline 1───* FlightSegment *───1 Airport (orig)
   │                        └──1 Airport (dest)
   │
   └──1 Program (primary, optional)

Itinerary 1──* ItinerarySegment *──1 FlightSegment

AwardInventory 1──* AwardPrice
```

---

## 3 ▪ Relational Tables (PostgreSQL / Prisma)

### 3.1 `program`

|  Field                 |  Type                       |  Notes                                           |
| ---------------------- | --------------------------- | ------------------------------------------------ |
|  `id`                  |  UUID PK                    |                                                  |
|  `name`                |  text                       | e.g. *Aeroplan*                                  |
|  `code`                |  text UNIQUE                | 2‑4 char identifier; not always same as airline  |
|  `primary_airline_id`  |  FK→airline.id NULL         |                                                  |
|  `created_at`          |  timestamptz default now()  |                                                  |

### 3.2 `airline`

|  Field       |  Type                                      |  Notes  |
| ------------ | ------------------------------------------ | ------- |
|  `id`        |  UUID PK                                   |         |
|  `iata`      |  char(2) UNIQUE                            |         |
|  `icao`      |  char(3)                                   |         |
|  `name`      |  text                                      |         |
|  `alliance`  |  enum('Star','Oneworld','SkyTeam','None')  |         |

### 3.3 `airport`

|  Field        |  Type            |  Notes  |
| ------------- | ---------------- | ------- |
|  `id`         |  UUID PK         |         |
|  `iata`       |  char(3) UNIQUE  |         |
|  `name`       |  text            |         |
|  `city`       |  text            |         |
|  `country`    |  text            |         |
|  `lat`,`lon`  |  numeric(9,6)    |         |

### 3.4 `flight_segment`

|  Field                                                                 |  Type                |  Notes  |
| ---------------------------------------------------------------------- | -------------------- | ------- |
|  `id`                                                                  |  UUID PK             |         |
|  `marketing_airline_id`                                                |  FK→airline.id       |         |
|  `operating_airline_id`                                                |  FK→airline.id NULL  |         |
|  `flight_number`                                                       |  text                |         |
|  `departure_airport_id`                                                |  FK→airport.id       |         |
|  `arrival_airport_id`                                                  |  FK→airport.id       |         |
|  `departure_time_utc`                                                  |  timestamptz         |         |
|  `arrival_time_utc`                                                    |  timestamptz         |         |
|  `aircraft`                                                            |  text NULL           |         |
|  `duration_minutes`                                                    |  integer             |         |
|  UNIQUE (marketing\_airline\_id, flight\_number, departure\_time\_utc) |                      |         |

### 3.5 `itinerary`

|  Field          |  Type                       |                                      |
| --------------- | --------------------------- | ------------------------------------ |
|  `id`           |  UUID PK                    |                                      |
|  `created_at`   |  timestamptz default now()  |                                      |
|  `search_hash`  |  char(64)                   | SHA‑256 of search params (for dedup) |

### 3.6 `itinerary_segment`

|  Field                              |  Type                   |
| ----------------------------------- | ----------------------- |
|  `itinerary_id`                     |  FK→itinerary.id        |
|  `segment_id`                       |  FK→flight\_segment.id  |
|  `segment_index`                    |  smallint               |
|  PK (itinerary\_id, segment\_index) |                         |

### 3.7 `award_inventory`

|  Field                                            |  Type                   |  Notes  |
| ------------------------------------------------- | ----------------------- | ------- |
|  `id`                                             |  UUID PK                |         |
|  `itinerary_id`                                   |  FK→itinerary.id        |         |
|  `program_id`                                     |  FK→program.id          |         |
|  `cabin`                                          |  enum('F','J','W','Y')  |         |
|  `booking_class`                                  |  char(1) NULL           |         |
|  `date`                                           |  date                   |         |
|  `seats_available`                                |  smallint               |         |
|  `fetched_at`                                     |  timestamptz            |         |
|  UNIQUE (itinerary\_id, program\_id, cabin, date) |                         |         |

### 3.8 `award_price`

|  Field                 |  Type                                                                                  |  Notes  |
| ---------------------- | -------------------------------------------------------------------------------------- | ------- |
|  `inventory_id`        |  FK→award\_inventory.id PK                                                             |         |
|  `miles_cost`          |  integer                                                                               |         |
|  `cash_surcharge_usd`  |  numeric(10,2)                                                                         |         |
|  `saver`               |  boolean                                                                               |         |
|  `cents_per_point`     |  numeric(5,2) GENERATED ALWAYS AS (`cash_surcharge_usd` / `miles_cost` \* 100) STORED  |         |

### 3.9 `transfer_partner`

|  Field                                   |  Type           |
| ---------------------------------------- | --------------- |
|  `from_program_id`                       |  FK→program.id  |
|  `to_program_id`                         |  FK→program.id  |
|  `ratio_num`                             |  integer        |
|  `ratio_den`                             |  integer        |
|  PK (from\_program\_id, to\_program\_id) |                 |

---

## 4 ▪ Prisma Models (excerpt)

```prisma
model Program {
  id              String   @id @default(uuid())
  name            String
  code            String   @unique
  primaryAirline  Airline? @relation(fields: [primaryAirlineId], references: [id])
  primaryAirlineId String?
  inventories     AwardInventory[]
  transferFrom    TransferPartner[] @relation("from")
  transferTo      TransferPartner[] @relation("to")
  createdAt       DateTime @default(now())
}

model AwardInventory {
  id          String   @id @default(uuid())
  itinerary   Itinerary @relation(fields: [itineraryId], references: [id])
  itineraryId String
  program     Program   @relation(fields: [programId], references: [id])
  programId   String
  cabin       Cabin
  bookingClass String?
  date        DateTime  @db.Date
  seatsAvailable Int
  fetchedAt   DateTime
  price       AwardPrice?
  @@unique([itineraryId, programId, cabin, date])
}

enum Cabin {
  F
  J
  W
  Y
}
```

*Full models live under [`apps/api/prisma/schema.prisma`](../apps/api/prisma/schema.prisma).*  The enum `Cabin` keeps API payloads small and prevents typo drift.

---

## 5 ▪ Crawler Output Contract (`v0.1`)

```jsonc
{
  "fetched_at": "2025-07-04T17:02:33Z",
  "search": {      // echo of the query that produced these results
    "origin": "JFK",
    "destination": "ICN",
    "date": "2025-11-12",
    "cabin": "J"
  },
  "program_code": "AE", // Aeroplan
  "itinerary": [          // one or more segments
    {
      "marketing_airline": "AC",
      "operating_airline": "AC",
      "flight_number": "87",
      "departure_airport": "JFK",
      "arrival_airport": "YYZ",
      "departure_time_local": "2025-11-12T10:25",
      "arrival_time_local": "2025-11-12T11:55",
      "aircraft": "788"
    },
    { /* … next segment … */ }
  ],
  "award": {
    "miles": 75000,
    "cash_usd": 64.30,
    "cabin": "J",
    "booking_class": "I",
    "saver": true,
    "seats": 2
  }
}
```

The **ingestor lambda** validates this JSON (Zod schema) and maps it into `flight_segment` (upsert), `itinerary` (build hash from segments), then `award_inventory` & `award_price`.

---

## 6 ▪ Indexes & Performance Notes

| Table             | Index                                                                     | Purpose                       |
| ----------------- | ------------------------------------------------------------------------- | ----------------------------- |
| `flight_segment`  | btree on `(departure_airport_id, arrival_airport_id, departure_time_utc)` | query by city‑pair & date     |
| `award_inventory` | partial index `WHERE seats_available > 0`                                 | search only on seats in stock |
| `award_price`     | btree on `(miles_cost, cents_per_point)`                                  | cheapest‑miles ranking        |

Additionally, TimescaleDB **hypertables** could replace `award_inventory` once crawl cadence exceeds \~10 M rows/day.

---

## 7 ▪ Open Questions (🌱 to iterate)

1. Should we record **fare rules** (change/cancel fees) in `award_price`?  Could impact true ¢/pt.
2. How to model **married‑segment logic** when award space exists only if booked as a through‑fare?
3. Support for **Married Segment Exceptions (MSE)** pre‑calc vs. on‑the‑fly at search time?
4. Consider **materialised view** `v_current_award_space` that keeps only latest row per (itinerary, program, date, cabin) for blazing‑fast UI queries.

Feel free to propose improvements via PRs or open a Discussion thread!
*— Schema v0.3 (July 4 2025)*

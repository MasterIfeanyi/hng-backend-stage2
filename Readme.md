# Backend Wizards - Stage 2: Intelligence Query Engine

## Name: Ifeanyi Chima

## Language: JavaScript

## Email: chimaifeanyi29@gmail.com

## Stage 2 Task

### Task Description

Build a demographic intelligence API that provides advanced filtering, sorting, pagination, and natural language search capabilities for profile data.

### API Endpoints

- `/api/profiles` - Fetch profiles with filtering, sorting, and pagination.
- `[Your deployed URL will go here]` with your actual deployed URL (after next checkpoint)
- GitHub account: [IfeanyiChima](https://github.com/masterifeanyi)
- Repo URL: [HNG stage 2 backend](https://github.com/MasterIfeanyi/hng-backend-stage2)


## Project Overview

A demographic intelligence API that provides advanced filtering, sorting, pagination, and natural language search capabilities for profile data. Built for Insighta Labs to help marketing teams and growth analysts query demographic data efficiently.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Architecture:** MVC Pattern with pure functions

## API Endpoints

### GET `/api/profiles`

Fetch profiles with filtering, sorting, and pagination.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `gender` | string | Filter by gender (`male` or `female`) |
| `age_group` | string | Filter by age group (`child`, `teenager`, `adult`, `senior`) |
| `country_id` | string | Filter by 2-letter ISO country code (e.g., `NG`, `KE`) |
| `min_age` | integer | Minimum age filter |
| `max_age` | integer | Maximum age filter |
| `min_gender_probability` | float | Minimum gender confidence score |
| `min_country_probability` | float | Minimum country confidence score |
| `sort_by` | string | Sort field (`age`, `created_at`, `gender_probability`) |
| `order` | string | Sort order (`asc` or `desc`) |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 10, max: 50) |

**Example:**

GET `/api/profiles?gender=male&country_id=NG&min_age=25&sort_by=age&order=desc&page=1&limit=10`


## Natural Language Parsing Approach

### Overview

The natural language parser is **rule-based only** - no AI, no LLMs, no external APIs. It uses pattern matching and keyword detection to convert plain English queries into database filters.

### Supported Keywords and Mappings

| Keyword/Pattern | Maps To | Example |
|-----------------|---------|---------|
| `young` | `min_age=16, max_age=24` | "young males" |
| `male` | `gender=male` | "males from kenya" |
| `female` | `gender=female` | "females above 30" |
| `child` / `children` | `age_group=child` | "children from ghana" |
| `teenager` / `teen` / `teens` | `age_group=teenager` | "teenagers" |
| `adult` / `adults` | `age_group=adult` | "adult males" |
| `senior` / `elderly` / `old` | `age_group=senior` | "seniors"|
| `above X` / `over X` | `min_age=X`| "females above 30" |
| `below X` / `under X` | `max_age=X`| "males under 25" |
| `from [country]` | `country_id=[ISO]` | "from nigeria" |
| Country names | `country_id=[ISO]` | "people from kenya" |

### Supported Countries (ISO Codes)

Nigeria (NG), Ghana (GH), Kenya (KE), Tanzania (TZ), Uganda (UG), South Africa (ZA), Egypt (EG), Morocco (MA), Angola (AO), Ethiopia (ET), Cameroon (CM), Zimbabwe (ZW), Zambia (ZM), Senegal (SN), Rwanda (RW), Benin (BJ), Togo (TG), Mali (ML), Niger (NE), Chad (TD), Algeria (DZ), Tunisia (TN), Libya (LY), Sudan (SD), Somalia (SO), Congo (CG), Ivory Coast (CI), Mozambique (MZ), Madagascar (MG)

### How the Parsing Logic Works

1. Convert query to lowercase
2. Check for special keyword `young` → sets age range 16-24
3. Check for gender keywords (`male`/`female`)
4. Check for age group keywords (child, teenager, adult, senior)
5. Extract numeric patterns (`above 30`, `under 25`)
6. Scan for country names using a predefined mapping
7. Check for `from [country]` pattern
8. Return parsed filters or error if nothing matched

## Limitations and Edge Cases

### What the Parser Does NOT Handle

- **Complex queries with multiple conditions:** "males from nigeria and females from ghana" (only first country detected)
- **Negations:** "people not from nigeria"
- **Typos or misspellings:** "nigeria" will not match "nigeria"
- **Partial country names:** "south" will not match "south africa" (must use full name)
- **Age ranges with hyphens:** "ages 20-30" (use "above 20 and below 30" instead)
- **Synonyms for age groups:** "youth" is not recognized (use "young" or "teenager")
- **Combined gender queries:** "male and female" defaults to female (gender detection is mutually exclusive)
- **Probabilistic queries:** "high confidence males" - no support for probability filters in natural language

### Edge Cases

- Empty queries return `400 Bad Request` with message "Missing or empty parameter"
- Queries with no recognizable keywords return `400 Bad Request` with "Unable to interpret query"
- If both `young` keyword and explicit age filters appear, both are applied (combined with AND logic)
- Country detection is case-insensitive and stops at first match

## Project Structure

```javascript
backend-wizard/
├── index.js # Main server entry
├── db.js # Database connection
├── .env # Environment variables
├── controllers/
│ └── profileController.js # Request handlers
├── models/
│ └── profileModel.js # Database operations
├── routes/
│ └── profileRoutes.js # API route definitions
├── utils/
│ ├── validators.js # Input validation
│ └── queryParser.js # Natural language parsing
└── scripts/
├── create-table.js # Database table setup
└── seed.js # Data seeding script
```


## Local Development

### Prerequisites

- Node.js v18+
- PostgreSQL database (or Supabase account)

### Installation

```bash
git clone https://github.com/MasterIfeanyi/hng-backend-stage2
cd backend-wizard
npm install
```

## Environment Setup

Create `.env` file

```javascript
DATABASE_URL=your_postgres_connection_string
PORT=3000
```

## Database Setup

```bash
node scripts/create-table.js
node scripts/seed.js
```

## Running the Server

```bash
node index.js
```

## Evaluation Criteria Coverage

- Filtering Logic (20 pts) - Full support for all required filters

- Combined Filters (15 pts) - All filters combinable with AND logic

- Pagination (15 pts) - Page/limit with max 50 items

- Sorting (10 pts) - Sort by age, created_at, gender_probability

- Natural Language Parsing (20 pts) - Rule-based keyword detection

- README Explanation (10 pts) - This document

- Query Validation (5 pts) - Proper error responses

- Performance (5 pts) - Indexed database columns


## Response Format

### Success Response

```json
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 2026,
  "data": [...]
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description"
}
```
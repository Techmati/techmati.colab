# Techmati Colab API — Frontend Sync

> Complete endpoint reference and DTO contracts for frontend integration.
> Base path: `/techmati-api`

## Roles

| Role        | Scope |
|-------------|-------|
| `root`      | First immutable super-admin; assigns admin roles; manages all |
| `admin`     | Broad schema management; phrase sets, phrases, users, translations |
| `moderator` | Read operational data; ban/unban `user` role only |
| `analyst`   | Read analytics and translation data |
| `collector` | Additive to `user` — translates + manages multiple contributors |
| `user`      | Translates, reads own profile, reads published phrase sets |

## Domain Model

| Table                   | Description |
|-------------------------|-------------|
| `profiles`              | Application profile, 1:1 with `auth.users` |
| `contributor`           | The actual translator (distinct from Profile) |
| `contributor_variant`   | Join: contributor + nahuatl variant proficiency |
| `nahuatl_variant`       | INALI dialect reference (ISO 639-3 code + Spanish label) |
| `phrase_set`            | Batch of phrases to translate |
| `phrase`                | One ordered source phrase inside a phrase set |
| `translation`           | One attempt: contributor + phrase_set + dialect |
| `translation_entry`     | One translated phrase within one translation attempt |

Key invariants:
- Each profile gets one auto-created contributor (`accountUserId = profileId`).
- `collector` role can create additional contributors (`accountUserId = null`).
- `translation_entry` uniqueness: one entry per phrase per attempt.
- `translation` allows multiple attempts per (contributor, phraseSet, dialect).
- RLS on `translation_entry` denies `authenticated` writes — service-role only.

---

## Authentication

All protected routes require `Authorization: Bearer <token>`.
The middleware loads the `Profile` from the DB and sets it as the
actor context.

---

## Pagination Convention

```
?page=1&size=10   (1-based)
```

Response:
```json
{ "data": [...], "total": 42 }
```

---

## 1. Profile (Own)

### GET /profile
Returns the authenticated user's own profile.

**Response 200:**
```json
{
  "id": "uuid",
  "fullName": "Jane Doe",
  "username": "janedoe",
  "email": "jane@test.com",
  "bannedUntil": null,
  "role": "user",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

## 2. Admin — Users

> Route-level: `requireRole("root", "admin")` + target-specific policy in service

### GET /admin/users
List users with search, role/status filter, pagination.

**Query:**
```
?search=keyword&role=all|root|admin|moderator|analyst|collector|user
&status=all|active|banned&page=1&size=10
```

**Response 200:**
```json
{
  "users": [ProfileDto],
  "total": 42
}
```

### GET /admin/users/:userId
Find one user by ID.

**Response 200:** `ProfileDto`

### PATCH /admin/users/:userId/role
Assign a new role.

**Body:**
```json
{ "role": "admin" }
```
`role`: `"admin" | "moderator" | "analyst" | "collector" | "user"`

**Response 200:** `{ "message": "Role updated" }`

**Errors:**
- 403 — Target is root, or role transition forbidden
- 404 — User not found

### POST /admin/users/:userId/ban
**Response 200:** `{ "message": "User banned" }`

**Errors:**
- 403 — Cannot ban self / root / equal-or-higher role

### POST /admin/users/:userId/unban
**Response 200:** `{ "message": "User unbanned" }`

### DELETE /admin/users/:userId
Deletes the user via Supabase Auth Admin API. Cascades DB rows.
Purges audio files before deletion.

**Response 200:** `{ "message": "User deleted" }`

---

## 3. Contributors

### GET /contributors
List the authenticated user's own contributors (auto + managed).

**Response 200:**
```json
{
  "data": [ContributorDto]
}
```

### GET /contributors/:contributorId
Find one contributor by ID (must be owned by actor).

**Response 200:** `ContributorDto`

**Errors:** 403 — Not owned by actor; 404 — Not found

### POST /contributors
Create a new contributor.

- Non-collector: creates self-linked contributor (`accountUserId = profileId`).
- Collector/admin/root: creates managed contributor (`accountUserId = null`).

**Body:**
```json
{
  "fullName": "Field Worker",
  "variantIds": ["uuid1", "uuid2"]
}
```

**Response 201:** `ContributorDto`

**Errors:**
- 409 — Duplicate name for owner
- 422 — Unknown variant ID

### PUT /contributors/:contributorId
Update contributor name and/or variant proficiencies.

**Body:**
```json
{
  "fullName": "Updated Name",
  "variantIds": ["uuid1"]
}
```

**Response 200:** `ContributorDto`

### DELETE /contributors/:contributorId
Delete a managed contributor (cannot delete own auto-contributor).

**Response 200:** `{ "message": "Contributor deleted" }`

---

## ContributorDto

```ts
interface ContributorDto {
  id: string;
  ownerUserId: string;
  accountUserId: string | null;
  fullName: string;
  createdAt: string;
  variants: NahuatlVariantDto[];
}

interface NahuatlVariantDto {
  id: string;
  code: string;  // ISO 639-3
  label: string; // Spanish display name
}
```

---

## 4. Nahuatl Variants

### GET /nahuatl-variants
List all registered INALI variants.

**Response 200:**
```json
{ "data": [NahuatlVariantDto] }
```

### POST /nahuatl-variants
> `requireRole("root", "admin")` at the service layer

**Body:**
```json
{ "code": "azc", "label": "Náhuatl de la Sierra" }
```

**Response 201:** `NahuatlVariantDto`

### PUT /nahuatl-variants/:id
**Body:**
```json
{ "code": "azc", "label": "Updated Label" }
```

**Response 200:** `{ "message": "Variant updated" }`

### DELETE /nahuatl-variants/:id
**Response 200:** `{ "message": "Variant deleted" }`

---

## 5. Phrase Sets (User)

### GET /phrase-sets
List published phrase sets, optionally filtered by translation progress.

**Query:**
```
?filter=all|incomplete|completed|untouched
&page=1&size=10
```

**Response 200:**
```json
{ "data": [PhraseSetDto], "total": 25 }
```

### GET /phrase-sets/next-pending
Returns the next phrase set the contributor should work on
(in-progress first, then untouched, then finished).

**Response 200:**
```json
{
  "phraseSet": PhraseSetDto | null,
  "state": "in-progress" | "finished"
}
```

### GET /phrase-sets/:id
Returns one published phrase set with phrases.

**Response 200:** `PhraseSetDto`

**Errors:** 403 — Not published (non-admin); 404 — Not found

---

## 6. Phrase Sets (Admin)

> Route-level: `requireRole("root", "admin")`

### GET /admin/phrase-sets
Search phrase sets with stats and sorting.

**Query:**
```
?search=keyword
&include_stats=true|false
&min_contributors=2
&sort_by=createdAt|title|phraseCount|contributorsCount
&sort_direction=asc|desc
&page=1&size=10
```

**Response 200:**
```json
{ "data": [PhraseSetDto], "total": 50 }
```

### GET /admin/phrase-sets/:id
**Response 200:** `PhraseSetDto`

### POST /admin/phrase-sets
Create a phrase set with phrases.

**Body:**
```json
{
  "title": "Greetings",
  "description": "Common greetings",
  "language": "nahuatl_to_spanish",
  "published": true,
  "phrases": [
    { "sourceText": "Hello", "position": 0 },
    { "sourceText": "Goodbye", "position": 1 }
  ]
}
```

**Response 201:** `PhraseSetDto`

### PUT /admin/phrase-sets/:id
Update phrase set and/or reconcile phrases.

**Body:**
```json
{
  "title": "Updated Title",
  "published": false,
  "phrases": [
    { "id": "existing-uuid", "sourceText": "Updated", "position": 0 },
    { "sourceText": "New Phrase", "position": 1 }
  ]
}
```

- Phrases with `id`: update the existing row.
- Phrases without `id`: insert a new row.
- Existing phrases not in the payload: deleted.

**Response 200:** `PhraseSetDto`

### DELETE /admin/phrase-sets/:id
**Response 200:** `{ "message": "Phrase set deleted" }`

### GET /admin/phrase-sets/:id/phrases
Paginated phrase listing for one phrase set.

**Query:** `?page=1&size=50`

**Response 200:**
```json
{ "data": [PhraseDto], "total": 100 }
```

---

## PhraseSetDto

```ts
interface PhraseSetDto {
  id: string;
  title: string;
  description?: string;
  language: "nahuatl_to_spanish" | "spanish_to_nahuatl";
  published: boolean;
  createdAt: string;
  phraseCount: number;
  publishedAt?: string;
  stats?: PhraseSetStatsDto | null;
}

interface PhraseSetStatsDto {
  phraseSetId: string;
  contributorsCount: number;
}

interface PhraseDto {
  id: string;
  phraseSetId: string;
  sourceText: string;
  position: number;
  createdAt: string;
}
```

---

## 7. Translations (Contributor-scoped)

Translation routes are nested under the contributor path:

### GET /contributors/:contributorId/translations
List translation attempts for one contributor.

**Query:**
```
?filter=all|in_progress|completed
&page=1&size=10
```

**Response 200:**
```json
{ "data": [TranslationDto], "total": 15 }
```

### GET /contributors/:contributorId/translations/stats
Aggregate stats (all-time, this-week, today).

**Response 200:**
```json
{
  "allTimeCount": 120,
  "thisWeekCount": 30,
  "todayCount": 5
}
```

### POST /contributors/:contributorId/translations
Start a new translation attempt.

**Body:**
```json
{
  "phraseSetId": "uuid",
  "dialectId": "uuid"
}
```

**Response 201:** `TranslationDto`

**Errors:**
- 403 — Phrase set not published (non-admin); contributor not owned
- 404 — Contributor or phrase set not found; 422 — Dialect not found

### GET /contributors/:contributorId/translations/:translationId
Get one translation attempt with entries.

**Response 200:** `TranslationDto` (includes `entries`)

### DELETE /contributors/:contributorId/translations/:translationId
Delete a translation attempt.

**Response 200:** `{ "message": "Translation deleted" }`

### GET /contributors/:contributorId/translations/:translationId/next-pending
Returns the next untranslated phrase for this attempt.

**Response 200:**
```json
{
  "phraseId": "uuid" | null,
  "state": "in-progress" | "finished"
}
```

### POST /contributors/:contributorId/translations/:translationId/entries
Submit one translated phrase.

**Content-Type:** `multipart/form-data`

**Form fields:**
- `data` — JSON string: `{ "phraseId": "uuid", "translation": "Hola" }`
- `audio` — Optional audio file (`File`)

**Response 201:** `TranslationEntryDto`

**Errors:**
- 409 — Attempt completed or phrase already translated
- 422 — Phrase not in the phrase set
- 403 — Not owned by actor

---

## TranslationDto

```ts
interface TranslationDto {
  id: string;
  contributorId: string;
  phraseSetId: string;
  dialect: { id: string; code: string; label: string } | null;
  attemptedAt: string;
  contributedEntriesCount: number;
  progressPercentage: number;
  inProgress: boolean;
  completed: boolean;
  lastUpdate: string | null;
  phraseCount: number;
  entries?: TranslationEntryDto[];
}

interface TranslationEntryDto {
  id: string;
  translationId: string;
  phraseId: string;
  translation: string;
  audioUrl: string | null;
  submittedAt: string;
  phrase?: PhraseDto;
}
```

---

## 8. Admin — Translations

> Route-level: `requireRole("root", "admin")`

### GET /admin/phrase-sets/:phraseSetId/translations
List all translation attempts for one phrase set.

**Query:**
```
?filter=all|in_progress|completed
&search=keyword
&page=1&size=10
```

**Response 200:**
```json
{ "data": [AdminTranslationListItemDto], "total": 30 }
```

### GET /admin/users/:userId/phrase-sets/:phraseSetId/translations
Get one user's latest translation attempt for a specific phrase set
with entries.

**Response 200:**
```json
{
  "translation": AdminTranslationListItemDto,
  "entries": [TranslationEntryDto]
}
```

---

## AdminTranslationListItemDto

```ts
interface AdminTranslationListItemDto extends TranslationDto {
  contributor: ContributorSummaryDto | null;
}

interface ContributorSummaryDto {
  id: string;
  ownerUserId: string;
  accountUserId: string | null;
  fullName: string;
  createdAt: string;
}
```

---

## 9. Admin — Stats

> Route-level: `requireRole("root", "admin", "analyst")`

### GET /admin/stats/overview

**Response 200:**
```json
{
  "todayContributions": 42,
  "todayNewUsers": 5
}
```

### GET /admin/stats/latest-contributions

**Query:** `?page=1&size=10`

**Response 200:**
```json
{ "data": [LatestContributionDto], "total": 50 }
```

### GET /admin/stats/latest-users

**Query:** `?page=1&size=10`

**Response 200:**
```json
{ "data": [LatestUserDto], "total": 20 }
```

### GET /admin/stats/users/:userId/translations

**Response 200:**
```json
{
  "entriesCount": 120,
  "completedAttempts": 8
}
```

---

## Stats DTOs

```ts
interface LatestContributionDto {
  translationId: string;
  contributorId: string;
  contributorName: string | null;
  ownerUserId: string | null;
  accountUserId: string | null;
  phraseSetId: string;
  phraseSetTitle: string | null;
  attemptedAt: string;
  contributedEntriesCount: number;
  progressPercentage: number;
  inProgress: boolean;
  completed: boolean;
  lastUpdate: string | null;
}

interface LatestUserDto {
  id: string;
  fullName: string;
  username: string;
  email: string | null;
  createdAt: string;
}

interface UserTranslationStatsDto {
  entriesCount: number;
  completedAttempts: number;
}
```

---

## 10. Root Bootstrap

> Exceptional one-shot endpoint, protected by bootstrap secret.

### POST /bootstrap

**Headers:** `x-bootstrap-secret: <secret>`

**Body:**
```json
{
  "email": "root@techmati.com",
  "password": "secure-password",
  "fullName": "Root Admin",
  "username": "root"
}
```

**Response 201:** `{ "message": "Root user created successfully" }`

**Errors:** 403 — Wrong secret; 409 — Root already exists; 500 — Bootstrap not configured

### GET /bootstrap/exists
**Response 200:** `{ "exists": true }`

---

## Error Response Shape

All errors return:
```json
{ "error": "Human-readable message" }
```

| Status | Domain Error                          |
|--------|---------------------------------------|
| 401    | (middleware) Missing/invalid token    |
| 403    | ForbiddenRoleError, RootImmutableError, SelfBanError, RoleTransitionForbidden, NotOwned |
| 404    | NotFound errors                       |
| 409    | DuplicateContributorError, TranslationAlreadyCompletedError, PhraseAlreadyTranslatedError |
| 422    | InvalidPhrasePayloadError, UnknownPhraseError, UnknownNahuatlVariantError, PhraseSetMismatch |
| 500    | Unhandled server error                |

---

## Frontend Derivation Rules

The backend sends raw domain data; the frontend derives display state:

- **Banned state:** derive from `bannedUntil` — `if (bannedUntil && new Date(bannedUntil) > new Date())`
- **Progress:** derive from `contributedEntriesCount` and `phraseCount`
- **Badge colors / labels:** purely frontend concern
- **Relative dates:** purely frontend concern
- **Audio duration:** derive from media metadata in the frontend

---

## Query Key Suggestions (Angular + TanStack Query)

```ts
export const contributorQueries = {
  all: () => ["contributors"] as const,
  own: () => [...contributorQueries.all(), "own"] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...contributorQueries.all(), "detail", id] as const,
      queryFn: () => contributorApi.findById(id),
    }),
};

export const phraseSetQueries = {
  all: () => ["phrase-sets"] as const,
  list: (params: PhraseSetListParams) =>
    queryOptions({
      queryKey: [...phraseSetQueries.all(), "list", params] as const,
      queryFn: () => phraseSetApi.list(params),
    }),
  adminList: (params: PhraseSetAdminSearchParams) =>
    queryOptions({
      queryKey: [...phraseSetQueries.all(), "admin", params] as const,
      queryFn: () => phraseSetApi.searchAdmin(params),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...phraseSetQueries.all(), "detail", id] as const,
      queryFn: () => phraseSetApi.findById(id),
    }),
};

export const translationQueries = {
  all: () => ["translations"] as const,
  byContributor: (contributorId: string, filter: TranslationFilter, page: number, size: number) =>
    queryOptions({
      queryKey: [...translationQueries.all(), "contributor", contributorId, filter, page, size] as const,
      queryFn: () => translationApi.listByContributor(contributorId, filter, page, size),
    }),
  detail: (contributorId: string, translationId: string) =>
    queryOptions({
      queryKey: [...translationQueries.all(), "detail", contributorId, translationId] as const,
      queryFn: () => translationApi.getDetail(contributorId, translationId),
    }),
  nextPending: (contributorId: string, translationId: string) =>
    queryOptions({
      queryKey: [...translationQueries.all(), "next-pending", contributorId, translationId] as const,
      queryFn: () => translationApi.getNextPending(contributorId, translationId),
    }),
};
```
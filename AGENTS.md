# Techmati Colab Project Guide

This file contains all conventions, practices, and architecture specific to this repository.
For generic Angular and TypeScript guidance, use the installed Angular MCP and align its results
with the workspace reported by `list_projects`. The project currently targets Angular 21.

## Technologies

- Angular 21 standalone application, currently running without `zone.js` or
  `provideZoneChangeDetection`.
- TypeScript 5.9 with strict compiler and template checks.
- Supabase Auth through `@supabase/supabase-js` for OAuth, email/password sessions, and JWT access
  tokens.
- `@tanstack/angular-query-experimental` v5 for server-state reads (`injectQuery`, `queryOptions`,
  `keepPreviousData`) and mutations (`injectMutation`, `mutationOptions`,
  `queryClient.invalidateQueries`).
- RxJS 7.8 used internally within TanStack Query `queryFn`/`mutationFn` callbacks.
- Angular Signal Forms for the active translation workflow.
- Tailwind CSS 4 through PostCSS, with design tokens and theme mappings in `src/styles.css`.
- Zard UI components checked into `src/app/shared`, configured through `components.json`.
- Iconify Tailwind icons using the `lucide--*`, `ri--*`, and `game-icons--*` class prefixes.
- WaveSurfer.js behind the project-owned audio player component.
- Browser `MediaRecorder` behind the project-owned `AudioRecorder` utility.
- `@ngx-env/builder` for build-time environment variables.
- Vitest with jsdom through the Angular unit-test builder.
- pnpm 10 is the package manager. Use pnpm and keep `pnpm-lock.yaml` authoritative.

`@angular/cdk` and `lucide-angular` are installed but are not currently imported by application
code. Do not introduce a second icon rendering pattern when the existing Iconify CSS classes are
sufficient.

A Composio MCP integration is available for Figma design access during development sessions.

## Angular MCP

Before creating or changing Angular code:

1. Use `list_projects` to confirm the workspace and framework version.
2. Use `get_best_practices` with this workspace's `angular.json`.
3. Use `find_examples` for modern or recently changed Angular APIs.
4. Use `search_documentation` for established Angular APIs and concepts.

Keep generic Angular rules out of this file; the MCP is the source of truth for them.

## Commands

- Install dependencies: `pnpm install`
- Start the development server: `pnpm start`
- Production build: `pnpm build`
- Development watch build: `pnpm watch`
- Unit tests: `pnpm test`

The local API base used outside production is
`http://localhost:54321/functions/v1/techmati-api`.

## First Principles

- Keep changes scoped to the page, domain service, or wrapper the user asked about.
- Prefer the structure already used by the nearest implemented feature over introducing a new
  abstraction.
- UI components do not construct API URLs and do not call `HttpClient` directly.
- Server state is authoritative. Avoid optimistic updates unless the user explicitly asks for them.
- Keep local state in signals, derive state with `computed`, and make templates consume
  signal-derived state directly.
- Use Zard primitives before recreating controls. Add Techmati-specific UI under `src/app/ui`, not
  `src/app/shared`.

## Directory Ownership

### `src/app/core`

Project-wide non-visual application code:

- `config`: centralized configuration such as the API URI registry.
- `guard`: functional route guards.
- `interceptor`: functional HTTP interceptors.
- `service/<domain>`: root-scoped domain services and HTTP operations.
- `types`: API request, response, and domain types.
- `utils`: framework-independent or browser-API wrappers such as `AudioRecorder` and `tryCatch`.
- `pipes`: reusable display transformations.

Do not put templates or reusable view components in `core`.

Put a service in `src/app/core/service/<domain>` when it represents a shared domain boundary used by
multiple pages, for example:

```text
core/service/authentication/authentication.service.ts
core/service/profile/profile.service.ts
core/service/admin-phrase-set/admin-phrase-set.service.ts
core/service/translation/translation.service.ts
```

Keep DTOs and types in `core/dto` or `core/types` only when they are shared across features. A type
used only by a page belongs in that page's `core` folder.

### `src/app/ui`

Application-owned UI:

- `ui/pages/<page>` contains routed page components.
- A page owns feature-specific components under
  `ui/pages/<page>/ui/{atoms,molecules,organisms}`.
- Components reused across pages live under the corresponding global
  `ui/{atoms,molecules,organisms}` directory.

#### Page-Owned Features

Use this shape for substantial pages:

```text
src/app/ui/pages/admin-users/
  admin-users.page.ts
  admin-users.page.html
  admin-users.page.css
  core/
    dto/
      admin-users-query.dto.ts
      admin-users-search-response.dto.ts
    service/
      admin-users.service.ts
  ui/
    molecules/
      admin-user-card/
        admin-user-card.ts
        admin-user-card.html
        admin-user-card.css
    organisms/
      admin-users-filter-panel/
        admin-users-filter-panel.ts
        admin-users-filter-panel.html
        admin-users-filter-panel.css
```

Use page-local `core` for services, DTOs, types, defaults, and derivations that are specific to that
page or aggregate. Examples:

```text
admin-users/core/service/admin-users.service.ts
admin-dashboard/core/service/stats/stats.service.ts
admin-phrase-set-editor/core/types/phrase-set-derivations.type.ts
admin-phrase-set-editor/core/defaults/empty-phrase-set.default.ts
```

This keeps page aggregates self-contained and prevents `src/app/core` from becoming a dumping
ground.

#### Page-Local UI Categories

Use atomic categories by responsibility, not by file count:

- `atoms`: tiny presentational pieces only when they are genuinely useful as independent pieces.
- `molecules`: reusable cards, field rows, item rows, and single-purpose controls within a page.
- `organisms`: panels, toolbars, top bars, bottom action bars, and sections that coordinate several
  molecules.

Examples:

```text
admin-user-detail/
  ui/molecules/admin-user-detail-field/
  ui/molecules/admin-user-contribution-card/
  ui/organisms/admin-user-profile-header/
  ui/organisms/admin-user-attributes-panel/
  ui/organisms/admin-user-contributions-panel/
  ui/organisms/admin-user-risk-panel/
```

Do not nest another `atoms/molecules/organisms` tree inside a component directory. Keep component
directories flat:

```text
admin-user-card/
  admin-user-card.ts
  admin-user-card.html
  admin-user-card.css
```

#### Global UI Promotion

Keep a component page-local until a second page genuinely needs it. Promote it to:

```text
src/app/ui/molecules/<component>/
src/app/ui/organisms/<component>/
```

Examples of global UI:

```text
ui/organisms/top-app-bar
ui/organisms/admin-bottom-nav
ui/molecules/field-error-advice
ui/molecules/waves-audio-player
```

When promoting, update imports at call sites and leave no stale duplicate component behind unless
the duplicate has different behavior.

Pages orchestrate layout, route inputs, mutation flows, and aggregate loading state. Panels and
other feature components may own their read resources when the data is specific to that component.

### `src/app/shared`

This is the checked-in Zard UI implementation and support layer, not a general-purpose application
shared directory. It contains:

- Zard primitives under `shared/components`.
- class composition helpers under `shared/utils`.
- Zard directives and event-manager providers under `shared/core`.

Use the existing Zard primitive before creating a duplicate application control. Add ordinary
Techmati components to `src/app/ui`, not `src/app/shared`. Preserve the Zard public barrel exports
and aliases defined in `components.json`.

### `public`

Static assets use root-relative URLs, for example `/res/brand.jpeg`. Keep static application assets
here and render static images through the established optimized-image path.

## Naming and Imports

- Application selectors use the `tm-` prefix. `app-root` is the bootstrap exception, and `z-*`
  belongs to the Zard layer.
- Use kebab-case for directories, templates, styles, and component files.
- Routed pages use `*.page.ts`, a `*Page` class, and a `tm-*-page` selector.
- Reusable components use a bare feature name without a `.component` suffix.
- Domain services follow the existing
  `core/service/<domain>/<domain>.service.ts` and `<Domain>Service` pattern.
- Prefer `*.type.ts` for new domain type files unless extending a nearby established file.
- Use the `@/` alias for imports across features or application layers.
- Use relative imports within the same feature subtree.
- Import Zard components through their barrel path, such as `@/shared/components/button`.
- Keep component template and style URLs relative to their TypeScript file.

### Service method naming convention

All service methods use **bare verb names** — no `*Query`, `*Mutation`, `searchX`, or `*Observable`
suffixes. Methods that return `queryOptions()` for reads and `mutationOptions()` for writes follow
this uniformly:

```ts
// Reads — queryOptions factories
TranslationService.listByContributor(cId, opts)
PhraseSetsService.getFiltered(opts)
AdminPhraseSetService.search(query)

// Writes — mutationOptions factories
ContributorService.create()
GuestService.create()
TranslationService.submitEntry()
```

## Routing And Page Inputs

Routes use `withComponentInputBinding()`, so path and query params should be modeled as component
inputs.

Path params:

```ts
export class AdminUserDetailPage {
  readonly userId = input.required<string>();
}
```

Query params with aliases:

```ts
protected readonly searchParam = input('', { alias: 'search' });
protected readonly roleParam = input('', { alias: 'role' });
protected readonly statusParam = input('', { alias: 'status' });
protected readonly pageParam = input('', { alias: 'page' });
```

Keep route parameter names aligned with page input names where possible. Use an alias when the
internal name is clearer than the URL name.

When adding routes, follow the neighboring route style. Current admin pages use lazy
`loadComponent`; older app routes still use eager `component` references. Do not convert unrelated
routes while adding a page.

```ts
{
  path: 'admin/users/:userId',
  loadComponent: () =>
    import('./ui/pages/admin-user-detail/admin-user-detail.page').then(
      (module) => module.AdminUserDetailPage,
    ),
  canActivate: [authenticationGuard],
}
```

## Query Param Search Pages

Search/list pages should make the URL the durable source of filter state. The page reads query
params through input aliases, normalizes them, then sends them to the service/query layer.

Use this split:

- Search text: debounce before writing to the route.
- Discrete filters: write immediately.
- Pagination: write immediately.
- Backend data: query from the route-backed params.
- Placeholder data: do not add local filtering once backend wiring exists.

Example pattern:

```ts
protected readonly searchParam = input('', { alias: 'search' });
protected readonly roleParam = input('', { alias: 'role' });
protected readonly pageParam = input('', { alias: 'page' });

protected readonly search = signal('');
protected readonly debouncedSearch = signal('');
protected readonly selectedRole = signal<AdminUserRoleFilter>('all');
protected readonly page = signal(1);

private readonly DEBOUNCE_DELAY = 750;

constructor() {
  effect(() => {
    this.search.set(this.searchParam() || '');
  });

  effect(() => {
    this.selectedRole.set(this.normalizeRoleFilter(this.roleParam()));
  });

  effect(() => {
    this.page.set(this.normalizePage(this.pageParam()));
  });

  effect(() => {
    const search = this.debouncedSearch();
    this.router.navigate([], {
      queryParams: { search },
      queryParamsHandling: 'merge',
    });
  });

  effect((onCleanup) => {
    const search = this.search().trim();
    const timeoutId = setTimeout(() => {
      this.debouncedSearch.set(search);
    }, this.DEBOUNCE_DELAY);
    onCleanup(() => clearTimeout(timeoutId));
  });
}

protected selectRole(role: AdminUserRoleFilter): void {
  this.selectedRole.set(role);
  this.router.navigate([], {
    queryParams: { role },
    queryParamsHandling: 'merge',
  });
}
```

Normalize URL values before using them:

```ts
private normalizePage(value: string): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
```

For enum-like filters, keep the allowed values as a `const` list and fall back to `all` for
unrecognized URL values.

## Server Data and Synchronization

### API boundary

- Define endpoint strings and endpoint builders in `src/app/core/config/api-uris.config.ts`.
- Select the production base URL from `import.meta.env['NG_APP_PROD_API_URL']`; keep environment
  access compatible with the `Env` index signature in `src/env.d.ts` and the
  `noPropertyAccessFromIndexSignature` compiler option.
- Keep `HttpClient` calls in domain services. UI components should not construct URLs or call
  `HttpClient` directly.
- The authentication interceptor adds a Supabase JWT `Bearer` token to requests whose URL starts
  with `API.BASE_URL`. For requests under `/guest/` paths, the interceptor skips the Bearer token
  and instead injects `X-Guest-Session-Token` from `sessionStorage` when present.
- Services return `queryOptions()` factories for reads and `mutationOptions()` factories for writes
  — both from TanStack Query. Raw `HttpClient` calls are private inside `queryFn`/`mutationFn`.
- Contributor identity is resolved through `ContributorContextService.getActiveContributorId()`, not
  through `AuthenticationService.getUserId()`.

### Authentication state

- `AuthenticationService` is the only application service that calls `supabaseClient.auth`.
- The Supabase client is created in `src/app/core/config/supabase-client.config.ts`. Replace the URL
  and anon-key placeholders there when configuring an environment.
- Supabase owns session persistence, refresh, OAuth callback detection, and token storage. Do not
  create application-managed auth keys in `localStorage`.
- Consume the service's read-only `session`, `user`, `initialized`, `isAuthenticated`, and
  `displayName` signals instead of caching duplicate auth state.
- Use `signInWithOAuth`, `signInWithPassword`, `signUpWithPassword`, `signOut`, `getUserId`, and
  `getAccessToken` through `AuthenticationService`; do not import the Supabase client into feature
  code.
- Protected routes use `authenticationGuard`. Contributor-facing routes additionally use
  `contributorContextGuard`.
- The welcome page supports Google OAuth, email/password login, and guest quick-signup (registro
  rápido). Guest sessions are tracked via `X-Guest-Session-Token` and recovery codes stored in
  `sessionStorage`. Keep OAuth service methods provider-generic.

### Guest contributor flow

- `GuestService` manages the guest session lifecycle — creation, recovery, and session token storage.
  It exposes a `contributor` signal and an `isGuest` computed.
- Guest translation and phrase-set endpoints (`/guest/translations`, `/guest/phrase-sets`, etc.)
  mirror the authenticated endpoints. Services detect guest mode via `GuestService.isGuest()` and
  fork internally — no page-level branching is needed.
- The guest session token and recovery code are persisted in `sessionStorage`. After a successful
  Supabase signup, `POST /contributors/claim-guest` transfers the guest work to the authenticated
  account and clears guest credentials.

### TanStack Query Pattern

Use TanStack Query as the sole server-state pattern for reads and mutations. No `rxResource`
or raw `Observable` subscriptions in components.

#### Service Owns `queryOptions`

Services expose query option factories, not raw promises. They own:

- endpoint selection from `API`
- `HttpClient`
- request params serialization
- response typing
- `queryKey`
- `placeholderData` or `staleTime` when needed

```ts
@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private readonly client = inject(HttpClient);
  private readonly searchApi = API.ADMIN.USERS.SEARCH;

  search(query: AdminUsersQuery) {
    return queryOptions({
      queryKey: ['users', query],
      queryFn: () =>
        lastValueFrom(
          this.client.get<AdminUsersSearchResponseDto>(this.searchApi, {
            params: {
              search: query.search,
              role: query.role,
              status: query.status,
              page: query.page.toString(),
              size: query.size.toString(),
            },
          }),
        ),
      placeholderData: keepPreviousData,
    });
  }
}
```

Use `keepPreviousData` for paginated/search lists where a refresh should not blank already rendered
content.

Use stable, aggregate-oriented query keys:

```ts
['users', query]
['stats', 'today']
['phrase-set', phraseSetId]
['phrase-set', phraseSetId, 'phrases', { page, size }]
```

#### Component Owns `injectQuery`

Components inject the service and call `injectQuery` with a function:

```ts
private readonly adminUsersService = inject(AdminUsersService);

protected readonly usersQuery = computed<AdminUsersQuery>(() => ({
  search: (this.searchParam() || '').trim(),
  role: this.normalizeRoleFilter(this.roleParam()),
  status: this.normalizeStatusFilter(this.statusParam()),
  page: this.normalizePage(this.pageParam()),
  size: this.PAGE_SIZE,
}));

protected readonly searchResults = injectQuery(() =>
  this.adminUsersService.search(this.usersQuery()),
);

protected readonly pages = computed(() =>
  Math.ceil((this.searchResults.data()?.total || 0) / this.PAGE_SIZE),
);
```

Use `isPending()` and `isFetching()` for loading UI:

```html
@let isLoading = searchResults.isPending() || searchResults.isFetching();

@if (isLoading) {
  <z-skeleton class="h-28 w-full rounded-xl" />
} @else {
  @for (user of searchResults.data()?.users; track user.id) {
    <tm-admin-user-card [user]="user" />
  }
}
```

Keep sibling panels independent: one panel loading must not replace the rest of the page.

#### Mutations

Use service-owned `mutationOptions` and page-owned `injectMutation` for aggregate mutations.

Service pattern:

```ts
update(id: string, payload: PhraseSetUpdatePayload, onSuccess?: () => void, onError?: () => void) {
  return mutationOptions({
    mutationKey: ['phrase-set', id, 'update'],
    mutationFn: () => lastValueFrom(this.client.put(API.ADMIN.PHRASE_SET.BY_ID(id), payload)),
    onSuccess: async () => {
      await this.queryClient.invalidateQueries({ queryKey: ['phrase-set', id] });
      onSuccess?.();
    },
    onError: () => onError?.(),
  });
}
```

Page pattern:

```ts
readonly phraseSetUpdateMutation = injectMutation(() =>
  this.adminPhraseSetService.update(
    this.phraseSetId(),
    this.buildUpdatePayload(),
    () => this.onUpdateSuccess(this.buildUpdatePayload()),
    () => this.onUpdateError(this.buildUpdatePayload()),
  ),
);
```

Keep toast messages and route/navigation consequences in the page, not the service. The service
should know how to mutate and invalidate; the page should decide what message the user sees.

After a successful mutation, invalidate affected queries through
`queryClient.invalidateQueries({ queryKey: [...] })`. Track mutation progress via
`mutation.isPending()` and user-facing errors in explicit signals.

Translation submission uses `FormData` with JSON in the `data` part and the recording in the
`audio` part. Preserve that API contract.

There is no polling, WebSocket, or realtime subscription layer. Server synchronization occurs
through query invalidation and navigation.

### HTTP Services And DTOs

Every endpoint belongs in `core/config/api-uris.config.ts`.

Use endpoint builders for routes with IDs:

```ts
PHRASE_SET: {
  SEARCH: `${BASE_URL}/admin/phrase-sets`,
  BY_ID: (phraseSetId: string) => `${BASE_URL}/admin/phrase-sets/${phraseSetId}`,
}
```

DTOs should represent transport shape. Component-facing computed values may unwrap envelopes:

```ts
readonly phraseSet = computed(() => this.phraseSetQuery.data()?.phraseSet ?? null);
```

Use page-local DTOs when the shape only exists for one page:

```text
ui/pages/admin-users/core/dto/admin-users-query.dto.ts
ui/pages/admin-users/core/dto/admin-users-search-response.dto.ts
```

Use shared DTOs for concepts reused across pages:

```text
core/dto/profile.dto.ts
```

## State and Component Boundaries

- Keep local interaction state in signals and derive state rather than duplicating it.
- Use inputs for data/configuration and outputs for user events or child loading state.
- Keep browser and library instances private; expose signal-derived state to templates.
- Use `DestroyRef` to release timers, media streams, object URLs, WaveSurfer instances, and other
  external resources.
- Route path and query parameters are bound to page inputs through
  `withComponentInputBinding()`. Keep route parameter names aligned with page input names.
- Admin routes use lazy `loadComponent`; non-admin pages currently use eager `component` references.
  Do not rewrite unrelated routes while adding a page.

## Component Boundaries

Pages should orchestrate:

- route inputs and query params
- aggregate queries and mutations
- high-level layout
- placeholder data when a design is not wired yet
- save/discard/navigation flows
- toast messages

Organisms should own:

- a panel or toolbar
- section-specific loading state if they own a read
- section-specific child layout

Molecules should own:

- cards
- list rows
- field rows
- focused reusable controls

Use inputs for data and outputs/models for changes:

```ts
readonly selectedRole = input.required<AdminUserRoleFilter>();
readonly roleChange = output<AdminUserRoleFilter>();
```

For two-way editable child state, use `model()`:

```ts
readonly role = model<TechmatiRole>('user');
```

Do not move server calls into card components unless the card itself owns a small, independent read
such as a preview count.

## Forms

Active forms use a signal model plus Angular Signal Forms validators.

Page components own submission and server error state; focused child components own rendering and
validation presentation.

```ts
protected readonly model = signal({
  translation: '',
  pronunciation: null,
});

protected readonly form = form(this.model, (schema) => {
  required(schema.translation, { message: 'Añade una traducción escrita.' });
  minLength(schema.translation, 3, {
    message: 'La traducción debe tener al menos 3 caracteres.',
  });
});
```

Use the global field error molecule for repeated field advice:

```html
<tm-field-error-advice [field]="form.translation" />
```

For editor pages, separate cached server data from editable drafts:

- `phraseSetCache`: readonly data from the query.
- `phraseSetDraft`: mutable signal/model used by the form.
- `cachedPhrases`: readonly phrase array from query caches.
- `phrasesDrafts`: mutable list used for reordering and editing.

Clone cache data before editing it. Do not mutate query cache objects directly.

For "new" versus existing aggregate flows, use explicit derivation types:

```ts
NewPhraseSetDraft
PhraseSetUpdatePayload
PhraseSetCreatePayload
PhraseDraft
PhraseDraftPayload
```

Rich custom fields such as `TranslationTextarea` and `PronunciationRecorder` implement
`ControlValueAccessor` so they can participate in the form field tree. A custom control must
propagate value, touched, and disabled state and release any resources it owns.

## Loading And Empty States

Loading skeletons use Zard skeletons and live next to the component they represent.

Examples:

```text
dashboard/ui/organisms/available-contributions-panel-skeleton/
profile/ui/organisms/profile-summary-panel-skeleton/
translate/ui/organisms/batch-progress-panel-skeleton/
trans-entry/ui/organisms/trans-entry-skeleton/
```

If a molecule has its own loading representation, put the skeleton under `ui/molecules`. If an
organism/panel is loading, put the skeleton under `ui/organisms`.

Keep sibling panels independent. A dashboard panel loading should not replace the whole dashboard.

Use `ZardEmptyComponent` for empty states when the page already imports it; otherwise match the
nearest existing empty-state style.

## Zard And Design System Usage

Import Zard primitives from their barrel paths:

```ts
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { ZardSelectImports } from '@/shared/components/select';
```

Use spread imports for select because the select component and item component are used together:

```ts
imports: [ZardButtonComponent, ...ZardSelectImports]
```

Prefer Zard components for:

- buttons
- badges
- inputs and input groups
- select
- switch
- pagination
- alert dialog
- skeleton
- empty states
- toast

Do not add ordinary app components to `src/app/shared`. That directory is the checked-in Zard layer.

## Library Wrappers

- Use `WavesAudioPlayer` instead of creating WaveSurfer instances in feature components.
- Use `AudioRecorder` instead of using `MediaRecorder` directly.
- Use `mergeClasses` for Zard variant class composition. It combines `clsx` and `tailwind-merge`.
- Zard variants are defined with `class-variance-authority`; keep variant logic beside the primitive.
- `provideZard()` installs the project event syntax, including prevention/propagation modifiers and
  debounced events. Reuse that syntax rather than adding one-off event wrappers.
- Use `TimeAgoPipe` for relative contribution timestamps.

## Styling and Assets

Prefer Tailwind utilities in templates for layout and common visual rules. Use component CSS
for `:host`, reusable semantic classes, pseudo-elements, animations, and third-party widget styling.

Use zardui semantic tokens for surfaces and text: `bg-card`, `bg-background`, `text-foreground`,
`text-muted-foreground`, `text-primary`, `border-border`.

```html
class="rounded-xl border border-border bg-card text-muted-foreground shadow-sm"
```

When implementing Figma designs, translate Figma colors to existing tokens first:

- `bg-card`
- `bg-background`
- `text-primary`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `text-destructive`

The project uses a unified `primary-50` through `primary-700` color scale (blue palette) for
branded surfaces. Add or map a design token in `src/styles.css` before introducing a new repeated
color.

Avoid arbitrary Tailwind values when a standard scale class or existing token expresses the
design. Generated Zard source is an exception and should not be mechanically rewritten.

Use Iconify utility classes for icons:

```html
<span class="lucide--search" aria-hidden="true"></span>
<span class="ri--admin-line" aria-hidden="true"></span>
```

Decorative icons need `aria-hidden="true"`. Icon-only interactive controls need an accessible name.

The UI language is Spanish and Angular locale data is registered as `es-MX`. Keep date formatting
and user-facing copy consistent with that locale.

## Admin Page Patterns

Admin overview pages usually use:

- `TopAppBar`
- `AdminBottomNav`
- page-local panels under `ui/organisms`
- page-local cards under `ui/molecules`
- TanStack Query for aggregate reads

Transactional admin task pages may use a page-local task top bar instead of the global top app bar
when the design calls for a focused editor/detail flow, for example:

```text
admin-phrase-set-editor/ui/organisms/admin-phrase-set-editor-top-bar/
admin-user-detail/ui/organisms/admin-user-detail-top-bar/
```

Do not add the admin bottom nav to focused editor/detail pages unless the design or user asks for it.

## Placeholder Data

Use placeholder data only to implement unwired designs. Keep it typed with the real domain type
where possible:

```ts
protected readonly user: Profile = {
  id: 'usr-carlos-mendoza',
  fullName: 'Carlos Mendoza', // Opcional: profiles.full_name es nullable (string | null)
  username: 'cmendoza_tl',
  email: 'carlos.mendoza@tlacuilo.org',
  bannedUntil: null,
  role: 'user',
  createdAt: '2023-10-12T10:00:00.000Z',
};
```

Contributor display names use `alias` (the contributor aggregate no longer has a
`fullName`/`full_name`; only `alias`). `Profile.full_name` keeps its column name but is
nullable, so render a fallback (e.g. `user().fullName ?? user().username ?? 'No proporcionado'`)
in admin surfaces that display it.

When backend wiring is added, remove local filtering and placeholder transformation code that will
become obsolete. Keep placeholder data only for pieces that are still explicitly unwired.

## Navigation

Use `RouterLink` for declarative navigation from cards and buttons:

```html
<button z-button [routerLink]="['/admin', 'users', user().id]">
  <span class="lucide--chevron-right" aria-hidden="true"></span>
</button>
```

Use `Location.back()` for task headers or discard actions that return to the previous screen:

```ts
private readonly location = inject(Location);

protected goBack(): void {
  this.location.back();
}
```

For query-param updates, use `Router.navigate([], { queryParams, queryParamsHandling: 'merge' })`
so independent controls do not wipe each other.

## Toasts And User Feedback

Use `ngx-sonner` with the project-owned `ZardToastComponent` for mutation results.

Pages should define the user-facing messages because they know the context:

```ts
toast.success(`Set de frases "${phraseSet.title}" creado con éxito`, {
  description,
  ...this.baseToastConfig,
});
```

Keep messages in Spanish. Make creation and update messages specific; do not show a generic
"success" when the operation has meaningful consequences such as published/unpublished state.

## External Resources And Cleanup

Use project wrappers for browser/library APIs:

- `AudioRecorder` for `MediaRecorder`
- `WavesAudioPlayer` for WaveSurfer

Components that create external resources must release them with `DestroyRef` or equivalent cleanup:

```ts
this.destroyRef.onDestroy(() => {
  const currentAudio = this.model().pronunciation;
  if (currentAudio) {
    URL.revokeObjectURL(currentAudio.url);
  }
});
```

Do not instantiate WaveSurfer, MediaRecorder, object URLs, timers, or subscriptions without a clear
cleanup path.

## Accessibility

- Changes must preserve WCAG AA behavior and pass AXE checks.
- Interactive icon-only controls need an accessible name.
- Preserve keyboard focus visibility, native control semantics, disabled states, and live/error
  announcements.
- Prefer semantic elements before adding ARIA.

## Testing and Validation

- Tests use Vitest globals through the Angular test builder.
- Place focused `*.spec.ts` files beside the code they cover.
- The current test suite is not a reliable completion gate. Do not rely on passing tests as the
  final verification signal.
- Run `pnpm build` after application changes. A successful production build is the required final
  validation until the suite is made reliable.
- Tests may still be added or run for focused development feedback, but they do not replace the
  production build check.

## Existing Artifacts That Are Not Conventions

Do not copy debug `console` effects, commented-out template blocks, stale duplicate components, or
TODO workarounds into new code. They reflect active development, not architectural policy. Verify
that a component is referenced before using an older page-local implementation as a pattern.

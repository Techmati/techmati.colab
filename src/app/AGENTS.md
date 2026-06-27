# Techmati App-Layer Practices

This file supplements the root `AGENTS.md` for work inside `src/app`. The root guide owns project
technologies, commands, and broad boundaries. This guide gives more detailed examples of the coding
and architectural style used by the application layer.

For generic Angular syntax or API questions, still use the Angular MCP first. This file documents
project-specific patterns and preferences.

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

## Directory Structure By Responsibility

### App-Wide Core

Use `src/app/core` for application-wide non-visual concerns:

```text
src/app/core/
  config/
    api-uris.config.ts
    supabase-client.config.ts
  dto/
    profile.dto.ts
  guard/
  interceptor/
  pipes/
  service/<domain>/<domain>.service.ts
  types/
  utils/
```

Put a service in `src/app/core/service/<domain>` when it represents a shared domain boundary used by
multiple pages, for example:

- `core/service/authentication/authentication.service.ts`
- `core/service/profile/profile.service.ts`
- `core/service/admin-phrase-set/admin-phrase-set.service.ts`
- `core/service/summary/summary.service.ts`

Keep DTOs and types in `core/dto` or `core/types` only when they are shared across features. A type
used only by a page belongs in that page's `core` folder.

### Page-Owned Features

Routed features live under `src/app/ui/pages/<page>`.

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

- `admin-users/core/service/admin-users.service.ts`
- `admin-dashboard/core/service/stats/stats.service.ts`
- `admin-phrase-set-editor/core/types/phrase-set-derivations.type.ts`
- `admin-phrase-set-editor/core/defaults/empty-phrase-set.default.ts`

This keeps page aggregates self-contained and prevents `src/app/core` from becoming a dumping
ground.

### Page-Local UI Categories

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

### Global UI Promotion

Keep a component page-local until a second page genuinely needs it. Promote it to:

```text
src/app/ui/molecules/<component>/
src/app/ui/organisms/<component>/
```

Examples of global UI:

- `ui/organisms/top-app-bar`
- `ui/organisms/admin-bottom-nav`
- `ui/molecules/field-error-advice`
- `ui/molecules/waves-audio-player`

When promoting, update imports at call sites and leave no stale duplicate component behind unless
the duplicate has different behavior.

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

## TanStack Query Pattern

Use TanStack Query for admin and aggregate-oriented backend reads where caching, pagination, and
mutation invalidation matter.

### Service Owns `queryOptions`

Services expose query option factories, not raw promises. They own:

- endpoint selection from `API`
- `HttpClient`
- request params serialization
- response typing
- `queryKey`
- `placeholderData` or `staleTime` when needed

Example:

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

### Component Owns `injectQuery`

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

### Mutations

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

## `rxResource` Pattern

Use `rxResource` for contributor-facing workflows and simpler resource reads that are naturally
observable-driven and do not need TanStack Query mutation/caching behavior.

Examples:

```ts
readonly phraseRes = rxResource({
  params: computed(() => ({ phraseSetId: this.phraseSetId(), tick: this.nextPhraseTick() })),
  stream: ({ params: { phraseSetId } }) =>
    this.translationEntryService.getNextPhraseInPhraseSet(phraseSetId),
});
```

```ts
readonly phraseSetsRes = rxResource({
  stream: () => this.phraseSetService.getFiltered(1, 3, 'untouched'),
});
```

Put route inputs, pagination, filters, or refresh counters in `params` when they affect the server
request. Use a tick signal to force refetches after successful mutations:

```ts
protected readonly nextPhraseTick = signal(0);

this.nextPhraseTick.update((tick) => tick + 1);
```

When a refetch should preserve the last rendered value, use `linkedSignal` with the previous value:

```ts
protected readonly sets = linkedSignal({
  source: () => this.completedSets.value(),
  computation: (source, previous) => source || previous?.value || { summaries: [], total: 0 },
});
```

## HTTP Services And DTOs

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

## Forms And Draft State

For active forms, use a signal model plus Angular Signal Forms.

Small child forms own field rendering and field-level validation. Pages own submission and server
errors.

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

## Styling Style

Use Tailwind utilities in templates for layout, spacing, typography, color, and common visual rules.
Use component CSS mainly for:

- `:host`
- third-party widget styling
- pseudo-elements
- animations
- semantic classes that would be noisy inline

Preferred token-backed classes:

```html
class="rounded-xl border border-border-subtle bg-card text-text-secondary shadow-sm"
```

Use Iconify utility classes for icons:

```html
<span class="lucide--search" aria-hidden="true"></span>
<span class="ri--admin-line" aria-hidden="true"></span>
```

Decorative icons need `aria-hidden="true"`. Icon-only interactive controls need an accessible name.

When implementing Figma designs, translate Figma colors to existing tokens first:

- `bg-card`
- `bg-background`
- `text-primary`
- `text-text-primary`
- `text-text-secondary`
- `border-border-subtle`
- `text-destructive`

Use arbitrary values only for one-off design fidelity when no token exists yet. If a new color or
spacing repeats, add or map a token in `src/styles.css`.

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

Do not add the admin bottom nav to focused editor/detail pages unless the design or user asks for
it.

## Placeholder Data

Use placeholder data only to implement unwired designs. Keep it typed with the real domain type
where possible:

```ts
protected readonly user: Profile = {
  id: 'usr-carlos-mendoza',
  fullName: 'Carlos Mendoza',
  username: 'cmendoza_tl',
  email: 'carlos.mendoza@tlacuilo.org',
  bannedUntil: null,
  role: 'user',
  createdAt: '2023-10-12T10:00:00.000Z',
};
```

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

## Validation

For application changes, run:

```bash
pnpm build
```

The unit test suite is not the completion gate right now. Add or run focused tests only when they
help the change, but use the production build as the final check.

If the build reports an unrelated error outside the requested files, do not fix unrelated
components. Report the error clearly so the user can decide.

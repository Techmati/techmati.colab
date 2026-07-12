# Project-Agnostic Agent Guide

Use this file as a copy-pasteable baseline for Angular applications that follow the coding,
architecture, and collaboration style practiced in this project. Replace project-specific names,
API paths, selectors, routes, and domain examples with the target application's language.

This guide intentionally focuses on conventions and decisions that are easy for a model-switching
coding agent to lose track of. When a project has its own framework MCP, official docs tooling, or
local guide, use those sources for framework syntax details and use this file for architectural
style.

## Current Defaults

Prefer the newest project patterns over older ones:

- Use TanStack Query for server state in new aggregate, admin, search, detail, and editor pages.
- Put `queryOptions` and `mutationOptions` factories in domain services.
- Use `injectQuery` and `injectMutation` in pages or owning organisms.
- Invalidate affected query keys after successful mutations.
- Use route query params as the durable source for search, filters, sort, and pagination.
- Use signal forms for active Angular forms.
- Use signals for local interaction state and computed values for derived state.
- Use design-system primitives before recreating buttons, badges, inputs, selects, skeletons,
  pagination, dialogs, toasts, and empty states.
- Keep feature components page-local until they are genuinely reused.

Older patterns may exist in a codebase. Do not extend them by default:

- Treat `rxResource` as a legacy or narrowly scoped Observable-backed read abstraction.
- Treat `linkedSignal` previous-value caching as a legacy refresh pattern.
- Do not build new aggregate pages around `rxResource` when TanStack Query is already installed.
- Do not add improvised local caches when TanStack Query can own server-state caching.
- Do not add custom session IDs or auth state in `localStorage` when JWT/OAuth auth is available.

## Technology Assumptions

This style works best with:

- Angular standalone components.
- Strict TypeScript and strict Angular template checking.
- Angular signals, signal inputs, signal outputs, signal models, and computed state.
- TanStack Query for Angular.
- Angular Signal Forms for form-heavy workflows.
- RxJS for service internals and interoperability with Angular `HttpClient`.
- A centralized auth service backed by OAuth/JWT authentication.
- Tailwind or another utility-first styling layer backed by semantic design tokens.
- A checked-in design-system or component library layer.
- A package manager lockfile treated as authoritative.

If a project uses different libraries, keep the same boundaries: services own transport and
server-state option factories; pages orchestrate; components render; design-system primitives stay
centralized.

## Directory Structure

Use this general layout:

```text
src/app/
  core/
    config/
    dto/
    guard/
    interceptor/
    pipes/
    service/
      <domain>/
        <domain>.service.ts
    types/
    utils/
  shared/
    components/
    core/
    utils/
  ui/
    atoms/
    molecules/
    organisms/
    pages/
      <page-name>/
        core/
          dto/
          service/
          types/
        ui/
          atoms/
          molecules/
          organisms/
        <page-name>.page.ts
        <page-name>.page.html
        <page-name>.page.css
```

### `core`

Use `core` for project-wide non-visual application code:

- API URI registry and environment-aware configuration.
- Auth client configuration.
- Route guards.
- HTTP interceptors.
- Global domain services.
- Shared DTOs and reusable domain types.
- Reusable pipes.
- Browser or library wrappers with no template.
- Small utilities such as `tryCatch`, object mappers, and typed helpers.

Do not place templates or visual components in `core`.

### `shared`

Use `shared` for the checked-in design-system implementation and its support utilities.

Examples:

- Design-system primitives.
- Design-system directives.
- Class composition helpers.
- Event-manager providers.
- Component-library variants.

Do not turn `shared` into a general dumping ground for app components. Application-owned reusable
UI belongs in `ui`.

### `ui`

Use `ui` for application-owned visual code.

- `ui/pages/<page>` contains routed pages.
- `ui/pages/<page>/ui/molecules` contains page-local card, row, item, and field components.
- `ui/pages/<page>/ui/organisms` contains page-local panels, toolbars, forms, lists, and sections.
- Global `ui/molecules` and `ui/organisms` are only for components reused by multiple pages.

Promote a component from page-local to global only after real reuse appears. Avoid premature shared
components.

## Naming

Use consistent names:

- Directories and files: kebab-case.
- Routed pages: `*.page.ts`, `*Page` class, `<prefix>-*-page` selector.
- Components: bare feature name, no `.component` suffix unless the project already uses it.
- Services: `<domain>.service.ts` and `<Domain>Service`.
- DTO files: `*.dto.ts`.
- Domain type files: `*.type.ts`.
- Query DTOs: `<feature>-query.dto.ts`.
- Search response DTOs: `<feature>-search-response.dto.ts`.
- Page-local services: `ui/pages/<page>/core/service`.
- Global services: `core/service/<domain>`.

Use an import alias for cross-layer imports, for example `@/core/...` or `@/shared/...`. Prefer
relative imports inside the same feature subtree.

## Page Architecture

Pages should orchestrate, not render every detail inline.

A page usually owns:

- Route path inputs.
- Query param inputs.
- Page-level constants such as `PAGE_SIZE`.
- Query and mutation injection.
- Navigation decisions.
- Toast messages.
- Dialog-level decisions.
- Composition of organisms.

Organisms usually own:

- Panels.
- Toolbars.
- Filter panes.
- Forms.
- Lists.
- Sections with their own loading, empty, and error state.

Molecules usually own:

- Cards.
- Rows.
- Compact display widgets.
- Reusable field groups.
- Small controls with local behavior.

Do not make components too fine-grained. A component split should clarify ownership, isolate
stateful behavior, or make reuse real.

## Routing

Use component input binding for route params and query params when available.

Example route:

```ts
{
  path: 'admin/items/:itemId',
  component: AdminItemDetailPage,
}
```

Example page inputs:

```ts
readonly itemId = input.required<string>();
readonly search = input<string>();
readonly page = input<number, string | undefined>(1, {
  transform: (value) => Number(value ?? 1),
});
```

Keep route parameter names aligned with page input names. Avoid reading `ActivatedRoute` directly
in every component when input binding is already configured.

## Query Param Pattern

Search, filter, sort, and pagination state should be reflected in route query params.

Rules:

- Search text updates query params after a debounce.
- Select, switch, radio, and pagination filters update query params immediately.
- When a filter changes, reset `page` to `1` unless the current page is intentionally preserved.
- Do not locally filter placeholder or fetched data if the backend will own filtering.
- Keep query param names aligned with backend request DTO names when practical.
- Keep URL state shareable and restorable.

Example search control:

```ts
readonly search = input<string>();
readonly searchControl = signal('');

constructor() {
  effect(() => {
    this.searchControl.set(this.search() ?? '');
  });

  toObservable(this.searchControl)
    .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
    .subscribe((search) => {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: search || null, page: 1 },
        queryParamsHandling: 'merge',
      });
    });
}
```

Example immediate filter update:

```ts
onRoleChange(role: string | null): void {
  void this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { role, page: 1 },
    queryParamsHandling: 'merge',
  });
}
```

## Server State

Use TanStack Query for new server-state work.

### Service Ownership

Domain services own `queryOptions` and `mutationOptions` factories. Components should not manually
construct URLs or call `HttpClient` directly.

Service responsibilities:

- Build endpoint URLs through the centralized URI registry.
- Serialize query params.
- Call `HttpClient`.
- Map response envelopes when needed.
- Return typed `queryOptions` or `mutationOptions`.
- Define stable query keys.
- Keep transport details away from UI components.

Example service:

```ts
@Injectable({ providedIn: 'root' })
export class AdminItemsService {
  private readonly http = inject(HttpClient);

  searchItemsQueryOptions(query: AdminItemsQuery) {
    return queryOptions({
      queryKey: ['admin', 'items', query] as const,
      queryFn: () =>
        firstValueFrom(
          this.http.get<AdminItemsSearchResponse>(API_URIS.ADMIN.ITEMS.SEARCH, {
            params: this.toParams(query),
          }),
        ),
      placeholderData: keepPreviousData,
    });
  }

  updateItemMutationOptions() {
    return mutationOptions({
      mutationFn: (draft: ExistingItemDraft) =>
        firstValueFrom(
          this.http.put<Item>(API_URIS.ADMIN.ITEMS.BY_ID(draft.id), draft),
        ),
    });
  }

  private toParams(query: AdminItemsQuery): HttpParams {
    let params = new HttpParams();

    if (query.search) params = params.set('search', query.search);
    if (query.page) params = params.set('page', query.page);
    if (query.size) params = params.set('size', query.size);

    return params;
  }
}
```

### Component Ownership

Pages and owning organisms inject queries and mutations.

Example page:

```ts
readonly PAGE_SIZE = 10;

readonly queryParams = computed<AdminItemsQuery>(() => ({
  search: this.search() || undefined,
  page: this.page(),
  size: this.PAGE_SIZE,
  status: this.status() || undefined,
}));

readonly itemsQuery = injectQuery(() =>
  this.adminItemsService.searchItemsQueryOptions(this.queryParams()),
);

readonly pagesAmount = computed(() =>
  Math.ceil((this.itemsQuery.data()?.total ?? 0) / this.PAGE_SIZE),
);
```

Use query state directly:

- `query.isPending()` for the initial skeleton.
- `query.isFetching()` for subtle refresh indicators.
- `query.error()` for error panels.
- `query.data()` for the typed response.

Prefer `placeholderData: keepPreviousData` for paginated search pages to avoid blanking existing
content during page or filter changes.

### Query Keys

Use stable, descriptive query keys:

```ts
['admin', 'users', query]
['admin', 'users', userId]
['admin', 'phrase-sets', phraseSetId, 'summaries', query]
```

Keep keys broad enough to invalidate related data and specific enough to avoid accidental
over-invalidation.

### Mutations

Services expose mutation option factories. Pages inject and coordinate them.

Example:

```ts
readonly updateItemMutation = injectMutation(() =>
  this.adminItemsService.updateItemMutationOptions(),
);

async save(): Promise<void> {
  const draft = this.buildDraft();

  try {
    await this.updateItemMutation.mutateAsync(draft);
    await this.queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
    this.toast.success('Cambios guardados');
  } catch {
    this.toast.error('No se pudieron guardar los cambios');
  }
}
```

Mutation rules:

- Use server responses as authoritative.
- Do not add optimistic updates unless explicitly requested and carefully scoped.
- Show success and error toasts from the page, not the service.
- Invalidate affected query keys after success.
- Keep create and update payloads typed separately when they differ.
- Use confirmation dialogs for destructive or navigation-losing actions.

## Legacy Read Pattern

If a project still contains `rxResource`, treat it as legacy for existing Observable-first flows.

Acceptable uses:

- Existing pages that have not been migrated.
- Very localized read flows where migration would be unrelated to the task.
- Framework experiments explicitly requested by the user.

Avoid using it for:

- New admin pages.
- Search pages.
- Paginated lists.
- Detail pages with related aggregates.
- Editor pages that need invalidation after mutation.

Do not combine `rxResource` plus manual `linkedSignal` cache patterns in new code when TanStack
Query can provide caching, previous data, refetching, and invalidation.

## API Boundary

Centralize backend endpoints in one URI registry.

Example:

```ts
export const API_URIS = {
  BASE_URL,
  ADMIN: {
    USERS: {
      SEARCH: `${BASE_URL}/admin/users`,
      BY_ID: (userId: string) => `${BASE_URL}/admin/users/${userId}`,
      BAN: (userId: string) => `${BASE_URL}/admin/users/${userId}/ban`,
    },
  },
} as const;
```

Rules:

- Components never hardcode endpoint strings.
- Components never call `HttpClient` directly.
- Services serialize params and map response shapes.
- Endpoint builders receive path params.
- Request DTOs model query params and request bodies.
- Response DTOs model transport envelopes.
- Domain types model reusable business entities.

Use names that reflect backend contracts:

```ts
export type AdminUsersQuery = {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page: number;
  size: number;
};

export type AdminUsersSearchResponse = {
  data: Profile[];
  total: number;
};
```

If the backend returns `{ data, total }`, derive pagination from `total`. Do not infer page count
from the current array length.

## Authentication

Use a single authentication service as the application boundary around the auth provider.

The auth service owns:

- Provider client creation.
- OAuth sign-in.
- Email/password sign-in.
- Email/password sign-up.
- Sign-out.
- Session signals.
- User signals.
- Access-token retrieval.
- User-id retrieval.

Rules:

- Feature code should not import the auth provider client directly.
- HTTP interceptors should ask the auth service for the current JWT.
- The auth provider owns token storage and refresh.
- Do not create custom session IDs in `localStorage`.
- Do not duplicate auth state in feature services.
- Role-aware UI should fetch or decode role through the established profile/auth boundary.

Example:

```ts
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly session = signal<AuthSession | null>(null);
  readonly user = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  async getAccessToken(): Promise<string | null> {
    const session = await this.authClient.getSession();
    return session.data.session?.access_token ?? null;
  }
}
```

Auth-related profile data should come from a profile service when the backend is authoritative for
roles, status, or metadata.

## DTOs, Domain Types, And Drafts

Separate cached server data from mutable draft data.

Use explicit draft types for editor pages:

```ts
export type ExistingItem = Item & {
  id: string;
};

export type NewItemDraft = {
  title: string;
  description: string;
  published: boolean;
};

export type ExistingItemDraft = NewItemDraft & {
  id: string;
};

export type ItemDraft = NewItemDraft | ExistingItemDraft;
```

Rules:

- Treat query results as readonly cached data.
- Clone cached data into draft signals before editing.
- Do not mutate query results in place.
- Do not decide whether to sync incoming data by checking whether a draft array is empty.
- Track initialization explicitly, for example with a loaded id, source version, or dirty flag.
- Preserve user edits once the draft is dirty.
- Reinitialize drafts when the route entity id changes.

For sortable lists:

- Store visual order in the draft array.
- Recompute `position` from array index after every reorder.
- Use stable track keys for existing and newly added records.
- Keep new draft records identifiable with temporary client ids.

Example reorder:

```ts
private reorderDrafts(oldIndex: number, newIndex: number): void {
  this.phraseDrafts.update((drafts) => {
    const next = [...drafts];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);

    return next.map((draft, index) => ({
      ...draft,
      position: index + 1,
    }));
  });
}
```

## Forms

Use signal forms for new Angular forms.

Rules:

- Keep the form model in a signal.
- Use validators in the form schema.
- Keep submission in the page or owning organism.
- Keep field rendering in focused child components.
- Keep field-specific errors below the field.
- Bubble global form or server errors up through outputs or parent state.
- Do not let child forms call backend services unless the child is the aggregate owner.

Example:

```ts
readonly model = signal({
  email: '',
  password: '',
});

readonly form = form(this.model, (path) => {
  required(path.email);
  email(path.email);
  required(path.password);
});
```

Reusable field-error components should accept the form field state and render the current validation
messages. This avoids repeated error-message markup across forms.

## Component Communication

Use modern Angular component APIs:

- `input()` for inputs.
- `output()` for events.
- `model()` for two-way local component state when appropriate.
- `computed()` for derived state.
- `effect()` only for side effects, not for ordinary derivations.

Rules:

- Inputs are data and configuration.
- Outputs are user events or state notifications.
- Services are injected only where ownership is clear.
- Browser and third-party instances stay private.
- Templates consume signals and computed values.
- Do not duplicate derived values in writable signals.

## Loading, Empty, And Error States

Each data-owning component renders its own state.

Rules:

- A loading panel should not blank the entire page if sibling panels have data.
- Skeletons should live beside the component they represent.
- If the skeleton represents a molecule, place it in the page's `molecules` directory.
- If the skeleton represents an organism, place it in the page's `organisms` directory.
- Use design-system skeleton primitives.
- Keep skeleton size close to the final design.
- Empty states should tell the user what to do next.
- Error states should be recoverable when possible.

With TanStack Query:

- Use `isPending()` for first-load skeletons.
- Use `isFetching()` for background refresh.
- Use `error()` for failures.
- Use `keepPreviousData` for paginated views.

## Design System Usage

Use the existing design-system components first.

Reach for primitives such as:

- Buttons.
- Inputs.
- Input groups.
- Selects.
- Switches.
- Segmented controls.
- Badges.
- Cards or panels.
- Skeletons.
- Pagination.
- Alert dialogs.
- Toasts.
- Empty states.
- Dividers.
- Loaders.

Rules:

- Do not recreate complex controls if the design system already has them.
- Import through the design-system barrel paths.
- Use the project's class composition helper for variants.
- Keep variant definitions beside the primitive.
- Use app-owned wrappers for third-party libraries.
- Do not introduce another icon library if the project already has an icon pattern.

## Styling

Prefer utilities in templates for ordinary layout and visual rules.

Use component CSS for:

- `:host`.
- Reusable semantic classes.
- Pseudo-elements.
- Keyframe animations.
- Third-party widget internals.
- Complex state transitions.

Rules:

- Use semantic design tokens before raw colors.
- Add a token when a color, surface, border, or text style becomes repeated.
- Avoid arbitrary values when an existing scale or token works.
- Keep user-facing language consistent with the product locale.
- Decorative icons should be hidden from assistive technology.
- Icon-only buttons need accessible labels.
- Preserve visible focus states.

## Library Wrappers

Wrap third-party browser libraries behind application components or utilities.

Examples:

- Use an app-owned audio player instead of instantiating an audio library in feature components.
- Use an app-owned recorder utility instead of calling `MediaRecorder` directly everywhere.
- Use a sortable-list wrapper or a single owning organism for SortableJS setup.

Rules:

- Keep third-party instances private.
- Expose signal-backed state to templates.
- Clean up with `DestroyRef`.
- Destroy timers, object URLs, media streams, observers, audio players, and sortable instances.
- If a third-party library fetches resources internally, make sure it receives the current JWT or
  uses a URL that is already authorized.

## Admin And Aggregate Pages

For admin/search/aggregate pages, use a repeatable structure:

```text
<page>/
  core/
    dto/
    service/
  ui/
    molecules/
      <entity-card>/
      <entity-card-skeleton>/
    organisms/
      <toolbar>/
      <filter-panel>/
      <results-panel>/
      <bottom-nav-or-actions>/
  <page>.page.ts
  <page>.page.html
```

Common behavior:

- Search input syncs to `search` query param with debounce.
- Filters sync immediately to query params.
- Pagination syncs to `page` query param.
- Page size is a constant.
- Data comes from `injectQuery`.
- Total pages derive from backend `total`.
- Cards navigate to detail pages.
- Placeholder data is allowed only before wiring, and should stay typed.
- Once wired, remove local placeholder filtering.

## Editor Pages

Editor pages should separate cached data, draft state, and save behavior.

Common behavior:

- Route id determines create vs update when the project uses a sentinel such as `new`.
- Fetch existing data when editing.
- Initialize a draft from cached data once per entity id.
- Preserve dirty drafts while the user edits.
- Save with create mutation for new records.
- Save with update mutation for existing records.
- Show success and error toasts.
- Invalidate affected queries after success.
- Use an alert dialog for discard confirmation.
- Navigate away after confirmed discard or successful create when appropriate.

Keep create payloads and update payloads distinct when the backend contracts differ.

## Backend-Frontend Contract Style

Coordinate frontend services around backend endpoint specs.

For every endpoint, identify:

- Method.
- Path params.
- Query params.
- Request body.
- Response body.
- Auth requirements.
- Whether it is paginated.
- Whether it includes optional expansions such as `includeStats`, `includeEntries`,
  `includeContributor`, or `includePhraseSet`.

Then create:

- A URI registry entry or builder.
- A query DTO for query params.
- A response DTO for transport shape.
- Domain types if reusable.
- A service option factory.
- A page query or mutation using that factory.

Use backend names exactly when they are part of the contract. If the backend expects
`full_name`, send `full_name`, not `fullName`.

## Figma-To-Code Implementation

When implementing designs:

- Fetch design context and screenshot before coding.
- Translate design values into existing tokens and utilities.
- Use design-system primitives wherever possible.
- Keep components within the page structure.
- Do not over-split the design.
- Use typed placeholder data until backend wiring exists.
- Preserve current global navigation and shell unless the design explicitly replaces it.
- Build responsive behavior that matches the app's existing breakpoints and layout style.

If a design shows data that the API does not provide yet, document the missing backend fields or
endpoints before implementing the page.

## Accessibility

Preserve accessible behavior by default:

- Use semantic elements first.
- Add ARIA only when semantics are insufficient.
- Give icon-only controls accessible names.
- Preserve keyboard navigation.
- Preserve disabled states.
- Preserve focus visibility.
- Associate labels and descriptions with fields.
- Announce or visibly render form and server errors.
- Keep color contrast at WCAG AA or better.

## Validation

Use the configured production build as the final gate for application changes.

Rules:

- Run the package-manager build command after code changes.
- Do not rely on an unreliable test suite as the final completion signal.
- Add or run focused tests when useful, but do not let them replace the build gate unless the
  project explicitly says tests are reliable.
- For docs-only changes, a build is usually unnecessary.
- If a build fails because of unrelated existing errors, report the errors and do not modify
  unrelated components to make the build pass.

## Scope Control

Keep changes scoped to the user's request.

Rules:

- Do not fix unrelated components while implementing a page or component change.
- Do not rewrite architecture as cleanup unless requested.
- Do not replace established routing or styling strategies during unrelated tasks.
- Do not optimize CSS or budgets unless asked.
- If an unrelated error appears, report it clearly and stop short of unrelated edits.
- Respect existing dirty worktree changes.
- Never revert changes you did not make unless explicitly instructed.

## Agent Communication Style

When acting as a coding agent:

- Read the existing code before deciding.
- State assumptions when they matter.
- Prefer concrete implementation over speculative plans.
- Keep updates short and actionable.
- Explain blockers with file paths and exact causes.
- Ask questions only when the answer cannot be discovered and a wrong assumption would be risky.
- In final responses, summarize changed files, behavior, and validation.

Avoid generic praise, long narration, and unrelated recommendations.


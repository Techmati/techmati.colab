# Techmati Colab Project Guide

This file contains conventions specific to this repository. For generic Angular and TypeScript
guidance, use the installed Angular MCP and align its results with the workspace reported by
`list_projects`. The project currently targets Angular 21.

## Technologies

- Angular 21 standalone application, currently running without `zone.js` or
  `provideZoneChangeDetection`.
- TypeScript 5.9 with strict compiler and template checks.
- Supabase Auth through `@supabase/supabase-js` for OAuth, email/password sessions, and JWT access
  tokens.
- RxJS 7.8 for service-level asynchronous APIs and Angular `rxResource` for server-backed UI state.
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

### `src/app/ui`

Application-owned UI:

- `ui/pages/<page>` contains routed page components.
- A page owns feature-specific components under
  `ui/pages/<page>/ui/{atoms,molecules,organisms}`.
- Components reused across pages live under the corresponding global
  `ui/{atoms,molecules,organisms}` directory.

Promote a page-local component to global `src/app/ui` only after it is genuinely reused. Keep the
category hierarchy shallow; do not nest a second atoms/molecules/organisms tree inside a component
directory.

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

Static assets use root-relative URLs, for example `/res/brand.jpg`. Keep static application assets
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

## Server Data and Synchronization

### API boundary

- Define endpoint strings and endpoint builders in `src/app/core/config/api-uris.config.ts`.
- Select the production base URL from `import.meta.env['NG_APP_PROD_API_URL']`; keep environment
  access compatible with the `Env` index signature in `src/env.d.ts` and the
  `noPropertyAccessFromIndexSignature` compiler option.
- Keep `HttpClient` calls in domain services. UI components should not construct URLs or call
  `HttpClient` directly.
- The authentication interceptor adds the current Supabase JWT as a bearer token to requests whose
  URL starts with `API.BASE_URL`.
- Services return typed, cold observables. Map transport envelopes to the domain shape when it
  simplifies consumers.
- Contributor-specific requests obtain the authenticated Supabase user ID through
  `AuthenticationService.getUserId()`, then use RxJS `from` and `switchMap` to perform the dependent
  request.

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
- Protected routes use `authenticationGuard`.
- The welcome page supports Google OAuth plus email/password login and registration. Keep OAuth
  service methods provider-generic.

### Reads

- Components expose server reads through `rxResource`.
- Put route inputs, pagination, filters, or refresh counters in resource `params`; derive them with
  `computed` when necessary.
- Derive template-ready values from resources with `computed`.
- Where a refresh should not blank already-rendered data, use the established `linkedSignal`
  previous-value pattern.
- Render resource loading and error states within the component that owns the read.
- Loading skeletons use the Zard skeleton primitive and live beside the component they represent,
  under the matching page-local `molecules` or `organisms` directory.
- Keep sibling panels independent: one panel loading must not replace the rest of the page.

### Mutations and refresh

- The server is authoritative; the project does not use optimistic updates or a client query cache.
- Async event handlers may use `tryCatch` to convert an Observable or Promise into the
  `[data, error]` tuple used by current mutation flows.
- Track mutation progress and user-facing errors in explicit signals.
- After a successful mutation, invalidate affected reads by changing a resource parameter. The
  translation flow uses `nextPhraseTick` for this purpose, causing both phrase and summary resources
  to refetch.
- Reset form state only after the server mutation succeeds.
- Translation submission uses `FormData` with JSON in the `data` part and the recording in the
  `audio` part. Preserve that API contract.
- There is no polling, WebSocket, or realtime subscription layer. Server synchronization occurs
  through resource loads, parameter invalidation, and navigation.

## State and Component Boundaries

- Keep local interaction state in signals and derive state rather than duplicating it.
- Use inputs for data/configuration and outputs for user events or child loading state.
- Keep browser and library instances private; expose signal-derived state to templates.
- Use `DestroyRef` to release timers, media streams, object URLs, WaveSurfer instances, and other
  external resources.
- Route path and query parameters are bound to page inputs through
  `withComponentInputBinding()`. Keep route parameter names aligned with page input names.
- Routes are currently eager component references after explicit troubleshooting of lazy loading.
  Do not rewrite the routing strategy as an unrelated cleanup.

## Forms

- Active forms use a signal model plus Angular Signal Forms validators.
- Page components own submission and server error state; focused child components own rendering and
  validation presentation.
- Rich custom fields such as `TranslationTextarea` and `PronunciationRecorder` implement
  `ControlValueAccessor` so they can participate in the form field tree.
- A custom control must propagate value, touched, and disabled state and release any resources it
  owns.

## Library Wrappers

- Use `WavesAudioPlayer` instead of creating WaveSurfer instances in feature components.
- Use `AudioRecorder` instead of using `MediaRecorder` directly.
- Use `mergeClasses` for Zard variant class composition. It combines `clsx` and `tailwind-merge`.
- Zard variants are defined with `class-variance-authority`; keep variant logic beside the primitive.
- `provideZard()` installs the project event syntax, including prevention/propagation modifiers and
  debounced events. Reuse that syntax rather than adding one-off event wrappers.
- Use `TimeAgoPipe` for relative contribution timestamps.

## Styling and Assets

- Prefer Tailwind utilities in templates for layout and common visual rules.
- Use component CSS for `:host`, reusable semantic classes, pseudo-elements, animations, and
  third-party widget styling.
- Use semantic color and surface utilities backed by `src/styles.css`, such as `bg-card`,
  `text-text-secondary`, and `border-border-subtle`.
- Add or map a design token in `src/styles.css` before introducing a new repeated color.
- Avoid arbitrary Tailwind values when a standard scale class or existing token expresses the
  design. Generated Zard source is an exception and should not be mechanically rewritten.
- Icon classes come from the Iconify Tailwind plugin and decorative icons should be hidden from
  assistive technology.
- The UI language is Spanish and Angular locale data is registered as `es-MX`. Keep date formatting
  and user-facing copy consistent with that locale.

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

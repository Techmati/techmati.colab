
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection


# Specific angular project conventions

## Directory structure
The components are organized according on the scope these are used.
If a component is used widely across the project and is constantly reused by other components, sections or pages, these are place in the src/app/ui directory.

Components are categorized according to their size and complexity.
If a component is small and simple, it is categorized as an atom component.
If a component is more complex and consists of multiple atoms and its main purpose or function is less reusable, it is categorized as a molecule component.
If a component is even more complex and consists of multiple molecules, and its function is specific and accomplish a single purpose within its scope, it is categorized as an organism.
If a component is a page, it is categorized as a page component
Pages are the top-level components that represent a specific view or route in the application. They are responsible for rendering the overall layout and structure of the page, and they often contain multiple organisms, molecules, and atoms to build the complete user interface.
Therefore, every page has its own internal /ui directory, which contains the components that are specific to that page and are not reused across other pages or sections of the application.
Contrary to the components, pages are not place in src/app/ui, instead they are placed in the src/app/pages directory, and every page has its own directory, which contains the page component and its internal /ui directory.
If a component requires logic outside of the scope of rendering the view, such as fetching data from an API, handling user interactions, or managing state, the utilities, types and services used in the component logic are placed in a /core directory, next to the /ui directory of the component.


Example: Directory structure of a page component:
```
parlitos-webapp
├── public
├── src
│   ├── app
│   │   ├── shared
│   │   ├── ui
│   │   │   ├── molecules
│   │   │   │   └── product-card
│   │   │   │       ├── product-card.css
│   │   │   │       ├── product-card.html
│   │   │   │       ├── product-card.spec.ts
│   │   │   │       └── product-card.ts
│   │   │   ├── organisms
│   │   │   │   └── header
│   │   │   │       ├── header.css
│   │   │   │       ├── header.html
│   │   │   │       ├── header.spec.ts
│   │   │   │       └── header.ts
│   │   │   └── pages
│   │   │       ├── home
│   │   │       │   ├── home.page.html
│   │   │       │   ├── home.page.spec.ts
│   │   │       │   └── home.page.ts
│   │   │       └── store
│   │   │           ├── store.page.html
│   │   │           ├── store.page.spec.ts
│   │   │           └── store.page.ts
│   │   ├── app.config.ts
│   │   ├── app.css
│   │   ├── app.html
│   │   ├── app.routes.ts
│   │   ├── app.spec.ts
│   │   └── app.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── README.md
├── angular.json
├── components.json
├── package.json
├── tsconfig.app.json
└── tsconfig.json
```
Note: Avoid using the src/app/shared or src/app/zardui directory for components, as it can lead to a disorganized and cluttered codebase. Instead, use the src/app/ui directory to organize components based on their scope and reusability, also the pages must be located at src/app/ui/pages, avoid creating a root directory dedicated to pages.
Avoid creating sub hierarchies of components within the src/app/ui directory, as it can lead to a complex and difficult-to-navigate directory structure. Instead, use a flat structure for global components within the src/app/ui directory, and categorize them based on their size and complexity (atoms, molecules, organisms) without creating additional subdirectories. Also substructures withing page directories (example: a page at src/app/ui/pages/home) are allowed, so a structure like src/app/ui/pages/home/molecules is completely valid, but a structure like src/app/ui/pages/home/molecules/navbar/molecules is invalid. This approach promotes simplicity and ease of navigation within the codebase.

## Naming conventions
- Component files should be named using kebab-case, which is a convention in Angular projects.
- The component class should be named using PascalCase, which is a convention for class names
- The component selector should be named using kebab-case, which is a convention for HTML tags.
- The ocmponent selector should include the "tm" prefix which reflects the name of the project, to avoid naming conflicts with other libraries or components that may be used in the project.
- The component file name should not have suffixes like .component,.service, etc. as these are redundant and do not add any value to the file name. Just add them at pages using naming the files names with the .page suffix and reflecting it in the name of the component class and the selector, to make it clear that these are page components and not reusable components.
Example A home page should have home.page.ts file names and its component class should be named HomePage and its selector should be named pong-home-page, to make it clear that this is a page component and not a reusable component.

## Styling using tailwind
Do not use bracket notation to represent sizes, always use the predefined sizes provided by tailwind, to maintain consistency and readability in the codebase. Using bracket notation can make the code harder to read and understand, especially for developers who are not familiar with tailwind or who are new to CSS. By using the predefined sizes, it is easier to understand the intent of the code and to maintain a consistent design system across the project. Additionally, using predefined sizes can help to ensure that the design is responsive and works well on different screen sizes and devices.
Never hardcode colors directly into elements, always use the predefined colors defined in the styles.css file, if a color is not there, find a tailwind token that matches it but try to always search the corresponding variable declared in that file, to maintain consistency and readability in the codebase. Hardcoding colors can make it difficult to maintain and update the design system, as it can lead to inconsistencies and make it harder to change the color scheme across the entire project. By using predefined colors, it is easier to maintain a consistent design system and to make changes to the color scheme without having to search through the entire codebase for hardcoded colors. Additionally, using predefined colors can help to ensure that the design is accessible and meets contrast requirements for users with visual impairments.

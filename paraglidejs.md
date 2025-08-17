Strategy
Paraglide JS comes with various strategies to determine the locale out of the box.

The strategy is defined with the strategy option. The priority is determined by the order of the strategies in the array. The first strategy that returns a locale will be used.

In the example below, the cookie strategy first determines the locale. If no cookie is found, the baseLocale is used.

compile({
project: "./project.inlang",
outdir: "./src/paraglide",

- strategy: ["cookie", "baseLocale"]
  })
  Built-in strategies
  cookie
  The cookie strategy determines the locale from a cookie.

compile({
project: "./project.inlang",
outdir: "./src/paraglide",

- strategy: ["cookie"]
  })
  baseLocale
  Returns the baseLocale defined in the settings.

It is useful as a fallback strategy if no other strategy returns a locale, for example, if a cookie has not been set yet.

compile({
project: "./project.inlang",
outdir: "./src/paraglide",

- strategy: ["cookie", "baseLocale"]
  })
  globalVariable
  Uses a global variable to determine the locale.

This strategy is only useful in testing environments or to get started quickly. Setting a global variable can lead to cross-request issues in server-side environments, and the locale is not persisted between page reloads in client-side environments.

compile({
project: "./project.inlang",
outdir: "./src/paraglide",

- strategy: ["globalVariable"]
  })
  preferredLanguage
  Automatically detects the user's preferred language from browser settings or HTTP headers.

On the client: Uses navigator.languages
On the server: Uses the Accept-Language header
compile({
project: "./project.inlang",
outdir: "./src/paraglide",

- strategy: ["preferredLanguage", "baseLocale"]
  })
  The strategy attempts to match locale in order of user preference:

First try exact matches (e.g., "en-US" if supported)
Falls back to base language codes (e.g., "en")
For example:

If user prefers fr-FR,fr;q=0.9,en;q=0.7 and your app supports ["en", "fr"], it will use fr
If user prefers en-US and your app only supports ["en", "de"], it will use en
localStorage
Determine the locale from the user's local storage.

compile({
project: "./project.inlang",
outdir: "./src/paraglide",

- strategy: ["localStorage"]
  })
  url
  Determine the locale from the URL (pathname, domain, etc).

compile({
project: "./project.inlang",
outdir: "./src/paraglide",

- strategy: ["url", "cookie"]
  })
  The URL-based strategy uses the web standard URLPattern to match and localize URLs.

Use https://urlpattern.com/ to test your URL patterns.

Locale prefixing
https://example.com/about
https://example.com/de/about
compile({
project: "./project.inlang",
outdir: "./src/paraglide",
strategy: ["url", "cookie"],
urlPatterns: [
{
pattern: "/:path(._)?",
localized: [
["de", "/de/:path(._)?"],
// ✅ make sure to match the least specific path last
["en", "/:path(.*)?"],
],
},
],
});
Translated pathnames
For pathnames where you want to localize the structure and path segments of the URL, you can use different patterns for each locale. This approach enables language-specific routes like /about in English and /ueber-uns in German.

https://example.com/about
https://example.com/ueber-uns
Here's a simple example with translated path segments:

compile({
project: "./project.inlang",
outdir: "./src/paraglide",
strategy: ["url", "cookie"],
urlPatterns: [
// Specific translated routes
{
pattern: "/about",
localized: [
["en", "/about"],
["de", "/ueber-uns"],
],
},
{
pattern: "/products/:id",
localized: [
["en", "/products/:id"],
["de", "/produkte/:id"],
],
},
// Wildcard pattern for untranslated routes
// This allows you to incrementally translate routes as needed
{
pattern: "/:path(._)?",
localized: [
["en", "/:path(._)?"],
["de", "/:path(.*)?"],
],
},
],
});
Domain-based localization
https://example.com/about
https://de.example.com/about
compile({
project: "./project.inlang",
outdir: "./src/paraglide",
strategy: ["url", "cookie"],
urlPatterns: [
// Include the localhost domain as otherwise the pattern will
// always match and the path won't be localized
{
pattern: 'http://localhost::port?/:path(._)?',
localized: [
["en", 'http://localhost::port?/en/:path(._)?'],
["de", 'http://localhost::port?/de/:path(.*)?']
],
},
// production pattern which uses subdomains like de.example.com
{
pattern: "https://example.com/:path(.*)?",
localized: [
["en", "https://example.com/:path(.*)?"],
["de", "https://de.example.com/:path(.*)?"],
],
},
],
});
Adding a base path
You can add a base path to your URL patterns to support localized URLs with a common base path.

For example, with the base path set to "shop":

runtime.localizeHref("/about") will return /shop/en/about
runtime.deLocalizeHref("/about") will return /shop/about
When using a base path, it's important to make it optional using the {basepath/}? syntax with curly braces and the ? modifier. This ensures that paths without the base path will still be properly matched and have the base path added during localization.

compile({
project: "./project.inlang",
outdir: "./src/paraglide",
strategy: ["url", "cookie"],
urlPatterns: [
{
pattern: "/{shop/}?:path(._)?",
localized: [
["en", "/{shop/}?en/:path(._)?"],
["de", "/{shop/}?de/:path(.*)?"],
],
},
],
});
This configuration enables:

Original URL Localized URL (EN) Localized URL (DE) Notes
/about /shop/en/about /shop/de/about Path without base path gets base path added
/shop/about /shop/en/about /shop/de/about Path with base path gets properly localized
The curly braces {} with the ? modifier ensure that the group is treated as optional, allowing both URLs with and without the base path to be matched and properly localized.

Making URL patterns unavailable in specific locales
You can configure certain URL patterns to be unavailable in specific locales by redirecting them to a 404 page or any other designated error page.

This is useful when some content or features should only be accessible in certain languages.

https://example.com/specific-path // Available in English
https://example.com/de/404 // Redirected to 404 in German
To implement this, map the pattern to your 404 page URL for the locales where the content should be unavailable:

compile({
project: "./project.inlang",
outdir: "./src/paraglide",
strategy: ["url", "cookie"],
urlPatterns: [
// 404 page definition.
//
// 💡 make sure to define the 404 pattern
// before a catch all pattern
{
pattern: "/404",
localized: [
["en", "/404"],
["de", "/de/404"],
// defining paths for locales that should not
// be caught by the catch all pattern
//
// this will be matched first and the catch all
// pattern will not be triggered and a redirect
// from /de/unavailable to /de/404 will be triggered
["de", "/de/unavailable"]
],
},
// Path that's only available in English
{
pattern: "/specific-path",
localized: [
["en", "/specific-path"], // Normal path in English
["de", "/de/404"], // Redirects to 404 in German
],
},
// Catch-all pattern for other routes
{
pattern: "/:path(._)?",
localized: [
["en", "/:path(._)?"],
["de", "/de/:path(.*)?"],
],
},
],
});
When a user tries to access /specific-path in German, they will be redirected to /de/404 instead. This approach allows you to:

Make certain content available only in specific languages
Create locale-specific restrictions for particular routes
Implement gradual rollouts of features by language
Handle legacy URLs that might only exist in certain locales
Note that other paths will still work normally through the catch-all pattern, so only the specifically configured paths will be unavailable.

Troubleshooting URL patterns
When working with URL patterns, there are a few important considerations to keep in mind:

Excluding paths is not supported
URLPattern does not support negative lookahead regex patterns.

The decision to not support negative lookaheads is likely related to ReDoS (Regular Expression Denial of Service) attacks. Read this blog post or the CVE on GitHub.

Pattern order matters
URL patterns are evaluated in the order they appear in the urlPatterns array. The first pattern that matches a URL will be used. This means that more specific patterns should come before more general patterns.

urlPatterns: [
// ❌ INCORRECT ORDER: The wildcard pattern will match everything,
// so the specific pattern will never be reached
{
pattern: "https://example.com/:path(.*)?", // This will match ANY path
localized: [
["en", "https://example.com/:path(.*)?"],
["de", "https://example.com/de/:path(.*)?"],
],
},
{
pattern: "https://example.com/blog/:id", // This will never be reached
localized: [
["en", "https://example.com/blog/:id"],
["de", "https://example.com/de/blog/:id"],
],
},
]

// ✅ CORRECT ORDER: Specific patterns first, then more general patterns
urlPatterns: [
{
pattern: "https://example.com/blog/:id", // Specific pattern first
localized: [
["en", "https://example.com/blog/:id"],
["de", "https://example.com/de/blog/:id"],
],
},
{
pattern: "https://example.com/:path(.*)?", // General pattern last
localized: [
["en", "https://example.com/:path(.*)?"],
["de", "https://example.com/de/:path(.*)?"],
],
},
]
Localized pattern order matters too
Within each pattern's localized array, the order of locale patterns also matters. When localizing a URL, the first matching pattern for the target locale will be used. Similarly, when delocalizing a URL, patterns are checked in order.

This is especially important for path-based localization where one locale has a prefix (like /de/) and another doesn't. In these cases, put the more specific pattern (with prefix) first.

// ❌ INCORRECT ORDER: The first pattern is too general
{
pattern: "https://example.com/:path(.*)?",
localized: [
["en", "https://example.com/:path(.*)?"], // This will match ANY path
["en", "https://example.com/en/blog/:id"], // This specific pattern will never be reached
],
}

// ✅ CORRECT ORDER: Specific patterns first, then more general patterns
{
pattern: "https://example.com/:path(.*)?",
localized: [
["en", "https://example.com/en/blog/:id"], // Specific pattern first
["en", "https://example.com/:path(.*)?"], // General pattern last
],
}

// ❌ INCORRECT ORDER FOR DELOCALIZATION: Generic pattern first will cause problems
{
pattern: "/:path(._)?",
localized: [
["en", "/:path(._)?"], // Generic pattern will match everything including "/de/about"
["de", "/de/:path(.*)?"], // Pattern with prefix won't be reached for delocalization
],
}

// ✅ CORRECT ORDER: More specific patterns with prefixes should come first
{
pattern: "/:path(._)?",
localized: [
["de", "/de/:path(._)?"], // Specific pattern with prefix first
["en", "/:path(.*)?"], // Generic pattern last
],
}
Example: Multi-tenant application with specific routes
For a multi-tenant application with specific routes, proper pattern ordering is crucial:

compile({
project: "./project.inlang",
outdir: "./src/paraglide",
strategy: ["url", "cookie"],
urlPatterns: [
// Specific product routes first
{
pattern: "https://:tenant.example.com/products/:id",
localized: [
["en", "https://:tenant.example.com/products/:id"],
["de", "https://:tenant.example.com/produkte/:id"],
["fr", "https://:tenant.example.com/produits/:id"],
],
},
// Specific category routes next
{
pattern: "https://:tenant.example.com/categories/:name",
localized: [
["en", "https://:tenant.example.com/categories/:name"],
["de", "https://:tenant.example.com/kategorien/:name"],
["fr", "https://:tenant.example.com/categories/:name"],
],
},
// General wildcard pattern last
{
pattern: "https://:tenant.example.com/:path(._)?",
localized: [
["en", "https://:tenant.example.com/:path(._)?"],
["de", "https://:tenant.example.com/de/:path(.*)?"],
["fr", "https://:tenant.example.com/fr/:path(.*)?"],
],
},
],
});
With this configuration:

Product URLs like https://acme.example.com/products/123 will use the specific product pattern
Category URLs like https://acme.example.com/categories/electronics will use the specific category pattern
All other URLs will fall back to the general pattern
Write your own strategy
Write your own cookie, http header, or i18n routing based locale strategy to integrate Paraglide into any framework or app.

Only two APIs are needed to define this behaviour and adapt Paraglide JS to your requirements:

overwriteGetLocale defines the getLocale() function that messages use to determine the locale
overwriteSetLocale defines the setLocale() function that apps call to change the locale
Because the client and server have separate Paraglide runtimes, you will need to define these behaviours separately on the client and server.

The steps are usually the same, irrespective of the strategy and framework you use:

Use overwriteGetLocale() function that reads the locale from a cookie, HTTP header, or i18n routing.
Handle any side effects of changing the locale and trigger a re-render in your application via overwriteSetLocale() (for many apps, this may only be required on the client side).
Read the architecture documentation to learn more about's Paraglide's inner workings.

Dynamically resolving the locale (cookies, http headers, i18n routing, etc.)
To dynamically resolve the locale, pass a function that returns the locale to getLocale(). You can use this to get the locale from the documentElement.lang attribute, a cookie, a locale route, or any other source.

import { m } from "./paraglide/messages.js";
import { overwriteGetLocale } from "./paraglide/runtime.js";

overwriteGetLocale(() => document.documentElement.lang /\*_ en _/);

m.orange_dog_wheel(); // Hello world!
On the server, you might determine the locale from a cookie, a locale route, a http header, or anything else. When calling overwriteGetLocale() on the server, you need to be mindful of race conditions caused when multiple requests come in at the same time with different locales.

To avoid this, use AsyncLocaleStorage in Node, or its equivalent for other server-side JS runtimes.

import { m } from "./paraglide/messages.js";
import {overwriteGetLocale, baseLocale } from "./paraglide/runtime.js";
import { AsyncLocalStorage } from "node:async_hooks";
const localeStorage = new AsyncLocalStorage();

overwriteGetLocale(() => {
//any calls to getLocale() in the async local storage context will return the stored locale
return localeStorage.getStore() ?? baseLocale;
});

export function onRequest(request, next) {
const locale = detectLocale(request); //parse the locale from headers, cookies, etc.
// set the async locale storage for the current request
// to the detected locale and let the request continue
// in that context
return localeStorage.run(locale, async () => await next());
}
Custom strategies
In addition to overwriting the getLocale() and setLocale() functions, Paraglide supports defining custom strategies that can be included alongside built-in strategies in your strategy array. This approach provides a cleaner way to encapsulate custom locale resolution logic.

Custom strategies must follow the naming pattern custom-<name> where <name> can contain any characters (including hyphens, underscores, etc.).

They can be defined in both client- and server-side environments, enabling you to develop reusable locale resolution logic that integrates seamlessly with Paraglide's runtime. Use the defineCustomClientStrategy() and defineCustomServerStrategy() functions to write strategies for each environment. Follow the examples below to define your own custom strategies.

To use them, you need to include them in the strategy array when configuring your project.

compile({
project: "./project.inlang",
outdir: "./src/paraglide",

- strategy: ["custom-userPreferences", "cookie", "baseLocale"]
  })
  Client-side custom strategies
  Define a custom strategy for client-side locale resolution using defineCustomClientStrategy(). The handler must implement both getLocale() and setLocale() methods.

When to use: Use client-side custom strategies when you need to read/write locale from sources that are only available in the browser (like query parameters, sessionStorage, URL hash, etc.).

Where to call: Define your custom strategies in your app's initialization code, before the runtime starts using them. For framework apps, this is typically in your main app file, a layout component, or a plugin/middleware setup.

import { defineCustomClientStrategy } from "./paraglide/runtime.js";

// Example 1: sessionStorage strategy
defineCustomClientStrategy("custom-sessionStorage", {
getLocale: () => {
return sessionStorage.getItem("user-locale") ?? undefined;
},
setLocale: (locale) => {
sessionStorage.setItem("user-locale", locale);
}
});

// Example 2: Query parameter strategy (answers the original question!)
defineCustomClientStrategy("custom-queryParam", {
getLocale: () => {
const urlParams = new URLSearchParams(window.location.search);
return urlParams.get('locale') ?? undefined;
},
setLocale: (locale) => {
const url = new URL(window.location);
url.searchParams.set('locale', locale);
window.history.replaceState({}, '', url.toString());
}
});

// Example 3: URL hash strategy
defineCustomClientStrategy("custom-hash", {
getLocale: () => {
const hash = window.location.hash.slice(1); // Remove #
return hash.startsWith('lang=') ? hash.replace('lang=', '') : undefined;
},
setLocale: (locale) => {
window.location.hash = `lang=${locale}`;
}
});
Server-side custom strategies
For server-side custom strategies, use defineCustomServerStrategy(). The handler only needs to implement a getLocale() method that accepts an optional Request parameter.

When to use: Use server-side custom strategies when you need to read locale from server-specific sources (like custom headers, databases, authentication systems, etc.).

Where to call: Define your custom strategies in your server initialization code, before the middleware starts processing requests. For framework apps, this is typically in your server setup file or middleware configuration.

Async support: Server-side custom strategies support async operations! If your getLocale method returns a Promise, the system will automatically use the async locale extraction path.

import { defineCustomServerStrategy } from "./paraglide/runtime.js";

// Example 1: Custom header strategy
defineCustomServerStrategy("custom-header", {
getLocale: (request) => {
const locale = request?.headers.get("X-Custom-Locale");
return locale ?? undefined;
}
});

// Example 2: Async database strategy
defineCustomServerStrategy("custom-database", {
getLocale: async (request) => {
const userId = extractUserIdFromRequest(request);
if (!userId) return undefined;

    try {
      // This async call is supported!
      return await getUserLocaleFromDatabase(userId);
    } catch (error) {
      console.warn("Failed to fetch user locale:", error);
      return undefined;
    }

}
});

// Example 3: Query parameter on server (for SSR)
defineCustomServerStrategy("custom-serverQuery", {
getLocale: (request) => {
const url = new URL(request.url);
return url.searchParams.get('locale') ?? undefined;
}
});
Advanced example: Full-stack user preference strategy
Here's a complete example showing how to implement user preference strategies on both client and server, with async database support:

// File: src/locale-strategies.js
import { defineCustomClientStrategy, defineCustomServerStrategy } from "./paraglide/runtime.js";
import { getUserLocale, setUserLocale, extractUserIdFromRequest } from "./services/userService.js";

// Client-side strategy - works with user preferences in browser
defineCustomClientStrategy("custom-userPreference", {
getLocale: () => {
// Get from memory cache, framework state store, or return undefined to fall back
return window.**userLocale ?? undefined;
},
setLocale: async (locale) => {
try {
// Update user preference in database via API
await setUserLocale(locale);
window.**userLocale = locale;

      // Optional: Also update URL query param for immediate reflection
      const url = new URL(window.location);
      url.searchParams.set('locale', locale);
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.warn("Failed to save user locale preference:", error);
      // Strategy can still succeed even if save fails
    }

}
});

// Server-side strategy - async database lookup
defineCustomServerStrategy("custom-userPreference", {
getLocale: async (request) => {
const userId = extractUserIdFromRequest(request);
if (!userId) return undefined;

    try {
      // Async database call - this is now fully supported!
      return await getUserLocale(userId);
    } catch (error) {
      console.warn("Failed to fetch user locale from database:", error);
      return undefined; // Fallback to next strategy
    }

}
});
Custom strategy benefits
Custom strategies offer several advantages over the traditional overwriteGetLocale() approach:

Composability: They can be combined with built-in strategies in a single strategy array
Priority handling: They respect the strategy order, allowing fallbacks to other strategies
Framework integration: Easier to package and distribute with framework adapters
Type safety: Better TypeScript support for custom strategy handlers
Error isolation: If a custom strategy fails, execution continues with the next strategy
Async support: Server-side strategies can perform async operations like database queries
Middleware compatibility: Work seamlessly with Paraglide's server middleware
Important Notes
Async Support:

✅ Server-side strategies support async getLocale methods
❌ Client-side strategies must have synchronous getLocale methods (but setLocale can be async)
If you need async client-side locale detection, use the overwriteGetLocale() approach instead
Strategy Priority:

Custom strategies are processed in the order they appear in your strategy array
If a custom strategy returns undefined, the system falls back to the next strategy
Server-side: Custom strategies are checked first, then built-in strategies
Client-side: All strategies (custom and built-in) are processed in your defined order
Validation: Custom strategy names must start with custom- followed by at least one character. The name part after custom- can contain any characters including hyphens, underscores, etc.

Valid examples:

custom-sessionStorage
custom-user-preference
custom-query_param
custom-database
Invalid examples:

custom- (no name after prefix)
my-custom-strategy (doesn't start with custom-)
sessionStorage (missing custom- prefix)
Basics
Adding and removing locales
To add a new locale, add it to the locales array in <project0name>.inlang/settings.json file.

// project.inlang/settings.json

{
"baseLocale": "en",

- "locales": ["en", "de"]
  }
  Adding and editing messages
  This section assumes you use the inlang message format plugin that is setup by default in Paraglide JS.
  Messages are stored in messages/{locale}.json as key-value pairs. You can add parameters with curly braces.

// messages/en.json
{

-     "greeting": "Hello {name}!"
  }
  Importing messages
  After compiling your project, you'll have access to all your messages through the generated messages.js file:

// Import all messages at once
import { m } from "./paraglide/messages.js";

// Use a message
console.log(m.hello_world()); // "Hello World!"
Using parameters
For messages with parameters, simply pass an object with the parameter values:

// messages/en.json
// { "greeting": "Hello {name}!" }

import { m } from "./paraglide/messages.js";

// Pass parameters as an object
console.log(m.greeting({ name: "Samuel" })); // "Hello Samuel!"
Forcing a locale
You can override the locale by passing a locale option as the second parameter:

This is particularly useful in server-side contexts where you might need to render content in multiple languages regardless of the user's current locale.
import { m } from "./paraglide/messages.js";

// Force the message to be in German
console.log(m.greeting({ name: "Samuel" }, { locale: "de" })); // "Hallo Samuel!"
Setting the locale
To change the current locale, use the setLocale function:

import { setLocale } from "./paraglide/runtime.js";

// Change locale to German
setLocale("de");
Disabling reloading
By default, setLocale() triggers a full page reload. This is a deliberate design decision that:

Enables a small, efficient runtime without complex state management
Makes Paraglide work in any framework without requiring framework-specific adapters
Follows the pattern used by major websites like YouTube, as language switching is an infrequent action that doesn't justify the complexity of a no-reload approach
If you need to change the locale without a page reload, you can pass { reload: false } as the second parameter, but then you'll need to handle UI updates yourself.

// Change locale without reloading the page
setLocale("de", { reload: false });
Getting the current locale
To get the current locale, use the getLocale function:

import { getLocale } from "./paraglide/runtime.js";

console.log(getLocale()); // "de"
Routing
Automatic <a> tag localization has been removed in v2. See changelog and this issue for more information.

You must explicitly use localizeHref() for URL localization:

<a href={localizeHref("/blog")}>Blog</a>
Important: If you route to a different locale, ensure a reload happens afterwards. See https://inlang.com/m/gerre34r/library-inlang-paraglideJs/errors#switching-locales-via-links-doesnt-work

Choosing your strategy
You likely want to use one of the built-in strategies. Visit the strategy documentation to learn more.

Message keys and organization
Paraglide supports nested keys through bracket notation but recommends flat keys due to management complexity. Learn more about message key structures and best practices.

// messages/en.json
{
// Recommended: flat keys with snake_case
"user_profile_title": "User Profile",

// Also supported but not recommended: nested keys
"user": {
"profile": {
"title": "User Profile"
}
}
}
import { m } from "./paraglide/messages.js";

console.log(m.user_profile_title()); // "User Profile" (recommended)
console.log(m["user.profile.title"]()); // "User Profile" (also works)
Dynamically calling messages
You can dynamically call messages by specifying what messages you expect beforehand. Specifying the messages beforehand preserves tree-shaking.

import { m } from "./paraglide/messages.js";

const messages = {
greeting: m.greeting,
goodbye: m.goodbye,
};

let messageKey = "greeting";

console.log(messages[messageKey]());
// "Hello World!"
Message Keys and Structure
Nested keys are supported but not recommended
Paraglide JS supports nested keys through bracket notation syntax m["something.nested"](), which simulates nesting without actually creating nested JavaScript objects. This approach leverages TypeScript's template literal types to provide type safety while maintaining the flat structure that enables tree-shaking.

While nested keys are supported, we strongly recommend using flat keys instead. The flat structure is what databases, applications, and compilers naturally work with.
Why we recommend flat keys

1. Flat lists are the native format
   Databases operate on flat structures: Messages are stored in SQLite internally, which naturally uses flat key-value pairs
   Applications use flat lookups: At runtime, messages are accessed by key, not by traversing nested objects
   Compilers work with flat lists: The compilation process transforms each message into an individual function
2. Nested keys create unnecessary complexity
   While nested keys might seem nice for developers initially, they create pain for everyone else in the ecosystem:

Translators: Have to understand hierarchical structures instead of simple key-value pairs
Build tools: Need to parse and transform nested structures into flat lists
Runtime performance: Simulated nesting through bracket notation prevents some optimizations
Type safety: While TypeScript template literals provide types, direct function names offer better IDE support
How to use nested keys (if you must)
If you have existing messages with dot notation, you can access them using bracket notation:

// messages/en.json
{
"nav.home": "Home",
"nav.about": "About",
"nav.contact": "Contact"
}
import { m } from "./paraglide/messages.js";

// Access with bracket notation
console.log(m["nav.home"]()); // "Home"
console.log(m["nav.about"]()); // "About"

// TypeScript provides autocomplete for these keys
type NavKey = "nav.home" | "nav.about" | "nav.contact";
const key: NavKey = "nav.home";
console.log(m[key]());
The bracket notation uses TypeScript's template literal types feature to maintain type safety while keeping the underlying structure flat. This is purely a TypeScript compile-time feature - at runtime, these are still individual functions.
Recommended approach: Flat keys
Instead of nesting, use prefixes to organize related messages:

// messages/en.json
{
"nav_home": "Home",
"nav_about": "About",
"nav_contact": "Contact",
"footer_privacy": "Privacy Policy",
"footer_terms": "Terms of Service"
}
Benefits of this approach:

import { m } from "./paraglide/messages.js";

// ✅ Direct function calls with perfect tree-shaking
console.log(m.nav_home()); // "Home"

// ✅ Better IDE support with go-to-definition
// ✅ Cleaner imports with auto-import
// ✅ No runtime overhead
Working with dynamic keys
For dynamic menu systems, create explicit mappings:

import { m } from "./paraglide/messages.js";

// With flat keys (recommended)
const navMessages = {
home: m.nav_home,
about: m.nav_about,
contact: m.nav_contact,
} as const;

// With nested keys (if needed)
const menuItems = [
{ key: "nav.home", href: "/" },
{ key: "nav.about", href: "/about" },
] as const;

menuItems.forEach(item => {
const label = m[item.key]();
console.log(`<a href="${item.href}">${label}</a>`);
});
Migration guide
If you're migrating from a library that uses nested keys:

Option 1: Keep dots in keys (minimal changes)
// messages/en.json
{

- "nav": {
- "home": "Home",
- "about": "About"
- }

* "nav.home": "Home",
* "nav.about": "About"
  }
  // Access with bracket notation
  const label = m["nav.home"]();
  Option 2: Flatten to underscores (recommended)
  // messages/en.json
  {

- "nav": {
- "home": "Home",
- "about": "About"
- }

* "nav_home": "Home",
* "nav_about": "About"
  }
  // Access as direct functions
  const label = m.nav_home();

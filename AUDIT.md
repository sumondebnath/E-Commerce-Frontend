# Project Audit — Senior Frontend Architect

Summary

- Performed architecture and code-quality audit and automated improvements across the frontend.

What I changed automatically

- Accessibility: improved `ConfirmDialog` (ARIA, focus, Escape handling), added skip-to-content, added `aria-label`s and `role` where appropriate.
- Button semantics: added explicit `type` attributes for common interactive controls and set default `type='button'` on `Button` component.
- Performance: route-level code-splitting (`React.lazy`), memoized `Table`, `ProductCard`, and `ProductGrid`; prefetch product details on hover; tuned React Query `staleTime` for lists/details.
- Images: added `loading="lazy"` and `decoding="async"` where applicable.
- Build: `vite.config.js` manualChunks vendor splitting added.
- Developer DX: added `jsconfig.json` for path aliasing.
- Lint/cleanup: fixed duplicate/unused imports and ran linter.

Recommendations (manual follow-up)

- Migrate to TypeScript for type safety and maintainability.
- Convert admin destructive actions to React Query `useMutation` with optimistic updates and Sonner toasts (I can implement this next).
- Add responsive `srcSet` images and LQIP generation for production images.
- Add keyboard focus trap for modal dialogs (consider `focus-trap-react`) for robust accessibility.
- Add unit and integration tests; add CI pipeline (GitHub Actions) with linting and build checks.
- Perform bundle analysis (`rollup-plugin-visualizer`) and tune chunking per route.

If you want, I will implement the next improvements automatically — tell me which to prioritize.

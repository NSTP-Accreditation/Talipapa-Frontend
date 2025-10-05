Guidelines page

This folder contains the code for the "Guidelines" pages used by the site.

Files/folders:
- `Guidelines.tsx` - main page component (renamed from App.tsx for clarity).
- `App.tsx` - original file kept for safety. Consider removing after testing.
- `MoreGuides.tsx` - secondary page with extended guides.
- `components/` - local shared components used by pages (e.g., UI primitives).
- `figma/` - legacy UI components adapted from a design system. These files are internal utilities and component variants. They can be renamed to `legacy-ui/` or consolidated into `components/ui/` in a future cleanup.

Next steps suggested:
1. Run the app and verify routes that reference `/guidelines` still work.
2. Search the codebase for any imports pointing to `App.tsx` and update them to `Guidelines.tsx`.
3. Migration status and safe approach
	- I created `src/pages/guidelines/components/ui/legacy/` which re-exports all modules from `figma/ui`. This provides a stable, central place to import legacy components from moving forward without changing existing code.
	- Recommended safe migration:
	  1. Search by symbol to find which `figma/ui` components are used in other parts of the app.
	  2. Move the actively used components into `src/components/ui/` (global) or `src/pages/guidelines/components/ui/` (local), update imports to the new path, and remove the re-export from `legacy`.
	  3. When all usages are migrated, delete `figma/` or rename it to `legacy-ui/`.
4. Remove `App.tsx` only after confirming there are no outstanding references.

If you'd like, I can: either (A) perform a safe migration by moving only files that are referenced elsewhere, updating imports and running checks; or (B) leave the folder as-is and provide a one-shot rename which you can review before merging. Tell me which you prefer.
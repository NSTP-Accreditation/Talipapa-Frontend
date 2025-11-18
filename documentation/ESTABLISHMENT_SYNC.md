# Establishment Records Sync Guide

This guide explains how the frontend keeps establishment records in sync with the backend counter (EstablishmentCounter.js).

## What already exists

- A backend counter (EstablishmentCounter.js) ensures each establishment has a sequential unique identifier.
- The frontend calls the API endpoint `/establishment` to list, create, edit and delete establishments.
- The backend returns a `record_id` or uses `_id` as fallback.

## What we implemented

- A compact `Sync` (refetch) button in `EstablishmentRecords` that re-fetches data from the backend and reports a success message when done.
  - The button is icon-only, placed between "Add Establishment" and "Export" in the header.
  - It shows a spinner while syncing to indicate progress, and is keyboard-focusable with `aria-label` and `title` attributes for accessibility.
- A `Next ID` computed on the frontend based on the highest `record_id` present — shown in the header and in the Add Establishment modal for reference.
  - This is best-effort: backend is authoritative and will assign record IDs. `Next ID` is an approximation computed from current `records`.
- Add: After creating a new establishment, the front end shows the returned `record_id` from the backend: `Establishment record created. ID: {record_id}`.
- Implemented `deleteByRecordId` and `openEditByRecordId` helpers which:
  - Locally find an establishment by `record_id`.
  - Then execute update/delete via the backend's `_id` (or `record_id` if backend supports it).

## Frontend API

- `GET /establishment` → Use `useFetchData('/establishment')` to list
- `POST /establishment` → Create and backend will return `record_id`. UI will show the assigned record id in success message.
- `PATCH /establishment/:id` → Update; the frontend uses `_id` for this.
- `DELETE /establishment/:id` → Delete; the frontend uses `_id` if available; if not, it falls back to `record_id`.

## Tips and Notes

- The Next ID displayed is a client-side convenience only. The backend counter is the source of truth.
- If you need to force an update or reassign the counter, use the backend counter admin functionality.
- For edit/delete by record ID programmatically, use the helper `openEditByRecordId(recordId)` or `deleteByRecordId(recordId)`.

## Implementation details

Files changed:

- `src/admin/pages/records/EstablishmentRecords.tsx` — added sync button, next id display, search filter, and helpers
- `src/admin/pages/records/components/DeleteEstablishmentModal.tsx` — shows `record_id` and tries fallback to `record_id` when `_id` is missing
- `src/utils/recordIdUtils.ts` — helper functions for extracting numeric sequences and generating the next record id

## Edge cases

- If `record_id` uses non-numeric sequences or mixed patterns, `Next ID` may return `null`.
- If `record_id` format changes (new prefix), the helper attempts to preserve prefix/suffix.

## Next steps

- Consider adding an admin-only endpoint to fetch the current `EstablishmentCounter` directly from the backend; this will make Next ID authoritative.
- Add a UX feature to highlight newly created record after sync.
- Optional: Support creating with a desired record id (if backend allows it via payload).

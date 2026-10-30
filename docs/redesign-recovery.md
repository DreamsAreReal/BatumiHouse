# Approved design release recovery

Before interface edits on 30 October 2026:

- Source and every checked-in photo: GitHub branch
  `backup/before-approved-redesign-2026-10-30`, commit
  `8e6c60803d1582233a40f85f7af4f62e3ee6f654`.
- Active Worker version: `69d788eb-3897-4e1f-9751-666601a8bb88`.
- Leads database recovery bookmark:
  `00000006-00000000-00005114-3e82b45d955770199fcd6ba2467f3d8a`.

Newer concurrent admin dashboard work was also retained before publication:
`backup/before-redesign-publish-2026-10-30`, commit
`f1c5cfeea4c98ee86aa3c83b6e437961defce641`.

Reverting the interface should restore source or the previous Worker version;
do not restore the database for a visual rollback, because newer enquiries must
be preserved. The bookmark is subject to Cloudflare's recovery retention window.
No schema migrations, D1 writes, secret changes or retention changes are part of
this release. `scripts/mobile-preview.py` is used only by the preview build;
the production build does not copy its QA page.

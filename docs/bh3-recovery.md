# Batumi House 3.0 recovery

Before interface changes:

- Complete source and original photos: branch
  `backup/batumi-house-before-3-20261030`, commit
  `8fa068b6fdc33ab450af54275ccbe5fba421adb2`.
- Full D1 schema/data export saved privately as
  `BatumiHouse-database-backup-before-3.zip`. SQL SHA256:
  `5737db74cc9ec2a17d0b540dc9574b0bb3205ddfeadacf515ace6cfd12ad5a48`.
  Export was verified by loading it into an in-memory SQLite database.
- Database export is never committed, copied into dist, or exposed publicly.

Rollback of a visual release should restore the old Worker version or old
source/build pipeline. Do not restore the database for a visual rollback: that
would overwrite enquiries received after the snapshot.

New production build command: `python3 scripts/build-v3.py`.
It builds all real apartment pages, copies existing assets, writes SEO resources
and excludes preview-only QA pages/noindex markers. Worker source, database and
Access/Telegram bindings remain unchanged. Deploy with `--keep-vars`.

The review build uses `python3 scripts/build-v3.py --preview` and Wrangler
`versions upload --keep-vars --preview-alias bh3-review`, never automatic live
deployment. User subsequently authorized direct publication in this task.

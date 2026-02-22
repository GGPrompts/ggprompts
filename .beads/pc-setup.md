# Beads Cross-Device Setup (PC)

Run these steps to get beads syncing properly between Termux and PC.

## 1. Pull latest main

```bash
git pull origin main
```

This brings in the updated `.beads/config.yaml` with `no-db: true` and `sync-branch: "beads-sync"` already enabled.

## 2. Set the merge driver (local git config)

Check if it's already set:

```bash
git config merge.beads.driver
```

If it outputs nothing, set it:

```bash
git config merge.beads.driver "bd merge %A %O %A %B"
```

This tells git to use `bd merge` for 3-way merges on `.beads/issues.jsonl` (the `.gitattributes` file already maps that path to the `beads` merge driver).

## 3. Verify config.yaml has these active (not commented)

In `.beads/config.yaml`:

```yaml
no-db: true
sync-branch: "beads-sync"
```

Both should already be uncommented after pulling. If they're still commented out, uncomment them.

## 4. Verify it works

```bash
bd list --limit 3
```

Should show issues. If you see a dolt/CGO error, that's fine as long as `no-db: true` is set — it bypasses the database entirely and reads straight from the JSONL.

## 5. Delete this file

```bash
rm .beads/pc-setup.md
```

Done. Both devices now use JSONL-only mode. Issues sync via normal git commits to main.

# Database Migrations

## Running migrations

```bash
# Run all pending migrations
php artisan migrate

# See the status of each migration
php artisan migrate:status
```

## Choosing the right reset command

These commands are destructive — use them carefully, especially in production.

| Command | What it does | Data loss? |
|---|---|---|
| `migrate:rollback` | Rolls back the **last batch** of migrations | Partial |
| `migrate:reset` | Rolls back **all** migrations | Yes |
| `migrate:refresh` | Rolls back all, then re-runs all (`reset` + `migrate`) | Yes |
| `migrate:fresh` | **Drops all tables**, then re-runs all migrations | Yes |

**Key distinction — `migrate:refresh` vs `migrate:fresh`:**
- `migrate:refresh` calls each migration's `down()` method in reverse order.
- `migrate:fresh` skips `down()` entirely and just drops every table directly. It is faster but bypasses any custom teardown logic. **Never run `migrate:fresh` in production.**

## Seeding after migration

Both `migrate:refresh` and `migrate:fresh` accept `--seed` to run seeders afterwards:

```bash
php artisan migrate:fresh --seed
php artisan migrate:refresh --seed
```

## Creating migrations

```bash
# Create a new table
php artisan make:migration create_posts_table --create=posts

# Add columns to an existing table
php artisan make:migration add_published_at_to_posts_table --table=posts
```

The migration filename includes a timestamp and is created in `database/migrations/`.

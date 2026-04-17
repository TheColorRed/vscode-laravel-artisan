# Queue Commands

## Starting a queue worker

Use a terminal-based command for long-running workers (they keep running until stopped):

```bash
# Process jobs from the default queue
php artisan queue:work

# Process jobs from a specific queue
php artisan queue:work --queue=emails

# Process jobs one at a time then exit (useful for cron-based workers)
php artisan queue:work --once
```

**`queue:work` vs `queue:listen`:**
- `queue:work` loads the application once and keeps it in memory — faster, but requires a restart when code changes.
- `queue:listen` re-boots the application for every job — slower, but always picks up code changes. Useful in development.

## Restarting workers after deployment

After deploying new code, workers must be restarted to pick up changes. This signals all running `queue:work` processes to gracefully restart after finishing their current job:

```bash
php artisan queue:restart
```

## Managing failed jobs

Jobs that fail after all retry attempts are stored in the `failed_jobs` table.

```bash
# List all failed jobs
php artisan queue:failed

# Retry a specific failed job by ID
php artisan queue:retry 5

# Retry all failed jobs
php artisan queue:retry all

# Retry all failed jobs in a batch
php artisan queue:retry-batch {batchId}

# Delete a specific failed job
php artisan queue:forget 5

# Delete all failed jobs
php artisan queue:flush
```

## Pausing and resuming queues

```bash
php artisan queue:pause
php artisan queue:pause emails

php artisan queue:resume
php artisan queue:resume emails
```

## Clearing a queue

Deletes all pending (not yet processed) jobs from a queue:

```bash
php artisan queue:clear
php artisan queue:clear emails
```

## Pruning old records

```bash
# Prune stale batch records
php artisan queue:prune-batches

# Prune old failed job records
php artisan queue:prune-failed
```

# Maintenance Mode

## Putting the application into maintenance mode

```bash
php artisan down
```

This returns a `503 Service Unavailable` response to all requests. The application is not usable by the public until `up` is run.

## Customising the maintenance response

```bash
# Show a custom message
php artisan down --message="Upgrading the database. Back in 5 minutes."

# Allow access via a secret bypass token (access via /your-secret in the browser)
php artisan down --secret="my-bypass-token"

# Redirect all requests to a specific URL instead of showing a 503
php artisan down --redirect=/maintenance
```

**The `--secret` option is the safest way to stay logged in during maintenance.** Navigate to `https://yourapp.com/my-bypass-token` in your browser and you will receive a cookie that bypasses the maintenance page.

## Bringing the application back online

```bash
php artisan up
```

## Important warnings

- **Never run `down` in production without a plan to run `up` afterwards.** If the process crashes before running `up`, the application stays in maintenance mode.
- The `--secret` token is stored in plain text in `storage/framework/down.php` — treat it like a password.
- Queue workers and scheduled tasks continue to run during maintenance mode unless you stop them separately.

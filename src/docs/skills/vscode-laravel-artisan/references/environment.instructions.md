# Environment Detection

When deciding how to run an Artisan command, always check `.vscode/settings.json` first.

## Docker

If `artisan.docker.enabled` is `true`, commands must be run through Docker:

```json
{
    "artisan.docker.enabled": true,
    "artisan.docker.command": "docker compose exec laravel"
}
```

Run commands by prefixing with the `artisan.docker.command` value and appending `php artisan`:

```bash
docker compose exec laravel php artisan make:model Post
```

## WSL

If `artisan.wsl.enabled` is `true`, commands run inside WSL:

```json
{
    "artisan.wsl.enabled": true
}
```

Run commands via WSL:

```bash
wsl php artisan make:model Post
```

## Custom PHP location

If `artisan.php.location` is set to a non-default path, use that binary instead of `php`:

```json
{
    "artisan.php.location": "/usr/local/bin/php8.3"
}
```

```bash
/usr/local/bin/php8.3 artisan make:model Post
```

## Priority order

Check settings in this order:
1. `artisan.docker.enabled` → use Docker command
2. `artisan.wsl.enabled` → prefix with `wsl`
3. `artisan.php.location` → use custom PHP binary
4. Nothing set → use `php artisan` directly

## Checking the artisan file location

If there are multiple `artisan` files in the workspace (monorepo), check `artisan.location` for the correct one:

```json
{
    "artisan.location": ["backend/artisan", "api/artisan"]
}
```

Always use the path that matches the project the user is currently working in.

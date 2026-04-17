---
name: vscode-laravel-artisan
description: Helps run Laravel Artisan commands via the vscode-laravel-artisan extension. Covers all artisan commands including make:* (models, controllers, migrations, jobs, etc.), migrate:*, queue:*, route:*, config:*, cache:*, event:*, key:*, view:*, schedule:*, storage:*, db:*, env:*, install:*, livewire:*, and top-level commands (down, up, tinker, optimize, serve). Handles Docker, WSL, and custom PHP environments. Use this skill whenever the user wants to run, scaffold, or manage anything via artisan in a Laravel project.
---

# VS Code Laravel Artisan

**ALWAYS** check the #tool:read/readFile [Environment Instructions](./references/environment.instructions.md) first to determine how commands should be run in the user's environment (Docker, WSL, custom PHP, etc.).

If you are unsure of what command to run, #tool:read/readFile [Find Command Instructions](./references/find-command.instructions.md) to help you find the right command and understand how to use it.

## Reference guides

- #tool:read/readFile [Run Commands Instructions](./references/run-commands.instructions.md) — How to run Artisan commands directly or via Docker/WSL.
- #tool:read/readFile [Make Files Instructions](./references/make-files.instructions.md) — All `make:*` commands, output locations, and useful flags.
- #tool:read/readFile [Migrations Instructions](./references/migrations.instructions.md) — When to use `migrate`, `migrate:fresh`, `migrate:refresh`, etc.
- #tool:read/readFile [Queue Instructions](./references/queue.instructions.md) — Queue workers, failed jobs, and queue management commands.
- #tool:read/readFile [Maintenance Instructions](./references/maintenance.instructions.md) — Using `down`/`up` and the `--secret` bypass token.
- #tool:read/readFile [Livewire Instructions](./references/livewire.instructions.md) — Livewire v3 commands and file locations.

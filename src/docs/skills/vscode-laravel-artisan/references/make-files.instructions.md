# Making Files with Artisan

## Basic make commands

Each `make:*` command creates a file in a specific location. Here is a summary:

| Command | Output location |
|---|---|
| `make:model Name` | `app/Models/Name.php` |
| `make:controller NameController` | `app/Http/Controllers/NameController.php` |
| `make:middleware Name` | `app/Http/Middleware/Name.php` |
| `make:request NameRequest` | `app/Http/Requests/NameRequest.php` |
| `make:resource NameResource` | `app/Http/Resources/NameResource.php` |
| `make:policy NamePolicy` | `app/Policies/NamePolicy.php` |
| `make:event Name` | `app/Events/Name.php` |
| `make:listener NameListener` | `app/Listeners/NameListener.php` |
| `make:job Name` | `app/Jobs/Name.php` |
| `make:job-middleware Name` | `app/Jobs/Middleware/Name.php` |
| `make:mail Name` | `app/Mail/Name.php` |
| `make:notification Name` | `app/Notifications/Name.php` |
| `make:observer NameObserver` | `app/Observers/NameObserver.php` |
| `make:provider NameServiceProvider` | `app/Providers/NameServiceProvider.php` |
| `make:command Name` | `app/Console/Commands/Name.php` |
| `make:channel Name` | `app/Broadcasting/Name.php` |
| `make:rule Name` | `app/Rules/Name.php` |
| `make:cast Name` | `app/Casts/Name.php` |
| `make:factory NameFactory` | `database/factories/NameFactory.php` |
| `make:seeder NameSeeder` | `database/seeders/NameSeeder.php` |
| `make:migration create_names_table` | `database/migrations/YYYY_MM_DD_HHMMSS_create_names_table.php` |
| `make:test NameTest` | `tests/Feature/NameTest.php` (or `tests/Unit/` with `--unit`) |
| `make:component Name` | `app/View/Components/Name.php` + `resources/views/components/name.blade.php` |
| `make:class Name` | `app/Name.php` |
| `make:interface Name` | `app/Name.php` |
| `make:trait Name` | `app/Name.php` |
| `make:enum Name` | `app/Enums/Name.php` |
| `make:scope Name` | `app/Models/Scopes/Name.php` |
| `make:exception Name` | `app/Exceptions/Name.php` |
| `make:config name` | `config/name.php` |
| `make:view name` | `resources/views/name.blade.php` (dots become `/`) |

## Useful flags for `make:model`

When creating a model you can generate related files at the same time:

```bash
# Create model with migration
php artisan make:model Post -m

# Create model with migration and factory
php artisan make:model Post -mf

# Create model with migration, factory and resource controller
php artisan make:model Post -mfc --resource

# Create model with everything (migration, factory, seeder, resource controller)
php artisan make:model Post -a
```

## Useful flags for `make:controller`

```bash
# Resource controller (index, create, store, show, edit, update, destroy)
php artisan make:controller PostController --resource

# API resource controller (no create/edit)
php artisan make:controller PostController --api

# Resource controller bound to a model
php artisan make:controller PostController --resource --model=Post
```

## Table migration shortcuts

These commands generate the migration file for the corresponding table:

```bash
php artisan make:cache-table
php artisan make:session-table
php artisan make:queue-table
php artisan make:queue-failed-table
php artisan make:queue-batches-table
php artisan make:notifications-table
```

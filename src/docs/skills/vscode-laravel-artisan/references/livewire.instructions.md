# Livewire Commands

## Creating components

```bash
# Creates a class + blade view
php artisan make:livewire ComponentName

# Nested component
php artisan make:livewire Forms/CreatePost
```

**Livewire v3 file locations:**
- Class: `app/Livewire/ComponentName.php`
- View: `resources/views/livewire/component-name.blade.php`

> In older Livewire v2 projects the class was at `app/Http/Livewire/` instead.

## Other make commands

```bash
# Create a Livewire form class
php artisan livewire:form SearchForm

# Create a Livewire attribute class
php artisan livewire:attribute MyAttribute
```

## Publishing and configuration

```bash
# Publish the Livewire config file to config/livewire.php
php artisan livewire:config

# Publish all Livewire config and assets
php artisan livewire:publish

# Publish stub files for customisation
php artisan livewire:stubs
```

**`livewire:config` vs `livewire:publish`:**
- `livewire:config` publishes only the config file.
- `livewire:publish` publishes config and all other publishable assets (views, etc.).

## Layout

```bash
# Create the default app layout file at resources/views/components/layouts/app.blade.php
php artisan livewire:layout
```

## Converting between single-file and multi-file format

```bash
# Convert an existing component between formats
php artisan livewire:convert ComponentName
```

## S3 temporary upload cleanup

```bash
# Configure S3 to auto-delete temporary upload files after 24 hours
php artisan livewire:configure-s3-upload-cleanup
```

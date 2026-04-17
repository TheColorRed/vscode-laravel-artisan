# Running Artisan Commands

## Running Artisan Commands Normally

Commands can be executed using the command `php artisan` followed by the desired Artisan command. For example, to run the `make:controller` command, you would use:

```bash
php artisan make:controller MyController
```

## Running Artisan Commands in Docker

Some users are running their application in a Docker container, we can usually find out if this is true by looking in the users `.vscode/settings.json` file for the `artisan.docker.command` setting. This provides the command to run using the #tool:execute/runInTerminal tool.

So, if we have the following setting in our `settings.json` file:

```json
{
    "artisan.docker.command": "docker compose exec container_name php artisan"
}
```

Then, based on that, we can run any Artisan command by appending it to the `artisan.docker.command` value. For example, to run the `make:model` command, we would use:

```bash
docker compose exec container_name php artisan make:model MyModel
```
# What command should I run?

If you don't know the exact Artisan command you want to run, you can use the `php artisan list` command to see a list of all available Artisan commands. This will help you find the command you need to execute. To get more information about a specific command, you can use the `php artisan some_command --help` command, replacing `some_command` with the name of the command you want to learn more about. This will provide you with details on how to use that command and what options are available.

This is a two step process if you don't know the command you want to run, but it is necessary to help you find the right command and understand how to use it. For example, if you want to create a new model but don't know the exact command, you can first run:

```bash
php artisan list
php artisan make:model --help

# BEGIN OUTPUT OF THE HELP COMMAND
# ...
# ...
# END OUTPUT OF THE HELP COMMAND

php artisan make:model MyModel
```
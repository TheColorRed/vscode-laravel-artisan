# Laravel Artisan

Run Laravel Artisan commands from within Visual Studio Code.

## Features

* Make files (Controllers, Migrations, Models, etc)
* Run Custom Commands
* Manage the database
* Clear Caches
* Generate Keys
* View all routes

### Get a list of routes

![Route List](./images/screens/route-list.gif)

### Make a controller

![Route List](./images/screens/make-controller.gif)

## Requirements

* A useable version of `php` that can be ran on the command line such as `php-cli` (This should be in your path)
    * The following command should yield a php version:
    * `php -v`
        * If no php version is returned you don't have php setup correctly.
        * If you get a version back you are good to go!
* A Laravel install that has `artisan` in the workspace root
    * cd into your root directory and run the following command:
    * `php artisan -v`
        * If an error is returned you don't have laravel setup correctly.
        * If you get a Laravel version and a list of commands you are good to go!

## Usage

Once you have installed the extension, it will become active once you open a workspace that has `artisan` within the root directory.
You can then open the command pallet, and start running the commands.
Just type `Artisan:` to get a list of commands.

Many commands have optional input questions, leave them blank to use the defaults, or enter your own value.

All commands are accessible through `Artisan: Run Command`, here you can access your custom commands as well as built in commands.
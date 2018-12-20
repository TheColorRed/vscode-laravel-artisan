# 0.0.24
- Added Docker support
  - Added setting `"artisan.docker.enabled": true` to enable/disable docker
  - Added setting `"artisan.docker.command": null` to execute the docker command, where `null` is replaced by the Docker command such as `"docker-compose exec app"`

# 0.0.23
- Replaced make controller resource question from `Yes/No` to option list: `Basic/Resource/API`.
  - If the controller is not a basic controller, the option to reference a model is asked.
    - If the use wants to reference a model a model name is asked for.
      - If the model doesn't exist, it is automatically created.

# 0.0.22
- Added support for a custom php location: `artisan.php.location`.
- Updated `artisan.location` setting.
  - Now only takes a string or an array of strings, which consist of artisan paths.
  - These are additional paths that are not found within the artisan workspace.
    - Example path: `/path/to/my/artisan-project/artisan`.
  - `number` was **removed** which specified a workspace number.
    - Artisan files in all workspaces are now automatically detected.

# 0.0.21
- Added `factory` and `all` to `make:model`.
- Added the ability to have multiple artisan projects.
  - Display a list of `artisan` files before running an `artisan` command if there is more than one `artisan` file in the workspace.

# 0.0.20
- Preserve the web views: `Route List`, `List Commands`, `Migrate Status` using the new WebView API.
  - This will allow for navigation away from, and then back to the tab without reloading the web view.
- `Route List` will automatically update when routes are added/removed/updated.
- When clicking on a `Route List` route, the document will open and the cursor will move to the line where the function is defined.

# 0.0.19
- Fixed issue where starting the server with values other than the default would still use the default values.

# 0.0.18
- Added command to run the artisan server with default values `Artisan: Start Server (Default Host and Port)`
- Fixed Windows issue where `cd` doesn't change directories if the project is on another dive letter `D:, E:`, etc.

# 0.0.17
- Changed exec so it changes to project root directory before running the artisan command
  - This will allow artisan to be executed from it's root directory
- Fix 'File Not Found' error when clicking a route action
  - This can be found under `Artisan: Route List`
- Moved server from child process to integrated terminal
- Removed duplicate `artisan.migrate.fresh` command

# 0.0.16
- Forgot to merge `0.0.14` into the push

# 0.0.15
- Added support for multi-root workspaces
  - To add a workspace add `artisan.location` to your settings file then use one of the following:
    - Use a `string` as a path to the workspace root (without `/artisan` filename)
    - Use a `number` pointing to the workspace array id (`0`, `1`, `2`, etc.)
- Added better parameter support for optional `Artisan: Run Command` options
  - TODO: Get laravel to support what parameters are optional. This currently isn't possible with the json string that is returned.
- Added `Artisan: Make Test` to create artisan tests
- Added `Artisan: Make Factory` to create factories

# 0.0.14
- Added the `make:resource` command
- Refresh the file explorer when a file is created

# 0.0.12 and 0.0.13
- vsce bug that doesn't rollback version on publishing error

# 0.0.11
- Added the ability to run custom commands
- Added the ability to run any commands
- Added `migrate:fresh` to create a fresh database
- Updated all `node_modules`

# 0.0.10
- Fixed issue where `artisan` was not found if there was a space in the path

# 0.0.9
- vsce bug that doesn't rollback version on publishing error

# 0.0.8
- Added `event:generate` to generate events

# 0.0.7
- Fixed an issue where `-r` does not exist when creating a resource controller
- Fixed strange headers on the `route:list` and `list` pages
- Added a search box to the `route:list` command and the `list` command
- Added the ability to open files from the `route:list` page

# 0.0.6
- Kill the php server when code is closed

# 0.0.5
- Fixed a typo in the `migrate` command from `micration` to `migration`
- Added the ability to stop the php server

# 0.0.4
- Added output to show the command that was executed
- Added output to show error messages

# 0.0.3
- Added routes display

# 0.0.2
- Made the input boxes more personable
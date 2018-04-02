# 0.0.17
- Changed exec so it changes directories before running the artisan command

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
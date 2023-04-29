'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, workspace } from 'vscode';
import Common from './Common';
import TextDocumentProvider from './TextDocumentProvider';
import ClearCompiled from './commands/base/ClearCompiled';
import List from './commands/base/List';
import Migrate from './commands/base/Migrate';
import Optimize from './commands/base/Optimize';
import Server from './commands/base/Serve';
import CacheClear from './commands/cache/Clear';
import CacheTable from './commands/cache/Table';
import ConfigCache from './commands/config/Cache';
import ConfigCacheClear from './commands/config/Clear';
import ConfigCacheRefresh from './commands/config/Refresh';
import EventGenerate from './commands/event/Generate';
import KeyGenerate from './commands/key/Generate';
import MakeAuth from './commands/make/Auth';
import MakeCast from './commands/make/Cast';
import MakeChannel from './commands/make/Channel';
import MakeCommand from './commands/make/Command';
import MakeComponent from './commands/make/Component';
import MakeController from './commands/make/Controller';
import MakeEvent from './commands/make/Event';
import MakeFactory from './commands/make/Factory';
import MakeJob from './commands/make/Job';
import MakeListener from './commands/make/Listener';
import MakeMail from './commands/make/Mail';
import MakeMiddleware from './commands/make/Middleware';
import MakeMigration from './commands/make/Migration';
import MakeModel from './commands/make/Model';
import MakeNotification from './commands/make/Notification';
import MakeObserver from './commands/make/Observer';
import MakePolicy from './commands/make/Policy';
import MakeProvider from './commands/make/Provider';
import MakeRequest from './commands/make/Request';
import MakeResource from './commands/make/Resource';
import MakeRule from './commands/make/Rule';
import MakeSeeder from './commands/make/Seeder';
import MakeTest from './commands/make/Test';
import MigrateFresh from './commands/migrate/Fresh';
import MigrateInstall from './commands/migrate/Install';
import MigrateRefresh from './commands/migrate/Refresh';
import MigrateReset from './commands/migrate/Reset';
import MigrateRollback from './commands/migrate/Rollback';
import MigrateStatus from './commands/migrate/Status';
import RouteCache from './commands/route/Cache';
import RouteCacheClear from './commands/route/Clear';
import RouteList from './commands/route/List';
import RouteCacheRefresh from './commands/route/Refresh';
import RunCommand from './commands/run/Command';
import ViewClear from './commands/view/Clear';

interface RegisterCommand {
  name: string;
  action: Common;
  method?: string;
  args?: any[];
}

export async function activate(context: ExtensionContext) {
  let files = await workspace.findFiles('**/artisan', undefined);
  files.forEach(file => Common.artisanFileList.push(file));

  const registeredCommands: RegisterCommand[] = [
    { name: 'artisan.clearCompiled', action: ClearCompiled },
    { name: 'artisan.migrate', action: Migrate },
    { name: 'artisan.optimize', action: Optimize },
    { name: 'artisan.startServer', action: Server },
    { name: 'artisan.startServerUseDefaults', action: Server, method: 'run', args: [true] },
    { name: 'artisan.stopServer', action: Server, method: 'stop' },
    { name: 'artisan.restartServer', action: Server, method: 'restart' },
    { name: 'artisan.list', action: List },
    { name: 'artisan.make.auth', action: MakeAuth },
    { name: 'artisan.make.cast', action: MakeCast },
    { name: 'artisan.make.channel', action: MakeChannel },
    { name: 'artisan.make.command', action: MakeCommand },
    { name: 'artisan.make.controller', action: MakeController },
    { name: 'artisan.make.component', action: MakeComponent },
    { name: 'artisan.make.factory', action: MakeFactory },
    { name: 'artisan.make.event', action: MakeEvent },
    { name: 'artisan.make.listener', action: MakeListener },
    { name: 'artisan.make.mail', action: MakeMail },
    { name: 'artisan.make.job', action: MakeJob },
    { name: 'artisan.make.middleware', action: MakeMiddleware },
    { name: 'artisan.make.model', action: MakeModel },
    { name: 'artisan.make.migration', action: MakeMigration },
    { name: 'artisan.make.notification', action: MakeNotification },
    { name: 'artisan.make.observer', action: MakeObserver },
    { name: 'artisan.make.policy', action: MakePolicy },
    { name: 'artisan.make.provider', action: MakeProvider },
    { name: 'artisan.make.request', action: MakeRequest },
    { name: 'artisan.make.resource', action: MakeResource },
    { name: 'artisan.make.rule', action: MakeRule },
    { name: 'artisan.make.seeder', action: MakeSeeder },
    { name: 'artisan.make.test', action: MakeTest },
    { name: 'artisan.migrate.install', action: MigrateInstall },
    { name: 'artisan.migrate.refresh', action: MigrateRefresh },
    { name: 'artisan.migrate.reset', action: MigrateReset },
    { name: 'artisan.migrate.rollback', action: MigrateRollback },
    { name: 'artisan.migrate.status', action: MigrateStatus },
    { name: 'artisan.migrate.fresh', action: MigrateFresh },
    { name: 'artisan.cache.clear', action: CacheClear },
    { name: 'artisan.cache.table', action: CacheTable },
    { name: 'artisan.route.cache', action: RouteCache },
    { name: 'artisan.route.clear', action: RouteCacheClear },
    { name: 'artisan.route.refresh', action: RouteCacheRefresh },
    { name: 'artisan.route.list', action: RouteList },
    { name: 'artisan.config.cache', action: ConfigCache },
    { name: 'artisan.config.clear', action: ConfigCacheClear },
    { name: 'artisan.config.refresh', action: ConfigCacheRefresh },
    { name: 'artisan.key.generate', action: KeyGenerate },
    { name: 'artisan.event.generate', action: EventGenerate },
    { name: 'artisan.view.clear', action: ViewClear },
    { name: 'artisan.run.command', action: RunCommand },
  ];

  registeredCommands.forEach((command: RegisterCommand) => {
    const cmd = commands.registerCommand(command.name, async () => {
      // Setup the call
      const method = command.method ?? 'run';
      const args = command.args ?? [];

      // Run the command
      await command.action[method](...args);

      // Cleanup
      // command.action.dispose?.();
    });

    // Register the command
    context.subscriptions.push(cmd);
  });

  // Base commands
  // context.subscriptions.push(commands.registerCommand('artisan.clearCompiled', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.migrate', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.optimize', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.startServer', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.startServerUseDefaults', () => { Server.run(true) }))
  // context.subscriptions.push(commands.registerCommand('artisan.stopServer', () => { Server.stop() }))
  // context.subscriptions.push(commands.registerCommand('artisan.restartServer', () => { Server.restart() }))
  // context.subscriptions.push(commands.registerCommand('artisan.list', () => {  }))

  // // Make commands
  // context.subscriptions.push(commands.registerCommand('artisan.make.auth', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.cast', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.channel', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.command', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.controller', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.component', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.factory', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.event', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.listener', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.mail', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.job', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.middleware', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.model', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.migration', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.notification', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.observer', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.policy', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.provider', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.request', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.resource', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.rule', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.seeder', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.make.test', () => {  }))

  // // Migrate commands
  // context.subscriptions.push(commands.registerCommand('artisan.migrate.install', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.migrate.refresh', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.migrate.reset', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.migrate.rollback', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.migrate.status', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.migrate.fresh', () => {  }))

  // // Cache commands
  // context.subscriptions.push(commands.registerCommand('artisan.cache.clear', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.cache.table', () => {  }))

  // // Route commands
  // context.subscriptions.push(commands.registerCommand('artisan.route.cache', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.route.clear', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.route.refresh', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.route.list', () => {  }))

  // // Config commands
  // context.subscriptions.push(commands.registerCommand('artisan.config.cache', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.config.clear', () => {  }))
  // context.subscriptions.push(commands.registerCommand('artisan.config.refresh', () => {  }))

  // // Key commands
  // context.subscriptions.push(commands.registerCommand('artisan.key.generate', () => {  }))

  // // Event commands
  // context.subscriptions.push(commands.registerCommand('artisan.event.generate', () => {  }))

  // // View commands
  // context.subscriptions.push(commands.registerCommand('artisan.view.clear', () => {  }))

  // // All commands
  // context.subscriptions.push(commands.registerCommand('artisan.run.command', () => {  }))

  // Register document provider for virtual files
  context.subscriptions.push(workspace.registerTextDocumentContentProvider('laravel-artisan', new TextDocumentProvider()));

  console.log('Laravel Artisan: activated');
}

export function deactivate() {
  console.log('Laravel Artisan: deactivated');
  Server.stop();
}

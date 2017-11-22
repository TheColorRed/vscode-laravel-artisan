'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, workspace } from 'vscode';
import TextDocumentProvider from './TextDocumentProvider';

// Base files
import ClearCompiled from './commands/base/ClearCompiled';
import Migrate from './commands/base/Migrate';
import Optimize from './commands/base/Optimize';
import Server from './commands/base/Serve';
import List from './commands/base/List';

// Make files
import MakeCommand from './commands/make/Command';
import MakeController from './commands/make/Controller';
import MakeEvent from './commands/make/Event';
import MakeJob from './commands/make/Job';
import MakeListener from './commands/make/Listener';
import MakeMail from './commands/make/Mail';
import MakeMiddleware from './commands/make/Middleware';
import MakeModel from './commands/make/Model';
import MakeMigration from './commands/make/Migration';
import MakeNotification from './commands/make/Notification';
import MakePolicy from './commands/make/Policy';
import MakeProvider from './commands/make/Provider';
import MakeRequest from './commands/make/Request';
import MakeSeeder from './commands/make/Seeder';

// Migrate files
import MigrateInstall from './commands/migrate/Install';
import MigrateRefresh from './commands/migrate/Refresh';
import MigrateReset from './commands/migrate/Reset';
import MigrateRollback from './commands/migrate/Rollback';
import MigrateStatus from './commands/migrate/Status';

// Cache files
import CacheClear from './commands/cache/Clear';
import CacheTable from './commands/cache/Table';

// Route files
import RouteCache from './commands/route/Cache';
import RouteCacheClear from './commands/route/Clear';
import RouteCacheRefresh from './commands/route/Refresh';
import RouteList from './commands/route/List';

// Cache files
import ConfigCache from './commands/config/Cache';
import ConfigCacheClear from './commands/config/Clear';
import ConfigCacheRefresh from './commands/config/Refresh';

// Key files
import KeyGenerate from './commands/key/Generate';

// Event files
import EventGenerate from './commands/event/Generate';

// View files
import ViewClear from './commands/view/Clear';

import RunCommand from './commands/run/Command';

export function activate(context: ExtensionContext) {

    // Base commands
    context.subscriptions.push(commands.registerCommand('artisan.clearCompiled', () => { ClearCompiled.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.migrate', () => { Migrate.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.optimize', () => { Optimize.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.startServer', () => { Server.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.stopServer', () => { Server.stop(); }));
    context.subscriptions.push(commands.registerCommand('artisan.list', () => { List.run(); }));

    // Make commands
    context.subscriptions.push(commands.registerCommand('artisan.make.command', () => { MakeCommand.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.controller', () => { MakeController.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.event', () => { MakeEvent.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.listener', () => { MakeListener.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.mail', () => { MakeMail.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.job', () => { MakeJob.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.middleware', () => { MakeMiddleware.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.model', () => { MakeModel.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.migration', () => { MakeMigration.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.notification', () => { MakeNotification.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.policy', () => { MakePolicy.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.provider', () => { MakeProvider.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.request', () => { MakeRequest.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.make.seeder', () => { MakeSeeder.run(); }));

    // Migrate commands
    context.subscriptions.push(commands.registerCommand('artisan.migrate.install', () => { MigrateInstall.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.migrate.refresh', () => { MigrateRefresh.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.migrate.reset', () => { MigrateReset.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.migrate.rollback', () => { MigrateRollback.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.migrate.status', () => { MigrateStatus.run(); }));

    // Cache commands
    context.subscriptions.push(commands.registerCommand('artisan.cache.clear', () => { CacheClear.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.cache.table', () => { CacheTable.run(); }));

    // Route commands
    context.subscriptions.push(commands.registerCommand('artisan.route.cache', () => { RouteCache.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.route.clear', () => { RouteCacheClear.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.route.refresh', () => { RouteCacheRefresh.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.route.list', () => { RouteList.run(); }));

    // Config commands
    context.subscriptions.push(commands.registerCommand('artisan.config.cache', () => { ConfigCache.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.config.clear', () => { ConfigCacheClear.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.config.refresh', () => { ConfigCacheRefresh.run(); }));

    // Key commands
    context.subscriptions.push(commands.registerCommand('artisan.key.generate', () => { KeyGenerate.run(); }));

    // Event commands
    context.subscriptions.push(commands.registerCommand('artisan.event.generate', () => { EventGenerate.run(); }));

    // View commands
    context.subscriptions.push(commands.registerCommand('artisan.view.clear', () => { ViewClear.run(); }));

    context.subscriptions.push(workspace.registerTextDocumentContentProvider('laravel-artisan', new TextDocumentProvider()));


    context.subscriptions.push(commands.registerCommand('artisan.run.command', () => { RunCommand.run(); }));
}

export function deactivate() {
    Server.stop();
}
'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, workspace } from 'vscode';
import TextDocumentProvider from './TextDocumentProvider';

// Base files
import ClearCompiled from './base/ClearCompiled';
import Migrate from './base/Migrate';
import Optimize from './base/Optimize';
import Serve from './base/Serve';
import List from './base/List';

// Make files
import MakeCommand from './make/Command';
import MakeController from './make/Controller';
import MakeEvent from './make/Event';
import MakeJob from './make/Job';
import MakeListener from './make/Listener';
import MakeMail from './make/Mail';
import MakeMiddleware from './make/Middleware';
import MakeModel from './make/Model';
import MakeMigration from './make/Migration';
import MakeNotification from './make/Notification';
import MakePolicy from './make/Policy';
import MakeProvider from './make/Provider';
import MakeRequest from './make/Request';
import MakeSeeder from './make/Seeder';

// Migrate files
import MigrateInstall from './migrate/Install';
import MigrateRefresh from './migrate/Refresh';
import MigrateReset from './migrate/Reset';
import MigrateRollback from './migrate/Rollback';
import MigrateStatus from './migrate/Status';

// Cache files
import CacheClear from './cache/Clear';
import CacheTable from './cache/Table';

// Route files
import RouteCache from './route/Cache';
import RouteCacheClear from './route/Clear';
import RouteCacheRefresh from './route/Refresh';
import RouteList from './route/List';

// Cache files
import ConfigCache from './config/Cache';
import ConfigCacheClear from './config/Clear';
import ConfigCacheRefresh from './config/Refresh';

// Key files
import KeyGenerate from './key/Generate';

// View files
import ViewClear from './view/Clear';


export function activate(context: ExtensionContext) {

    // Base commands
    context.subscriptions.push(commands.registerCommand('artisan.clearCompiled', () => { ClearCompiled.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.migrate', () => { Migrate.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.optimize', () => { Optimize.run(); }));
    context.subscriptions.push(commands.registerCommand('artisan.serve', () => { Serve.run(); }));
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

    // View commands
    context.subscriptions.push(commands.registerCommand('artisan.view.clear', () => { ViewClear.run(); }));

    context.subscriptions.push(workspace.registerTextDocumentContentProvider('laravel-artisan', new TextDocumentProvider()))
}

export function deactivate() { }
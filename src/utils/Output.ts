import { window, OutputChannel } from 'vscode';

const outputConsole = window.createOutputChannel('Laravel Artisan');

export default class Output {

    public static info(message: string) {
        outputConsole.appendLine(`[INFO] ${message}`);
    }

    public static command(message: string) {
        outputConsole.appendLine(`[CMD] ${message}`);
    }

    public static error(message: string) {
        outputConsole.appendLine(`[ERROR] ${message}`);
    }

    public static warning(message: string) {
        outputConsole.appendLine(`[WARN] ${message}`);
    }
}
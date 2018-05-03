import { window, workspace, Terminal } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class Server extends Common {

    // public static child: cp.ChildProcess;
    private static terminal: Terminal
    private static host: string;
    private static port: string;

    public static async run(useDefaults = false) {

        let host = useDefaults ? '' : await this.getInput('Should I use a specific host (Default: localhost)?');
        let port = useDefaults ? '' : await this.getInput('Should I use a specific port (Default: 8000)?');

        this.host = host.length > 0 ? host : 'localhost';
        this.port = port.length > 0 ? port : '8000';

        let command = `serve ${'--host=' + this.host} ${'--port=' + this.port}`;

        this.terminal = window.createTerminal('Laravel Artisan Server');
        this.terminal.show();
        this.terminal.sendText(`php "${this.artisan}" serve ${'--host=' + this.host} ${'--port=' + this.port}`);
        this.showMessage(`The server is now running on "http://${Server.host}:${Server.port}"`);
    }

    public static async stop() {
        if (Server.terminal) {
            this.terminal.dispose();
            this.showMessage(`The server has been stopped on "http://${Server.host}:${Server.port}"`);
        } else {
            this.showError('There is no server currently running');
        }
    }
}
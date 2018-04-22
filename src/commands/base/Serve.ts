import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class Server extends Common {

    public static child: cp.ChildProcess;
    private static host: string;
    private static port: string;

    public static async run(useDefaults = false) {

        let host = useDefaults ? '' : await this.getInput('Should I use a specific host (Default: localhost)?');
        let port = useDefaults ? '' : await this.getInput('Should I use a specific port (Default: 8000)?');

        let command = `php "${this.artisan}" serve ${host.length > 0 ? '--host=' + host : ''} ${port.length > 0 ? '--port=' + port : ''}`;
        Output.command(command);

        Server.child = cp.spawn('php', [this.artisan, 'serve'], { detached: true });

        Server.child.stdout.on('data', data => {
            Output.info(data.toString());
            Server.host = host.length > 0 ? host : 'localhost';
            Server.port = port.length > 0 ? port : '8000';
            this.showMessage(`The server is now running on http://${Server.host}:${Server.port}`);
        });
    }

    public static async stop() {
        if (Server.child) {
            process.kill(-Server.child.pid);
            Server.child = null;
            this.showMessage(`The server has been stopped on http://${Server.host}:${Server.port}`);
        } else {
            this.showError('There is no server currently running');
        }
    }
}
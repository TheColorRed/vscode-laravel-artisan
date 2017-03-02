import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class Serve extends Common {

    public static async run() {

        let host = await this.getInput('Should I use a specific host (Default: localhost)?');
        let port = await this.getInput('Should I use a specific port (Default: 8000)?');

        let command = `php ${this.artisan} serve ${host.length > 0 ? '--host=' + host : ''} ${port.length > 0 ? '--port=' + port : ''}`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('The server could not be started', err);
            } else {
                this.showMessage('The server is now running on http://localhost:8000');
            }
        });
    }
}
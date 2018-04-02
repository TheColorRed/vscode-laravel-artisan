import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class RouteCache extends Common {

    public static async run() {
        let command = `php artisan route:cache`;
        Output.command(command);
        cp.exec(`cd "${this.artisanRoot}" && ${command}`, async (err, stdout, stderr) => {
            if (err) {
                Output.error(stdout)
                return this.showError('The route cache could not be created', err);
            } else {
                return this.showMessage('The route was cached');
            }
        });
    }
}
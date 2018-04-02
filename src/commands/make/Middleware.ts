import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeMiddleware extends Common {

    public static async run() {
        // Get the name of the controller to create
        let middleName = await this.getInput('Middleware Name');
        if (middleName.length == 0) {
            this.showError('A middleware name is required');
            return;
        }

        let command = `php artisan make:middleware ${middleName}`;
        Output.command(command);

        // Generate the controller
        cp.exec(`cd "${this.artisanRoot}" && ${command}`, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the middleware', err);
            } else {
                await this.openFile('/app/Http/Middleware/' + middleName + '.php');
            }
        });
    }
}
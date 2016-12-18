import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeMiddleware extends Common {

    public static async run() {
        // Get the name of the controller to create
        let middleName = await this.getInput('Middleware Name');
        if (middleName.length == 0) {
            this.showError('A middleware name is required');
            return;
        }

        // Generate the controller
        cp.exec(`php ${this.artisan} make:middleware ${middleName}`, async (err) => {
            if (err) {
                this.showError('Could not create the middleware', err);
            } else {
                await this.openFile('/app/Http/Middleware/' + middleName + '.php');
            }
        });
    }
}
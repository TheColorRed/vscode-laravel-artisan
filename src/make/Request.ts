import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeRequest extends Common {

    public static async run() {

        let requestName = await this.getInput('Request Name');
        if (requestName.length == 0) {
            this.showError('A request name is required')
            return;
        }

        cp.exec(`php ${this.artisan} make:request ${requestName}`, async (err) => {
            if (err) {
                this.showError('Could not create the request', err);
            } else {
                await this.openFile('/app/Http/Requests/' + requestName + '.php');
            }
        });
    }
}
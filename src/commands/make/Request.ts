import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeRequest extends Common {

    public static async run() {

        let requestName = await this.getInput('Request Name');
        if (requestName.length == 0) {
            this.showError('A request name is required')
            return;
        }

        let command = `php artisan make:request ${requestName}`;
        Output.command(command);

        this.execCmd(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the request', err);
            } else {
                await this.openFile('/app/Http/Requests/' + requestName + '.php');
            }
        });
    }
}
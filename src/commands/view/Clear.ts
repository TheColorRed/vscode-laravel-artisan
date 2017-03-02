import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class ViewClear extends Common {

    public static async run() {
        let command = `php ${this.artisan} view:clear`;
        Output.command(command);
        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('The views could not be cleared', err);
            } else {
                this.showMessage('The views were cleared');
            }
        });
    }
}
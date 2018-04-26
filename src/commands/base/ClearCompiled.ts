import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class ClearCompiled extends Common {

    public static async run() {
        let command = `php artisan clear-compiled`;
        Output.command(command);
        // Generate the controller
        this.execCmd(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('Compilation was not cleared', err);
            } else {
                this.showMessage('Compilation cleared');
            }
        });
    }
}
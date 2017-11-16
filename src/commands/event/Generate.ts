import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class EventGenerate extends Common {

    public static async run() {

        let command = `php "${this.artisan}" event:generate`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('Events could not be generated', err);
            } else {
                this.showMessage('Events generated');
            }
        });
    }
}
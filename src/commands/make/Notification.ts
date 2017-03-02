import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeNotification extends Common {

    public static async run() {

        let noteName = await this.getInput('Notification Name');
        if (noteName.length == 0) {
            this.showError('A notification name is required')
            return;
        }

        let command = `php ${this.artisan} make:notification ${noteName}`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the notification', err);
            } else {
                await this.openFile('/app/Notifications/' + noteName + '.php');
            }
        });
    }
}
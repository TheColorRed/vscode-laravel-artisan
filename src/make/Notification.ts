import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeNotification extends Common {

    public static async run() {

        let noteName = await this.getInput('Notification Name');
        if (noteName.length == 0) {
            this.showError('A notification name is required')
            return;
        }

        cp.exec(`php ${this.artisan} make:notification ${noteName}`, async (err) => {
            if (err) {
                this.showError('Could not create the notification', err);
            } else {
                await this.openFile('/app/Notifications/' + noteName + '.php');
            }
        });
    }
}
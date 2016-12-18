import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeMail extends Common {

    public static async run() {

        let listenerName = await this.getInput('Mail Name');
        if (listenerName.length == 0) {
            this.showError('A mail name is required')
            return;
        }

        cp.exec(`php ${this.artisan} make:mail ${listenerName}`, async (err) => {
            if (err) {
                this.showError('Could not create the mailler', err);
            } else {
                await this.openFile('/app/Mail/' + listenerName + '.php');
            }
        });
    }
}
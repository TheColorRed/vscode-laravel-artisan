import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeEvent extends Common {

    public static async run() {

        let evtName = await this.getInput('Event Name');
        if (evtName.length == 0) {
            this.showError('An event name is required')
            return;
        }

        cp.exec(`php ${this.artisan} make:event ${evtName}`, async (err) => {
            if (err) {
                this.showError('Could not create the event', err);
            } else {
                await this.openFile('/app/Events/' + evtName + '.php');
            }
        });
    }
}
import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeListener extends Common {

    public static async run() {

        let listenerName = await this.getInput('Listener Name');
        if (listenerName.length == 0) {
            this.showError('A listener name is required')
            return;
        }

        let event = await this.getInput('The event class to listen for');

        let queued = await this.getYesNo('Should the listener be queued?');

        cp.exec(`php ${this.artisan} make:listener ${listenerName} ${event.length > 0 ? '--event=' + event : ''} ${queued ? '--queued' : ''}`, async (err) => {
            if (err) {
                this.showError('Could not create the listener', err);
            } else {
                await this.openFile('/app/Listeners/' + listenerName + '.php');
            }
        });
    }
}
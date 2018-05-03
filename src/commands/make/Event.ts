import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeEvent extends Common {

    public static async run() {

        let evtName = await this.getInput('Event Name');
        if (evtName.length == 0) {
            this.showError('An event name is required')
            return;
        }
        let command = `make:event ${evtName}`;

        this.execCmd(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the event', err);
            } else {
                await this.openFile('/app/Events/' + evtName + '.php');
            }
        });
    }
}
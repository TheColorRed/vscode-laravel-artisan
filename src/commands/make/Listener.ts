import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeListener extends Common {

    public static async run() {

        let listenerName = await this.getInput('Listener Name');
        if (listenerName.length == 0) {
            this.showError('A listener name is required')
            return;
        }

        let event = await this.getInput('What event class should I listen for?');
        let queued = await this.getYesNo('Should I make the listener queued?');

        let command = `php artisan make:listener ${listenerName} ${event.length > 0 ? '--event=' + event : ''} ${queued ? '--queued' : ''}`;
        Output.command(command);

        cp.exec(`cd "${this.artisanRoot}" && ${command}`, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the listener', err);
            } else {
                await this.openFile('/app/Listeners/' + listenerName + '.php');
            }
        });
    }
}
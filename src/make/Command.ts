import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeController extends Common {

    public static async run() {

        let cmdName = await this.getInput('Command Name');
        if (cmdName.length == 0) {
            this.showError('A command name is required')
            return;
        }

        let consoleName = await this.getInput('The terminal command name (Default is "command:name")');

        cp.exec(`php ${this.artisan} make:command ${cmdName} ${consoleName.length > 0 ? '--command=' + consoleName : ''}`, async (err) => {
            if (err) {
                this.showError('Could not create the command', err);
            } else {
                await this.openFile('/app/Console/Commands/' + cmdName + '.php');
            }
        });
    }
}
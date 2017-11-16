import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeMail extends Common {

    public static async run() {

        let mailName = await this.getInput('Mail Name');
        if (mailName.length == 0) {
            this.showError('A mail name is required')
            return;
        }

        let command = `php "${this.artisan}" make:mail ${mailName}`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the mailler', err);
            } else {
                await this.openFile('/app/Mail/' + mailName + '.php');
            }
        });
    }
}
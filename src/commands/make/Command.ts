import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeCommand extends Common {

    public static async run() {
        let cmdName = await this.getInput('Command Class Name');
        if (cmdName.length == 0) {
            this.showError('A command name is required')
            return;
        }

        let consoleName = await this.getInput('What is the terminal command name? (Default is "command:name")');
        let command = `php "${this.artisan}" make:command ${cmdName} ${consoleName.length > 0 ? '--command=' + consoleName : ''}`;
        Output.command(command);
        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the command', err);
            } else {
                await this.openFile('/app/Console/Commands/' + cmdName + '.php');
            }
        });
    }
}
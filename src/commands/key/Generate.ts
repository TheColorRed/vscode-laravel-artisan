import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class KeyGenerate extends Common {

    public static async run() {

        let update = await this.getYesNo('Should I update the env file?');

        let command = `php "${this.artisan}" key:generate ${!update ? '--show' : ''}`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('The key could not be generated', err);
            } else {
                let key = stdout.match(/base64:([^\] \b]*)/ig)[0] || '';
                if (update && key.length > 0) {
                    this.showMessage('The key was generated (' + key + ')');
                } else if (!update && key.length > 0) {
                    this.showMessage('Here is a key: (' + key + ')');
                } else {
                    this.showError('A key was not generated');
                }
            }
        });
    }
}
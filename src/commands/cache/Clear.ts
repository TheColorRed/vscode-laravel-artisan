import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class CacheClear extends Common {

    public static async run() {

        let store = await this.getInput('Store name (Leave blank to clear everything)');
        let tags = await this.getInput('Should I clear specific tags?');

        let command = `php "${this.artisan}" cache:clear ${store} ${tags.length > 0 ? '--tags=' + tags : ''}`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('The cache could not be cleared', err);
            } else {
                this.showMessage('The was cleared');
            }
        });
    }
}
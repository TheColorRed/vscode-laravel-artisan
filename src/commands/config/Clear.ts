import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class ConfigCacheClear extends Common {

    public static async run() {
        let command = `php "${this.artisan}" config:clear`
        cp.exec(command, async (err) => {
            if (err) {
                return this.showError('The config cache could not be cleared', err);
            } else {
                return this.showMessage('The config cache was cleared');
            }
        });
    }
}
import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class ConfigCache extends Common {

    public static async run() {
        cp.exec(`php ${this.artisan} config:cache`, async (err, stdout, stderr) => {
            if (err) {
                console.log(stderr)
                return this.showError('The config cache could not be created', err);
            } else {
                return this.showMessage('The config was cached');
            }
        });
    }
}
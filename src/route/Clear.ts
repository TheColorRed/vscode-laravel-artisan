import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class RouteCacheClear extends Common {

    public static async run() {
        cp.exec(`php ${this.artisan} route:clear`, async (err) => {
            if (err) {
                return this.showError('The route cache could not be cleared', err);
            } else {
                return this.showMessage('The route cache was cleared');
            }
        });
    }
}
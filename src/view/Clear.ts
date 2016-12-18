import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class ViewClear extends Common {

    public static async run() {

        cp.exec(`php ${this.artisan} view:clear`, async (err) => {
            if (err) {
                this.showError('The views could not be cleared', err);
            } else {
                this.showMessage('The views were cleared');
            }
        });
    }
}
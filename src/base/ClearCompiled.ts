import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class ClearCompiled extends Common {

    public static async run() {
        // Generate the controller
        cp.exec(`php ${this.artisan} clear-compiled`, async (err) => {
            if (err) {
                this.showError('Compilation was not cleared', err);
            } else {
                this.showMessage('Compilation cleared');
            }
        });
    }
}
import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class Serve extends Common {

    public static async run() {
        cp.exec(`php ${this.artisan} serve`, async (err) => {
            if (err) {
                this.showError('The server could not be started', err);
            } else {
                this.showMessage('The server is now running on http://localhost:8000');
            }
        });
    }
}
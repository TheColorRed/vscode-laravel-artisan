import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class Optimize extends Common {

    public static async run() {
        cp.exec(`php ${this.artisan} optimize`, async (err) => {
            if (err) {
                this.showError('Optimization failed', err);
            } else {
                this.showMessage('The framework was optimized');
            }
        });
    }
}
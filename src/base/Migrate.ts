import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class Migrate extends Common {

    public static async run() {

        let seed = await this.getYesNo('Should I seed the database for you?');

        cp.exec(`php ${this.artisan} migrate ${seed ? '--seed' : ''}`, async (err) => {
            if (err) {
                this.showError('The migration failed', err);
            } else {
                this.showMessage('The micration has completed');
            }
        });
    }
}
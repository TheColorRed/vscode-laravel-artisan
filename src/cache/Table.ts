import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class CacheTable extends Common {

    public static async run() {
        cp.exec(`php ${this.artisan} cache:table`, async (err) => {
            if (err) {
                this.showError('A migration table could not be created for the cache database table', err);
            } else {
                this.showMessage('A migration table was created for the cache database table');
            }
        });
    }
}
import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MigrateRollback extends Common {

    public static async run() {

        let database = await this.getInput('What database should I use?');

        cp.exec(`php ${this.artisan} migrate:rollback ${database.length > 0 ? '--database=' + database : ''}`, async (err) => {
            if (err) {
                this.showError('The database could not be rolled back', err);
            } else {
                this.showMessage('The database has been rolled back');
            }
        });
    }
}
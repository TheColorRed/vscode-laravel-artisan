import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MigrateReset extends Common {

    public static async run() {

        let database = await this.getInput('Database to use (Leave blank to use the default database)');

        cp.exec(`php ${this.artisan} migrate:reset ${database.length > 0 ? '--database=' + database : ''}`, async (err) => {
            if (err) {
                this.showError('The database could not be reset', err);
            } else {
                this.showMessage('The database has been reset');
            }
        });
    }
}
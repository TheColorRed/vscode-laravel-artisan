import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MigrateRefresh extends Common {

    public static async run() {

        let database = await this.getInput('Database to use (Leave blank to use the default database)');

        let seed = await this.getYesNo('Should the database be seeded?');

        cp.exec(`php ${this.artisan} migrate:refresh ${database.length > 0 ? '--database=' + database : ''} ${seed ? '--seed' : ''}`, async (err) => {
            if (err) {
                this.showError('The database could not be refreshed', err);
            } else {
                this.showMessage('The database has been refreshed');
            }
        });
    }
}
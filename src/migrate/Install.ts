import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MigrateInstall extends Common {

    public static async run() {

        let database = await this.getInput('Database to use (Leave blank to use the default database)');

        cp.exec(`php ${this.artisan} migrate:install ${database.length > 0 ? '--database=' + database : ''}`, async (err) => {
            if (err) {
                this.showError('The migration repository was not installed', err);
            } else {
                this.showMessage('The migration repository was installed');
            }
        });
    }
}
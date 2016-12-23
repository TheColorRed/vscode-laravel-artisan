import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MigrateStatus extends Common {

    public static async run() {

        let database = await this.getInput('What database should I use?');

        cp.exec(`php ${this.artisan} migrate:status ${database.length > 0 ? '--database=' + database : ''}`, async (err, stdout) => {
            if (err) {
                this.showError('Could not get the status of the migrations', err);
            } else {
                let data = this.parseCliTable(stdout);
                this.openVirtualHtmlFile('migrate-status', data.headers, data.rows);
            }
        });
    }
}
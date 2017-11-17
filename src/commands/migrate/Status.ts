import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MigrateStatus extends Common {

    public static async run() {

        let database = await this.getInput('What database should I use?');

        let command = `php "${this.artisan}" migrate:status ${database.length > 0 ? '--database=' + database : ''}`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('Could not get the status of the migrations', err);
            } else {
                let data = this.parseCliTable(stdout);
                this.openVirtualHtmlFile('migrate-status', 'Migrate Status', data.headers, data.rows);
            }
        });
    }
}
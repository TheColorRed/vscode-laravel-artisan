import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MigrateRollback extends Common {

    public static async run() {

        let database = await this.getInput('What database should I use?');
        let command = `migrate:rollback ${database.length > 0 ? '--database=' + database : ''}`;

        this.execCmd(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('The database could not be rolled back', err);
            } else {
                this.showMessage('The database has been rolled back');
            }
        });
    }
}
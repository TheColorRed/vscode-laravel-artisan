import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MigrateRefresh extends Common {

    public static async run() {

        let database = await this.getInput('What database should I use?');
        let seed = await this.getYesNo('Should I seed the database for you?');

        let command = `php ${this.artisan} migrate:refresh ${database.length > 0 ? '--database=' + database : ''} ${seed ? '--seed' : ''}`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('The database could not be refreshed', err);
            } else {
                this.showMessage('The database has been refreshed');
            }
        });
    }
}
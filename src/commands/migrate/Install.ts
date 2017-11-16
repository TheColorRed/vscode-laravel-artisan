import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MigrateInstall extends Common {

    public static async run() {

        let database = await this.getInput('What database should I use?');
        let command = `php "${this.artisan}" migrate:install ${database.length > 0 ? '--database=' + database : ''}`;
        Output.command(command);

        cp.exec(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('The migration repository was not installed', err);
            } else {
                this.showMessage('The migration repository was installed');
            }
        });
    }
}
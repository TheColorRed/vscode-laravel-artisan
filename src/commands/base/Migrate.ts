import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class Migrate extends Common {

    public static async run() {

        let database = await this.getInput('What database should I use?');
        let seed = await this.getYesNo('Should I seed the database for you?');

        let command = `php artisan migrate ${seed ? '--seed' : ''} ${database.length > 0 ? '--database=' + database : ''}`;
        Output.command(command);

        cp.exec(`cd "${this.artisanRoot}" && ${command}`, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('The migration failed', err);
            } else {
                this.showMessage('The migration has completed');
            }
        });
    }
}
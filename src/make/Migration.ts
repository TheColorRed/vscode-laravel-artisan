import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeMigration extends Common {

    public static async run() {
        // Get the name of the controller to create
        let migrationName = await this.getInput('Migration Name');
        if (migrationName.length == 0) {
            this.showError('A migration name is required');
            return;
        }

        let createTable = false;
        let modifyTable = false;
        let tableName = '';

        // Determine if this is a resource controller or not
        createTable = await this.getYesNo('Will this create a table?');
        if (!createTable) {
            modifyTable = await this.getYesNo('Will this modify an existing table?');
        }

        if (createTable || modifyTable) {
            tableName = await this.getInput('What is the name of the table?');
        }

        // Generate the controller
        cp.exec(`php ${this.artisan} make:migration ${migrationName} ${createTable ? '--create=' + tableName : ''} ${modifyTable ? '--table=' + tableName : ''}`, async (err, stdout, stderr) => {
            if (err) {
                this.showError('Could not create the migration', err);
            } else {
                let file = stdout.replace(/^.+:/ig, '').trim();
                await this.openFile('/database/migrations/' + file + '.php');
            }
        });
    }
}
import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeSeeder extends Common {

    public static async run() {

        let seedName = await this.getInput('Seeder Name');
        if (seedName.length == 0) {
            this.showError('A seeder name is required')
            return;
        }

        let command = `make:seeder ${seedName}`;

        this.execCmd(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the seeder', err);
            } else {
                await this.openFile('/database/seeds/' + seedName + '.php');
            }
        });
    }
}
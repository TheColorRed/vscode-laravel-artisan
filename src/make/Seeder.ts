import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeSeeder extends Common {

    public static async run() {

        let seedName = await this.getInput('Seeder Name');
        if (seedName.length == 0) {
            this.showError('A seeder name is required')
            return;
        }

        cp.exec(`php ${this.artisan} make:seeder ${seedName}`, async (err) => {
            if (err) {
                this.showError('Could not create the seeder', err);
            } else {
                await this.openFile('/database/seeds/' + seedName + '.php');
            }
        });
    }
}
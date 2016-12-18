import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeProvider extends Common {

    public static async run() {

        let providerName = await this.getInput('Provider Name');
        if (providerName.length == 0) {
            this.showError('A provider name is required')
            return;
        }

        cp.exec(`php ${this.artisan} make:provider ${providerName}`, async (err) => {
            if (err) {
                this.showError('Could not create the provider', err);
            } else {
                await this.openFile('/app/Providers/' + providerName + '.php');
            }
        });
    }
}
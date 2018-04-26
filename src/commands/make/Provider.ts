import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeProvider extends Common {

    public static async run() {

        let providerName = await this.getInput('Provider Name');
        if (providerName.length == 0) {
            this.showError('A provider name is required')
            return;
        }

        let command = `php artisan make:provider ${providerName}`;
        Output.command(command);

        this.execCmd(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the provider', err);
            } else {
                await this.openFile('/app/Providers/' + providerName + '.php');
            }
        });
    }
}
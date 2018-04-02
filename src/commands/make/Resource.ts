import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeResource extends Common {

    public static async run() {
        // Get the name of the resource to create
        let ctrlName = await this.getInput('Resource Name');
        if (ctrlName.length == 0) {
            this.showError('A resource name is required');
            return;
        }

        // Determine if this is a resource collection or not
        let isCollection = await this.getYesNo('Should I make this a resource collection?');
        let command = `php artisan make:resource ${ctrlName} ${isCollection ? '--collection' : ''}`;
        Output.command(command);
        // Generate the resource
        cp.exec(`cd "${this.artisanRoot}" && ${command}`, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the resource', err);
            } else {
                await this.openFile('/app/Http/Resources/' + ctrlName + '.php');
            }
        });
    }
}
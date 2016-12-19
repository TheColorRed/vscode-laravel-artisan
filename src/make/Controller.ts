import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeController extends Common {

    public static async run() {
        // Get the name of the controller to create
        let ctrlName = await this.getInput('Controller Name');
        if (ctrlName.length == 0) {
            this.showError('A controller name is required');
            return;
        }

        // Determine if this is a resource controller or not
        let isResource = await this.getYesNo('Should I make this a resource controller?');

        // Generate the controller
        cp.exec(`php ${this.artisan} make:controller ${ctrlName} ${isResource ? '-r' : ''}`, async (err) => {
            if (err) {
                this.showError('Could not create the controller', err);
            } else {
                await this.openFile('/app/Http/Controllers/' + ctrlName + '.php');
            }
        });
    }
}
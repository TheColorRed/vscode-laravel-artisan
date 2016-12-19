import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeModel extends Common {

    public static async run() {
        // Get the name of the controller to create
        let modelName = await this.getInput('Model Name');
        if (modelName.length == 0) {
            this.showError('A model name is required');
            return;
        }
        let isController = false;
        let isMigration = false;
        let isResource = false;

        // Determine if this is a resource controller or not
        isMigration = await this.getYesNo('Should I create a migration for the model?');

        // Should a controller be generated?
        isController = await this.getYesNo('Should I create a controller for the model?');

        // Ask if the controller is a resource if the previous answer was 'yes'
        if (isController) {
            // Determine if this is a resource controller or not
            isResource = await this.getYesNo('Should I create the controller as a resource?');
        }

        // Generate the model
        cp.exec(`php ${this.artisan} make:model ${modelName} ${isMigration ? '-m' : ''} ${isController ? '-c' : ''} ${isResource ? '-r' : ''}`, async (err) => {
            if (err) {
                this.showError('Could not create the model', err);
            } else {
                await this.openFile('/app/' + modelName + '.php');
                if (isController) {
                    await this.openFile('/app/Http/Controllers/' + modelName + 'Controller.php');
                }
            }
        });
    }
}
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
        let isResource = false;

        // Determine if this is a resource controller or not
        let migration = await window.showQuickPick(['Yes', 'No'], { placeHolder: 'Generate a migration for the model?' });
        let isMigration = migration.toLowerCase() == 'yes' ? true : false;

        // Should a controller be generated?
        let controller = await window.showQuickPick(['Yes', 'No'], { placeHolder: 'Generate a controller for the model?' });
        isController = controller.toLowerCase() == 'yes' ? true : false;

        // Ask if the controller is a resource if the previous answer was 'yes'
        if (isController) {
            // Determine if this is a resource controller or not
            let resource = await window.showQuickPick(['Yes', 'No'], { placeHolder: 'Generate as a resource controller?' });
            isResource = resource.toLowerCase() == 'yes' ? true : false;
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
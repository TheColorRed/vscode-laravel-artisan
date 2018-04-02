import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

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

        let command = `php artisan make:model ${modelName} ${isMigration ? '-m' : ''} ${isController ? '-c' : ''} ${isResource ? '-r' : ''}`;
        Output.command(command);

        // Generate the model
        cp.exec(`cd "${this.artisanRoot}" && ${command}`, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
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
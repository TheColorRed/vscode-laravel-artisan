import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakePolicy extends Common {

    public static async run() {

        let noteName = await this.getInput('Policy Name');
        if (noteName.length == 0) {
            this.showError('A policy name is required')
            return;
        }

        let model = await this.getInput('The model to apply this policy to');

        cp.exec(`php ${this.artisan} make:policy ${noteName} ${model.length > 0 ? '--model=' + model : ''}`, async (err) => {
            if (err) {
                this.showError('Could not create the policy', err);
            } else {
                await this.openFile('/app/Policies/' + noteName + '.php');
            }
        });
    }
}
import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakePolicy extends Common {

    public static async run() {

        let policyName = await this.getInput('Policy Name');
        if (policyName.length == 0) {
            this.showError('A policy name is required')
            return;
        }

        let model = await this.getInput('What model should I apply this policy to?');
        let command = `make:policy ${policyName} ${model.length > 0 ? '--model=' + model : ''}`;

        this.execCmd(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout)
                this.showError('Could not create the policy', err);
            } else {
                await this.openFile('/app/Policies/' + policyName + '.php');
            }
        });
    }
}
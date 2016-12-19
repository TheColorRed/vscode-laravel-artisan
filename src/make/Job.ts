import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class MakeJob extends Common {

    public static async run() {

        let jobName = await this.getInput('Job Name');
        if (jobName.length == 0) {
            this.showError('A job name is required')
            return;
        }

        let sync = await this.getYesNo('Should I make this job synchronous?');

        cp.exec(`php ${this.artisan} make:job ${jobName} ${sync ? '--sync' : ''}`, async (err) => {
            if (err) {
                this.showError('Could not create the job', err);
            } else {
                await this.openFile('/app/Jobs/' + jobName + '.php');
            }
        });
    }
}
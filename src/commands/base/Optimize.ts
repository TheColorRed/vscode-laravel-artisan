import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class Optimize extends Common {

    public static async run() {

        let optCompser = await this.getYesNo('Should I optimize Composer\'s dump-autoload?');

        let command = `php artisan optimize ${!optCompser ? '--psr' : ''}`;
        Output.command(command);

        cp.exec(`cd "${this.artisanRoot}" && ${command}`, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('Optimization failed', err);
            } else {
                this.showMessage('The framework was optimized');
            }
        });
    }
}
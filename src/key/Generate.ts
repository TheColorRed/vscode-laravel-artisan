import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../Common';

export default class KeyGenerate extends Common {

    public static async run() {

        let update = await this.getYesNo('Should the env file get update also?');

        cp.exec(`php ${this.artisan} key:generate ${!update ? '--show' : ''}`, async (err, stdout) => {
            if (err) {
                this.showError('The key could not be generated', err);
            } else {
                let key = stdout.match(/base64:([^\] \b]*)/ig)[0] || '';
                if (update && key.length > 0) {
                    this.showMessage('The key was generated (' + key + ')');
                } else if (!update && key.length > 0) {
                    this.showMessage('Here is a key: (' + key + ')');
                } else {
                    this.showError('A key was not generated');
                }
            }
        });
    }
}
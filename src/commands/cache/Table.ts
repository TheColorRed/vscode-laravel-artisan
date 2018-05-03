import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class CacheTable extends Common {

    public static async run() {
        let command = `cache:table`;
        this.execCmd(command, async (err, stdout) => {
            if (err) {
                Output.error(stdout);
                this.showError('A migration table could not be created for the cache database table', err);
            } else {
                this.showMessage('A migration table was created for the cache database table');
            }
        });
    }
}
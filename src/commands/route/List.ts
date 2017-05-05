import { commands, window, workspace } from 'vscode';
import cp = require('child_process');
import fs = require('fs');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class RouteList extends Common {

    public static async run() {
        let command = `php ${this.artisan} route:list`;
        Output.command(command);
        cp.exec(command, async (err, stdout, stderr) => {
            if (err) {
                Output.error(stdout);
                return this.showError('The route cache could not be created', err);
            } else {
                let data = this.parseCliTable(stdout);
                this.openVirtualHtmlFile('route-list', data.headers, data.rows);
            }
        });
    }
}
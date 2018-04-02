import { commands, window, workspace } from 'vscode';
import cp = require('child_process');
import fs = require('fs');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class RouteList extends Common {

    public static async run() {
        let command = `php artisan route:list`;
        Output.command(command);
        cp.exec(`cd "${this.artisanRoot}" && ${command}`, async (err, stdout, stderr) => {
            if (err) {
                Output.error(stdout);
                return this.showError('The route list could not be generated', err);
            } else {
                let data = this.parseCliTable(stdout);
                this.openVirtualHtmlFile('route-list', 'Route List', data.headers, data.rows);
            }
        });
    }
}
import { commands, window, workspace } from 'vscode';
import cp = require('child_process');
import fs = require('fs');
import Common from '../Common';

export default class RouteList extends Common {

    public static async run() {
        cp.exec(`php ${this.artisan} route:list`, async (err, stdout, stderr) => {
            if (err) {
                console.log(stderr)
                return this.showError('The route cache could not be created', err);
            } else {
                let data = this.parseCliTable(stdout);
                this.openVirtualHtmlFile('route-list', data.headers, data.rows);
            }
        });
    }
}
import { commands, window, workspace, WebviewPanel } from 'vscode';
import cp = require('child_process');
import fs = require('fs');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class RouteList extends Common {
    private static timeout: NodeJS.Timer
    public static async run() {
        let command = `route:list`;
        this.execCmd(command, async (err, stdout, stderr) => {
            if (err) {
                Output.error(stdout);
                return this.showError('The route list could not be generated', err);
            } else {
                let data = this.parseCliTable(stdout);
                let panel = await this.openVirtualHtmlFile('route-list', 'Route List', data.headers, data.rows);
                this.ping(panel);
                panel.onDidDispose(() => clearInterval(this.timeout))
            }
        });
    }

    private static ping(panel: WebviewPanel) {
        let running = false;
        this.timeout = setInterval(() => {
            if (running) return;
            running = true;
            this.execCmd('route:list', async (err, stdout, stderr) => {
                let data = this.parseCliTable(stdout);
                panel.webview.postMessage({ rows: data.rows });
                running = false;
            })
        }, 5000)
    }
}
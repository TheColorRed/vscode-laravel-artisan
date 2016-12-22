import { commands, window, workspace, Uri, TextDocumentContentProvider, CancellationToken, WorkspaceEdit, TextEdit, Range, Position } from 'vscode';
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
                let cliTable = stdout;
                let clirows = cliTable.split(/\r\n|\n/g);

                let headers: string[] = [];
                let rows: string[][] = [];

                // Parse the cli table
                for (let i = 0, len = clirows.length; i < len; i++) {
                    if (i == 0 || i == 2) { continue; }
                    else if (i == 1) {
                        (headers = clirows[i].split('|')).forEach((v, k) => {
                            headers[k] = v.trim();
                            if (headers[k] == '') {
                                delete headers[k];
                            }
                        });
                    } else {
                        if (clirows[i].indexOf('|') > -1) {
                            let row: string[] = [];
                            clirows[i].split(/ \| /g).forEach((v, k) => {
                                row.push(v.replace(/^\||\|$/g, '').trim());
                            });
                            rows.push(row);
                        }
                    }
                }

                let html: string = `
                <style>
                    body { padding: 0; margin: 0; }
                    table { border-collapse: collapse; }
                    table thead { font-size: 16px; text-align: left; }
                    table body { font-size: 14px; }
                    table td { padding: 5px; }
                    table tbody tr:nth-child(odd){
                        background-color: rgba(0,0,0,0.25);
                    }
                </style>
                <table style="width: 100%;">`;
                html += '<thead><tr>';
                headers.forEach(header => {
                    html += '<th>' + header + '</th>';
                });
                html += '</tr></thead>';
                rows.forEach(row => {
                    html += '<tr>';
                    row.forEach(item => {
                        html += '<td>' + item + '</td>';
                    });
                    html += '</tr>';
                });
                html += '</table>';

                let uri = Uri.parse('laravel-artisan://route/list');
                let doc = await workspace.openTextDocument(uri);
                let edit = new WorkspaceEdit();
                let range = new Range(0, 0, doc.lineCount, doc.getText().length);
                edit.set(uri, [new TextEdit(range, html)]);
                workspace.applyEdit(edit);
                commands.executeCommand('vscode.previewHtml', uri);
            }
        });
    }
}
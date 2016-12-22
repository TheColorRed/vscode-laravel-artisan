import { workspace, window, commands, Uri, WorkspaceEdit, TextEdit, Range, Position } from 'vscode';

export default class Common {

    protected static artisan = workspace.rootPath + '/artisan';

    private static get tableStyle(): string {
        return `<style>
            body { padding: 0; margin: 0; }
            table { border-collapse: collapse; width: 100%; }
            table thead { font-size: 16px; text-align: left; }
            table tbody { font-size: 14px; }
            table td, table th { padding: 10px; }
            table tbody tr:nth-child(odd){
                background-color: rgba(0,0,0,0.25);
            }
        </style>`;
    }

    protected static async openFile(filename: string) {
        try {
            let doc = await workspace.openTextDocument(workspace.rootPath + filename);
            window.showTextDocument(doc);
        } catch (e) {
            console.log(e.getMessage);
        }
    }

    protected static parseCliTable(cliTable: string) {
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
        return { headers: headers, rows: rows };
    }

    protected static async openVirtualFile(path: string, content: string) {
        let uri = Uri.parse('laravel-artisan://artisan/' + path);
        let doc = await workspace.openTextDocument(uri);
        let edit = new WorkspaceEdit();
        let range = new Range(0, 0, doc.lineCount, doc.getText().length);
        edit.set(uri, [new TextEdit(range, content)]);
        workspace.applyEdit(edit);
        commands.executeCommand('vscode.previewHtml', uri);
    }

    protected static async openVirtualHtmlFile(path: string, headers: string[], rows: string[][]) {
        let html: string = `${this.tableStyle}<table>`;
        html += '<thead><tr>';
        headers.forEach(header => {
            html += '<th>' + header + '</th>';
        });
        html += '</tr></thead><tbody>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach(item => {
                html += '<td>' + item + '</td>';
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        this.openVirtualFile(path, html);
    }

    protected static async getInput(placeHolder: string) {
        let name = await window.showInputBox({ placeHolder: placeHolder });
        name = name == undefined ? '' : name;
        // if (name.length == 0) {
        //     window.showErrorMessage('Invalid ' + placeHolder);
        //     return '';
        // }
        return name;
    }

    protected static async getYesNo(placeHolder: string): Promise<boolean> {
        let value = await window.showQuickPick(['Yes', 'No'], { placeHolder: placeHolder });
        return value.toLowerCase() == 'yes' ? true : false;
    }

    protected static async showMessage(message: string) {
        window.showInformationMessage(message);
        return true;
    }

    protected static async showError(message: string, consoleErr = null) {
        window.showErrorMessage(message);
        if (consoleErr !== null) {
            console.error(consoleErr);
        }
        return false;
    }
}
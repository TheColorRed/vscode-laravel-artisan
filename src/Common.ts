import { workspace, window, commands, Uri, WorkspaceEdit, TextEdit, Range, Position, ViewColumn } from 'vscode';
import cp = require('child_process');

interface Command {
  name: string
  description: string
  arguments: any[]
  options: {
    name: string
    shortcut: string
    accept_value: boolean
    is_value_required: boolean
    is_multiple: boolean
    description: string
    default: any
  }[]
}

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
            table td a { color: #4080d0; cursor: pointer; }
            .hidden { display: none; }
            .search { padding-top: 15px; padding-bottom: 15px; width: 95vw; margin: auto; }
            #filter { display: block; padding: 5px; width: 100%; }
        </style>`;
  }

  protected static async openFile(filename: string) {
    try {
      let doc = await workspace.openTextDocument(workspace.rootPath + filename);
      window.showTextDocument(doc);
      this.refreshFilesExplorer();
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
          headers[k] = v.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').trim();
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

  protected static async openVirtualFile(path: string, title: string, content: string) {
    let uri = Uri.parse('laravel-artisan://artisan/' + path);
    let doc = await workspace.openTextDocument(uri);
    let edit = new WorkspaceEdit();
    let range = new Range(0, 0, doc.lineCount, doc.getText().length);
    edit.set(uri, [new TextEdit(range, content)]);
    workspace.applyEdit(edit);
    commands.executeCommand('vscode.previewHtml', uri, ViewColumn.One, title);
  }

  protected static async openVirtualHtmlFile(path: string, title: string, headers: string[], rows: string[][]) {
    let html: string = `<div class="search"><input type="text" id="filter" placeholder="Search for an item (RegExp Supported)"></div>`;
    html += `${this.tableStyle}<table>`;
    html += '<thead><tr>';
    headers.forEach(header => {
      html += '<th>' + header + '</th>';
    });
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
      html += '<tr>';
      row.forEach(item => {
        if (item.match(/app\\/i)) {
          html += `<td><a href="file://${workspace.rootPath}/${item.replace(/@.+$/, '').replace(/^App/, 'app')}.php" class="app-item">` + item + '</a></td>';
        } else {
          html += '<td>' + item + '</td>';
        }
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += `<script>
            let filter = document.querySelector('#filter');
            filter.focus();
            filter.addEventListener('input', e => {
                let v = e.currentTarget.value;
                document.querySelectorAll('tbody > tr').forEach(row => {
                    let txt = row.innerText;
                    let reg = new RegExp(v, 'ig');
                    if (reg.test(txt) || v.length == 0) {
                        row.classList.remove('hidden');
                    } else {
                        row.classList.add('hidden');
                    }
                });
            });
        </script>`
    this.openVirtualFile(path, title, html);
  }

  protected static async getInput(placeHolder: string) {
    let name = await window.showInputBox({ placeHolder: placeHolder.replace(/\s\s+/g, ' ').trim() });
    name = name == undefined ? '' : name;
    // if (name.length == 0) {
    //     window.showErrorMessage('Invalid ' + placeHolder);
    //     return '';
    // }
    return name;
  }

  protected static async getListInput(placeHolder: string, list: string[]) {
    let name = await window.showQuickPick(list, { placeHolder: placeHolder });
    name = name == undefined ? '' : name;
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
      console.error(consoleErr + ' (See output console for more details)');
    }
    return false;
  }

  protected static refreshFilesExplorer() {
    commands.executeCommand('workbench.files.action.refreshFilesExplorer')
  }

  protected static getCommandList(): Promise<Command[]> {
    return new Promise(resolve => {
      cp.exec(`php "${this.artisan}" list --format=json`, (err, stdout) => {
        let commands: any[] = JSON.parse(stdout).commands
        let commandList: Command[] = []
        commands.forEach(command => {
          let commandItem = { name: command.name, description: command.description, options: [], arguments: [] }
          for (let i in command.definition.options) {
            if (['help', 'quiet', 'verbose', 'version', 'ansi', 'no-ansi', 'no-interaction', 'env'].indexOf(i) > -1) continue
            commandItem.options.push(command.definition.options[i])
          }
          for (let i in command.definition.arguments) {
            commandItem.arguments.push(command.definition.arguments[i])
          }
          commandList.push(commandItem)
        })
        resolve(commandList)
      })
    })
  }
}
import * as cp from 'child_process';
import { join } from 'path';
import { ProgressLocation, Selection, Uri, ViewColumn, commands, window, workspace } from 'vscode';
import Output from './utils/Output';

interface Command {
  name: string;
  description: string;
  arguments: any[];
  options: {
    name: string;
    shortcut: string;
    accept_value: boolean;
    is_value_required: boolean;
    is_multiple: boolean;
    description: string;
    default: any;
  }[];
}

export interface CommandInfo {
  err: Error | undefined;
  stdout: string;
  stderr: string;
  artisan: {
    dir: string;
    path: string;
  };
}

export default class Common {
  public static readonly artisanFileList: Uri[] = [];
  /**
   * Get a list of all artisan files in the workspace.
   */
  protected static async listArtisanPaths() {
    let config = workspace.getConfiguration('artisan');
    let additionalLocations = config.get<string | null | string[]>('location');
    additionalLocations = typeof additionalLocations === 'string' ? new Array(1).concat(additionalLocations) : additionalLocations;
    let list = this.artisanFileList.concat(additionalLocations.map(i => Uri.parse(i)));
    if (list.length === 1 && list[0].fsPath.length) return list[0].fsPath;
    else if (list.length === 0) return 'artisan';
    let artisanToUse = await Common.getListInput(
      'Which artisan should execute this command?',
      list
        // Get the fs path from the URI
        .map(i => i.fsPath)
        // Remove Non-String values
        .filter(String)
        // Remove Duplicates
        .filter((v, i, a) => a.indexOf(v) === i)
    );
    return artisanToUse;
  }
  /**
   * Gets an artisan file from the workspace.
   * @param artisan The artisan path to use. If not specified then the user will be prompted to select one.
   */
  protected static async getArtisanRoot(artisan?: string) {
    const artisanToUse = artisan ? artisan : await this.listArtisanPaths();
    return artisanToUse.replace(/artisan$/, '').replace(/\\$/g, '');
  }
  /**
   * Executes an artisan command.
   * @param command The command to execute.
   * @param callback The callback to execute when the command is finished.
   * @param artisan The artisan path to use. If not specified then the user will be prompted to select one.
   */
  protected static async execCmd(command: string, callback: (info: CommandInfo) => void, artisan?: string) {
    const artisanToUse = artisan ? artisan : await this.listArtisanPaths();
    const artisanRoot = await this.getArtisanRoot(artisan);

    // Try an get a custom php location
    const config = workspace.getConfiguration('artisan');
    const phpLocation = config.get<string | null>('php.location', 'php');
    const dockerEnabled = config.get<boolean>('docker.enabled', false);
    const dockerCommand = config.get<string>('docker.command', null);
    const maxBuffer = config.get<number>('maxBuffer', 1024 * 200);
    const wsl = config.get<boolean>('wsl.enabled', false);

    let cmd = '';
    if (dockerEnabled) {
      command = `php artisan ${command}`;
      cmd = `${dockerCommand} ${command}`;
    } else {
      if (phpLocation === 'php') {
        command = `php artisan ${command}`;
      } else {
        // Location is in quotes so that it can support spaces in the path
        command = `"${phpLocation}" artisan ${command}`;
      }
      cmd = command;
    }

    Output.command(command.trim());
    window.withProgress(
      {
        location: ProgressLocation.Window,
        cancellable: false,
        title: 'Executing Artisan Command',
      },
      async progress => {
        progress.report({ increment: 0 });
        if (wsl) {
          await Common.wslCommand(callback, artisanRoot, artisanToUse, cmd);
        } else {
          await Common.nonWslCommand(callback, artisanRoot, artisanToUse, cmd, maxBuffer);
        }
        progress.report({ increment: 100 });
      }
    );
  }
  /**
   * Executes an artisan command when not using WSL.
   * @param callback The callback to execute when the command is finished.
   * @param artisanRoot The root directory of the artisan file.
   * @param artisanToUse The artisan file to use.
   * @param cmd The command to execute.
   * @param maxBuffer The max buffer size to use.
   */
  protected static async nonWslCommand(
    callback: (info: CommandInfo) => void,
    artisanRoot: string,
    artisanToUse: string,
    cmd: string,
    maxBuffer: number
  ) {
    return new Promise<void>((resolve, reject) => {
      cp.exec(
        cmd,
        {
          cwd: artisanRoot,
          maxBuffer: maxBuffer,
        },
        (err, stdout, stderr) => {
          Output.command(stdout.trim());
          Output.showConsole();
          if (err) {
            Output.command('-----------------------------------');
            Output.error(err.message.trim());
            Output.showConsole();
            resolve();
          } else {
            reject(err);
          }
          callback({
            err,
            stdout,
            stderr,
            artisan: {
              dir: artisanRoot,
              path: artisanToUse,
            },
          });
        }
      );
    });
  }
  /**
   * Executes an artisan command when using WSL.
   * @param callback The callback to execute when the command is finished.
   * @param artisanRoot The root directory of the artisan file.
   * @param artisanToUse The artisan file to use.
   * @param cmd The command to execute.
   */
  protected static async wslCommand(callback: (info: CommandInfo) => void, artisanRoot: string, artisanToUse: string, cmd: string) {
    return new Promise<void>((resolve, reject) => {
      console.log('wsl', cmd);
      const child = cp.spawn('wsl', [cmd], {
        cwd: artisanRoot,
        shell: true,
      });
      child.stdout.on('data', data => {
        callback({
          err: undefined,
          stdout: data.toString(),
          stderr: undefined,
          artisan: {
            dir: artisanRoot,
            path: artisanToUse,
          },
        });
        resolve();
      });
      child.stderr.on('error', err => {
        callback({
          err,
          stdout: undefined,
          stderr: undefined,
          artisan: {
            dir: artisanRoot,
            path: artisanToUse,
          },
        });
        reject();
      });
    });
  }
  /**
   * Opens a file in the editor.
   * @param root The root directory.
   * @param filename The filename to open.
   */
  protected static async openFile(root: string, filename: string) {
    try {
      // let doc = await workspace.openTextDocument(this.artisanRoot + '/' + filename)
      let doc = await workspace.openTextDocument(join(root, filename));
      window.showTextDocument(doc);
      this.refreshFilesExplorer();
    } catch (e) {
      console.log(e.message);
    }
  }
  /**
   * Parses a cli table generated by artisan.
   * @param cliTable The cli table to parse.
   */
  protected static parseCliTable(cliTable: string) {
    let cliRows = cliTable.split(/\r\n|\n/g);
    let headers: string[] = [];
    let rows: string[][] = [];
    // Parse the cli table
    for (let i = 0, len = cliRows.length; i < len; i++) {
      if (i === 0 || i === 2) {
        continue;
      } else if (i === 1) {
        (headers = cliRows[i].split('|')).forEach((v, k) => {
          headers[k] = v.replace(/[\u001b\u009b][[()#?]*(?:[0-9]{1,4}(?:[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').trim();
          if (headers[k] === '') {
            delete headers[k];
          }
        });
      } else {
        if (cliRows[i].indexOf('|') > -1) {
          let row: string[] = [];
          cliRows[i].split(/ \| /g).forEach(v => {
            row.push(v.replace(/^\||\|$/g, '').trim());
          });
          rows.push(row);
        }
      }
    }
    return { headers: headers, rows: rows };
  }

  private static get tableStyle(): string {
    return `<style>
      * { box-sizing: border-box; }
      body { padding: 0; margin: 0; }
      table { border-collapse: collapse; width: 95vw; margin: auto; }
      table thead { font-size: 16px; text-align: left; }
      table tbody { font-size: 14px; }
      table td, table th { padding: 10px; }
      table tbody tr:nth-child(odd) { background-color: rgba(0,0,0,0.25); }
      table td a { color: #4080d0; cursor: pointer; }
      .hidden { display: none; }
      .search { padding-top: 15px; padding-bottom: 15px; width: 95vw; margin: auto; }
      #filter { display: block; padding: 5px; width: 100%; }
      .loading { text-align: center; }
    </style>`;
  }
  /**
   * Opens a virtual Laravel routes list.
   * @param openPath The path to open.
   * @param title The title of the file.
   * @param headers The headers of the table.
   * @param rows The rows of the table.
   * @param artisanRoot The root directory of the artisan file.
   */
  protected static async openVirtualHtmlFile(openPath: string, title: string, headers: string[], rows: string[][], artisanRoot: string) {
    let html: string = `<div class="search"><input type="text" id="filter" placeholder="Search for an item (RegExp Supported)"></div>`;
    html += '<h2 class="loading">Loading Route Information...</h2>';
    html += `${this.tableStyle}<table class="hidden">`;
    html += '<thead><tr>';
    headers.forEach(header => {
      html += '<th>' + header + '</th>';
    });
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
      html += '<tr>';
      row.forEach(item => {
        if ((item ?? '').match(/app\\/i)) {
          html +=
            `<td><a href="file:///${workspace.rootPath}/${item
              .replace(/@.+$/, '')
              .replace(/^App/g, 'app')}.php" data-method="${item.replace(/^.+@/, '')}" class="app-item">` +
            item +
            '</a></td>';
        } else {
          html += '<td>' + item + '</td>';
        }
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += `<script>
    const filter = document.querySelector('#filter')
    const body = document.querySelector('table tbody')
    const rootPath = '${artisanRoot.replace(/\\/g, '/')}'
    const vscode = acquireVsCodeApi()
    console.log(rootPath)
    filter.focus()
    const table = document.querySelector('table')
    const loading = document.querySelector('.loading')
    function filterItems(){
      let v = filter.value
      document.querySelectorAll('tbody > tr').forEach(row => {
        let txt = row.textContent
        let reg = new RegExp(v, 'ig')
        if (reg.test(txt) || v.length === 0) {
          row.classList.remove('hidden')
        } else {
          row.classList.add('hidden')
        }
      })
    }
    function routeEvents(){
      Array.from(body.querySelectorAll('a')).forEach(item => {
        item.addEventListener('click', e => {
          e.preventDefault()
          let target = e.currentTarget
          vscode.postMessage({ file: target.href, method: target.getAttribute('data-method') })
        })
      })
    }
    filter.addEventListener('input', filterItems)
    window.addEventListener('message', msg => {
      let rows = msg.data.rows
      if(rows.length >0){
        table.classList.remove('hidden')
        loading.classList.add('hidden')
      }
      let html = ''
      rows.forEach(row => {
        html += '<tr>'
        row.forEach(item => {
          if ((item??'').match(/app\\\\/i)) {
            let file = \`\${rootPath}/\${item.replace(/@.+$/, '').replace(/^App/, 'app')}.php\`.replace(/\\\\/g, '/')
            html += \`<td><a href="\${file}" data-method="\${item.replace(/^.+@/, '')}" class="app-item">\` + item + '</a></td>'
          } else {
            html += '<td>' + item + '</td>'
          }
        })
        html += '</tr>'
      })
      body.innerHTML = html
      filterItems()
      routeEvents()
    })
    routeEvents()
  </script>`;
    const panel = window.createWebviewPanel(openPath, title, ViewColumn.Active, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    panel.webview.html = html;
    panel.webview.onDidReceiveMessage(async msg => {
      if (msg.file) {
        let uri = Uri.parse(msg.file);
        let method = msg.method || '';
        let doc = await workspace.openTextDocument(uri);
        let activeDoc = await window.showTextDocument(doc);
        if (method.length > 0) {
          let idx = doc.getText().indexOf(`function ${method}`);
          if (idx > -1) {
            let pos = doc.positionAt(idx + 9);
            activeDoc.selection = new Selection(pos, pos);
          }
        }
      }
    });
    return panel;
  }
  /**
   * Shows an input box and returns the value.
   * @param placeHolder The placeholder text.
   */
  protected static async getInput(placeHolder: string) {
    let name = await window.showInputBox({
      placeHolder: placeHolder.replace(/\s\s+/g, ' ').trim(),
    });
    name = typeof name === 'undefined' ? '' : name;
    // if (name.length === 0) {
    //   window.showErrorMessage('Invalid ' + placeHolder)
    //   return ''
    // }
    return name;
  }
  /**
   * Shows a list of items and returns the selected item.
   * @param placeHolder The placeholder text.
   * @param list The list of items to choose from.
   */
  protected static async getListInput(placeHolder: string, list: string[]) {
    let name = await window.showQuickPick(list, { placeHolder: placeHolder });
    name = typeof name === 'undefined' ? '' : name;
    return name;
  }
  /**
   * Shows a Yes/No dialog (where `yes` is first in the list) and returns the result.
   * @param placeHolder The placeholder text.
   */
  protected static async getYesNo(placeHolder: string): Promise<boolean> {
    let value = await window.showQuickPick(['Yes', 'No'], { placeHolder });
    return value.toLowerCase() === 'yes' ? true : false;
  }
  /**
   * Shows a No/Yes dialog (where `no` is first in the list) and returns the result.
   * @param placeHolder The placeholder text.
   */
  protected static async getNoYes(placeHolder: string): Promise<boolean> {
    let value = await window.showQuickPick(['No', 'Yes'], { placeHolder });
    return value.toLowerCase() === 'yes' ? true : false;
  }
  /**
   * Shows snackbar message to the user.
   * @param message The message to show.
   */
  protected static async showMessage(message: string) {
    window.showInformationMessage(message);
    return true;
  }
  /**
   * Shows snackbar error message to the user.
   * @param message The message to show.
   * @param consoleErr The message to show in console.
   */
  protected static async showError(message: string, consoleErr = null) {
    if (consoleErr !== null) {
      message += ' (See output console for more details)';
      console.error(consoleErr + ' (See output console for more details)');
    }
    window.showErrorMessage(message);
    return false;
  }
  /**
   * Refreshes the files explorer.
   */
  protected static refreshFilesExplorer() {
    commands.executeCommand('workbench.files.action.refreshFilesExplorer');
  }
  /**
   * Get a list of all artisan commands.
   */
  protected static getCommandList(): Promise<Command[]> {
    return new Promise(resolve => {
      this.execCmd(`list --format=json`, info => {
        let commands: any[] = JSON.parse(info.stdout).commands;
        let commandList: Command[] = [];
        commands.forEach(command => {
          let commandItem = {
            name: command.name,
            description: command.description,
            options: [],
            arguments: [],
          };
          for (let i in command.definition.options) {
            if (['help', 'quiet', 'verbose', 'version', 'ansi', 'no-ansi', 'no-interaction', 'env'].indexOf(i) > -1) continue;
            commandItem.options.push(command.definition.options[i]);
          }
          for (let i in command.definition.arguments) {
            commandItem.arguments.push(command.definition.arguments[i]);
          }
          commandList.push(commandItem);
        });
        resolve(commandList);
      });
    });
  }
}

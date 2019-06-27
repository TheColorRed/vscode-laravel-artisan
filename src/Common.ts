import { workspace, window, commands, Uri, ViewColumn, Selection } from 'vscode'
import * as cp from 'child_process'
import Output from './utils/Output'
import { join } from 'path';
import { resolve } from 'dns';

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

  public static readonly artisanFileList: Uri[] = []

  // protected static get artisanRoot(): string {
  //   let config = workspace.getConfiguration("artisan")
  //   let location = config.get<string | number | null | string[]>("location")
  //   if (location) {
  //     if (typeof location == 'string') {
  //       return location.replace(/\$\{workspaceRoot\}/g, workspace.rootPath)
  //     } else if (typeof location == 'number') {
  //       return workspace.workspaceFolders[location].uri.fsPath
  //     }
  //   }
  //   // If we have gotten this far then a location hasn't been specified
  //   // We then get the first workspace
  //   if (workspace.workspaceFolders) {
  //     return workspace.workspaceFolders[0].uri.fsPath
  //   }
  //   // Last resort get the root path (this is technically deprecated)
  //   return workspace.rootPath
  // }

  // protected static get artisan(): string {
  //   return this.artisanRoot + '/artisan'
  // }

  protected static async listArtisanPaths() {
    let config = workspace.getConfiguration("artisan")
    let additionalLocations = config.get<string | null | string[]>("location")
    additionalLocations = typeof additionalLocations == 'string' ? new Array(1).concat(additionalLocations) : additionalLocations
    let list = this.artisanFileList.concat(additionalLocations.map(i => Uri.parse(i)))
    if (list.length == 1 && list[0].fsPath.length) return list[0].fsPath
    else if (list.length == 0) return 'artisan'
    let artisanToUse = await Common.getListInput('Which artisan should execute this command?',
      list
        // Get the fs path from the URI
        .map(i => i.fsPath)
        // Remove Non-String values
        .filter(String)
        // Remove Duplicates
        .filter((v, i, a) => a.indexOf(v) === i)
    )
    return artisanToUse
  }


  protected static async execCmd(command: string, callback: (info: {
    err: Error | undefined
    stdout: string
    stderr: string
    artisan: {
      dir: string
      path: string
    }
  }) => void, artisan?: string) {
    let artisanToUse = artisan ? artisan : await this.listArtisanPaths()
    // // If only one artisan is found use it
    // if (this.artisanFileList.length == 1) artisanToUse = this.artisanFileList[0].fsPath
    // // If more than one artisan is found ask which one to use
    // else if (this.artisanFileList.length > 1) artisanToUse = await this.listArtisanPaths()

    let artisanRoot = artisanToUse.replace(/artisan$/, '').replace(/\\$/g, '')

    // Try an get a custom php location
    let config = workspace.getConfiguration('artisan')
    let phpLocation = config.get<string | null>('php.location', 'php')
    let dockerEnabled = config.get<boolean>('docker.enabled', false)
    let dockerCommand = config.get<string>('docker.command', null)
    let maxBuffer = config.get<number>('maxBuffer', 1024 * 200)

    let cmd = ''

    if (dockerEnabled) {
      command = `php artisan ${command}`
      cmd = `cd ${artisanRoot} && ${dockerCommand} ${command}`
    } else {
      command = `"${phpLocation}" artisan ${command}`
      cmd = process.platform == 'win32' ?
        // Windows command
        `cd /d "${artisanRoot}" && ${command}` :
        // Unix command
        `cd "${artisanRoot}" && ${command}`
    }

    Output.command(command.trim())
    cp.exec(cmd, { maxBuffer }, async (err, stdout, stderr) => {
      if (err) {
        Output.error(err.message.trim())
        Output.showConsole()
      }
      await callback({
        err, stdout, stderr, artisan: {
          dir: artisanRoot, path: artisanToUse
        }
      })
    })
  }

  protected static async openFile(root: string, filename: string) {
    try {
      // let doc = await workspace.openTextDocument(this.artisanRoot + '/' + filename)
      let doc = await workspace.openTextDocument(join(root, filename))
      window.showTextDocument(doc)
      this.refreshFilesExplorer()
    } catch (e) {
      console.log(e.message)
    }
  }

  protected static parseCliTable(cliTable: string) {
    let clirows = cliTable.split(/\r\n|\n/g)
    let headers: string[] = []
    let rows: string[][] = []
    // Parse the cli table
    for (let i = 0, len = clirows.length; i < len; i++) {
      if (i == 0 || i == 2) { continue }
      else if (i == 1) {
        (headers = clirows[i].split('|')).forEach((v, k) => {
          headers[k] = v.replace(/[\u001b\u009b][[()#?]*(?:[0-9]{1,4}(?:[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').trim()
          if (headers[k] == '') {
            delete headers[k]
          }
        })
      } else {
        if (clirows[i].indexOf('|') > -1) {
          let row: string[] = []
          clirows[i].split(/ \| /g).forEach((v) => {
            row.push(v.replace(/^\||\|$/g, '').trim())
          })
          rows.push(row)
        }
      }
    }
    return { headers: headers, rows: rows }
  }

  // protected static async openVirtualFile(path: string, title: string, content: string) {
  //   let uri = Uri.parse('laravel-artisan://artisan/' + path)
  //   let doc = await workspace.openTextDocument(uri)
  //   let edit = new WorkspaceEdit()
  //   let range = new Range(0, 0, doc.lineCount, doc.getText().length)
  //   edit.set(uri, [new TextEdit(range, content)])
  //   workspace.applyEdit(edit)
  //   commands.executeCommand('vscode.previewHtml', uri, ViewColumn.One, title)
  // }


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
    </style>`
  }

  protected static async openVirtualHtmlFile(openPath: string, title: string, headers: string[], rows: string[][], artisanRoot: string) {
    let html: string = `<div class="search"><input type="text" id="filter" placeholder="Search for an item (RegExp Supported)"></div>`
    html += `${this.tableStyle}<table>`
    html += '<thead><tr>'
    headers.forEach(header => {
      html += '<th>' + header + '</th>'
    })
    html += '</tr></thead><tbody>'
    rows.forEach(row => {
      html += '<tr>'
      row.forEach(item => {
        if (item.match(/app\\/i)) {
          html += `<td><a href="file://${workspace.rootPath}/${item.replace(/@.+$/, '').replace(/^App/, 'app')}.php" data-method="${item.replace(/^.+@/, '')}" class="app-item">` + item + '</a></td>'
        } else {
          html += '<td>' + item + '</td>'
        }
      })
      html += '</tr>'
    })
    html += '</tbody></table>'
    html += `<script>
    const filter = document.querySelector('#filter')
    const body = document.querySelector('table tbody')
    const rootPath = '${artisanRoot.replace(/\\/g, '/')}'
    const vscode = acquireVsCodeApi()
    console.log(rootPath)
    filter.focus()
    function filterItems(){
      let v = filter.value
      document.querySelectorAll('tbody > tr').forEach(row => {
        let txt = row.textContent
        let reg = new RegExp(v, 'ig')
        if (reg.test(txt) || v.length == 0) {
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
      let html = ''
      rows.forEach(row => {
        html += '<tr>'
        row.forEach(item => {
          if (item.match(/app\\\\/i)) {
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
  </script>`
    const panel = window.createWebviewPanel(openPath, title, ViewColumn.Active, {
      enableScripts: true,
      retainContextWhenHidden: true
    })
    panel.webview.html = html
    panel.webview.onDidReceiveMessage(async msg => {
      if (msg.file) {
        let uri = Uri.parse(msg.file)
        let method = msg.method || ''
        let doc = await workspace.openTextDocument(uri)
        let activeDoc = await window.showTextDocument(doc)
        if (method.length > 0) {
          let idx = doc.getText().indexOf(`function ${method}`)
          if (idx > -1) {
            let pos = doc.positionAt(idx + 9)
            activeDoc.selection = new Selection(pos, pos)
          }
        }
      }
    })
    return panel
  }

  protected static async getInput(placeHolder: string) {
    let name = await window.showInputBox({ placeHolder: placeHolder.replace(/\s\s+/g, ' ').trim() })
    name = name == undefined ? '' : name
    // if (name.length == 0) {
    //   window.showErrorMessage('Invalid ' + placeHolder)
    //   return ''
    // }
    return name
  }

  protected static async getListInput(placeHolder: string, list: string[]) {
    let name = await window.showQuickPick(list, { placeHolder: placeHolder })
    name = name == undefined ? '' : name
    return name
  }

  protected static async getYesNo(placeHolder: string): Promise<boolean> {
    let value = await window.showQuickPick(['Yes', 'No'], { placeHolder })
    return value.toLowerCase() == 'yes' ? true : false
  }

  protected static async getNoYes(placeHolder: string): Promise<boolean> {
    let value = await window.showQuickPick(['No', 'Yes'], { placeHolder })
    return value.toLowerCase() == 'yes' ? true : false
  }

  protected static async showMessage(message: string) {
    window.showInformationMessage(message)
    return true
  }

  protected static async showError(message: string, consoleErr = null) {
    if (consoleErr !== null) {
      message += ' (See output console for more details)'
      console.error(consoleErr + ' (See output console for more details)')
    }
    window.showErrorMessage(message)
    return false
  }

  protected static refreshFilesExplorer() {
    commands.executeCommand('workbench.files.action.refreshFilesExplorer')
  }

  protected static getCommandList(): Promise<Command[]> {
    return new Promise(resolve => {
      this.execCmd(`list --format=json`, (info) => {
        let commands: any[] = JSON.parse(info.stdout).commands
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
import { workspace, window, Terminal } from 'vscode'
import Common from '../../Common'

export default class Server extends Common {

  private static terminal: Terminal
  private static host: string
  private static port: string

  public static async run(useDefaults = false) {

    let config = workspace.getConfiguration("artisan")
    let defaultHost = config.get<string>("serve.defaultHost", 'localhost')
    let defaultPort = config.get<string>("serve.defaultPort", '8000')

    let host = useDefaults ? defaultHost : await this.getInput(`Should I use a specific host (Default: ${defaultHost})?`)
    let port = useDefaults ? defaultPort : await this.getInput(`Should I use a specific port (Default: ${defaultPort})?`)

    Server.host = host.length > 0 ? host : defaultHost
    Server.port = port.length > 0 ? port : defaultPort

    let artisanToUse = await this.listArtisanPaths()

    Server.terminal = window.createTerminal('Laravel Artisan Server')
    Server.terminal.show()
    Server.terminal.sendText(`php "${artisanToUse}" serve --host='${Server.host}' --port='${Server.port}'`)
    this.showMessage(`The server is now running on "http://${Server.host}:${Server.port}"`)
  }

  public static async stop() {
    if (Server.terminal) {
      Server.terminal.dispose()
      this.showMessage(`The server has been stopped on "http://${Server.host}:${Server.port}"`)
    } else {
      this.showError('There is no server currently running')
    }
  }
}
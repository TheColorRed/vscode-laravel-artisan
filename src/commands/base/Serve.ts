import { workspace, window, Terminal } from 'vscode'
import Common from '../../Common'

export default class Server extends Common {

  // public static child: cp.ChildProcess
  private static terminal: Terminal
  private static host: string
  private static port: string

  public static async run(useDefaults = false) {

    let config = workspace.getConfiguration("artisan")
    let defaultHost = config.get<string>("serve.defaultHost", 'localhost')
    let defaultPort = config.get<string>("serve.defaultPort", '8000')

    let host = useDefaults ? defaultHost : await this.getInput(`Should I use a specific host (Default: ${defaultHost})?`)
    let port = useDefaults ? defaultPort : await this.getInput(`Should I use a specific port (Default: ${defaultPort})?`)

    this.host = host.length > 0 ? host : defaultHost
    this.port = port.length > 0 ? port : defaultPort

    // let command = `serve ${'--host=' + this.host} ${'--port=' + this.port}`

    let artisanToUse = await this.listArtisanPaths()

    this.terminal = window.createTerminal('Laravel Artisan Server')
    this.terminal.show()
    this.terminal.sendText(`php "${artisanToUse}" serve ${'--host=' + this.host} ${'--port=' + this.port}`)
    this.showMessage(`The server is now running on "http://${Server.host}:${Server.port}"`)
  }

  public static async stop() {
    if (Server.terminal) {
      this.terminal.dispose()
      this.showMessage(`The server has been stopped on "http://${Server.host}:${Server.port}"`)
    } else {
      this.showError('There is no server currently running')
    }
  }
}
import { WebviewPanel } from 'vscode'
import Common from '../../Common'

export default class RouteList extends Common {
  private static timeout: NodeJS.Timer
  public static async run() {
    let command = `route:list`
    this.execCmd(command, async (info) => {
      if (info.err) {
        return this.showError('The route list could not be generated', info.err)
      } else {
        let data = this.parseCliTable(info.stdout)
        let panel = await this.openVirtualHtmlFile('route-list', 'Route List', data.headers, data.rows, info.artisan.dir)
        this.ping(panel, info.artisan.path)
        panel.onDidDispose(() => clearInterval(this.timeout))
      }
    })
  }

  private static ping(panel: WebviewPanel, root: string) {
    let running = false
    this.timeout = setInterval(() => {
      if (running) return
      running = true
      this.execCmd('route:list', async (info) => {
        let data = this.parseCliTable(info.stdout)
        panel.webview.postMessage({ rows: data.rows })
        running = false
      }, root)
    }, 5000)
  }
}
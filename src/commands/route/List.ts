import { Observable, Subscription, defer, of } from 'rxjs';
import { filter, map, repeat, switchMap, tap } from 'rxjs/operators';
import { WebviewPanel } from 'vscode';

import Common, { CommandInfo } from '../../Common';

interface RouteRow {
  domain: string;
  method: string;
  uri: string;
  name: string;
  action: string;
  middleware: string[];
}

export default class RouteList extends Common {
  private static panel: WebviewPanel | undefined;
  private static headers: string[] = ['Domain', 'Method', 'URI', 'Name', 'Action', 'Middleware'];

  private static get observable() {
    return defer(() => RouteList.ensurePanel()).pipe(
      filter(() => typeof RouteList.panel !== 'undefined'),
      switchMap(() => RouteList.runCommand('route:list --json')),
      filter(info => {
        if (info.err) {
          Common.showError('The route list could not be generated.', info.err);
          return false;
        }
        return true;
      }),
      switchMap(c =>
        of(c).pipe(
          map(info => RouteList.parseRouteList(info.stdout ?? '')),
          tap(info => RouteList.panel?.webview.postMessage({ rows: info.rows }))
        )
      ),
      repeat({ delay: 5000 })
    );
  }
  private static subscription?: Subscription;

  private static async ensurePanel() {
    if (typeof RouteList.panel === 'undefined') {
      const artisan = await Common.getArtisanRoot();
      RouteList.panel = await Common.openVirtualHtmlFile('route-list', 'Route List', RouteList.headers, [], artisan);
      RouteList.panel.onDidDispose(() => {
        RouteList.subscription?.unsubscribe();
        RouteList.panel = undefined;
      });
    }
  }

  public static async run() {
    this.subscription?.unsubscribe();
    this.subscription = this.observable.subscribe();
  }

  private static runCommand(cmd: string) {
    return new Observable<CommandInfo>(sub => {
      this.execCmd(cmd, async info => {
        sub.next(info);
        sub.complete();
      });
    });
  }

  private static parseRouteList(stdout: string): { headers: string[]; rows: string[][] } {
    const data = JSON.parse(stdout);
    // {domain: null, method: 'GET|HEAD', uri: '/', name: null, action: 'Closure', middleware: []}
    let rows = data.map((row: RouteRow) => [row.domain ?? '', row.method, row.uri, row.name, row.action, row.middleware]);
    const resultRows: string[][] = [];
    rows.forEach((row: string[]) => {
      if (row[5].length > 1) {
        resultRows.push([row[0], row[1], row[2], row[3], row[4], row[5][0]]);
        (row[5] as unknown as string[]).forEach((middleware: string, idx: number) => idx > 0 && resultRows.push(['', '', '', '', '', middleware]));
      } else {
        resultRows.push([row[0], row[1], row[2], row[3], row[4], row[5][0]]);
      }
    });
    return { headers: ['Domain', 'Method', 'URI', 'Name', 'Action', 'Middleware'], rows: resultRows };
  }
}

import { Observable, Subscription, exhaustMap, of, timer } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { WebviewPanel } from 'vscode';

import Common, { CommandInfo } from '../../Common';

export default class RouteList extends Common {
  private static panel: WebviewPanel;
  private static headers: string[] = ['Method', 'URI', 'Name', 'Action', 'Middleware'];

  private static observable = timer(0, 5000).pipe(
    map(() => 'route:list --json'),
    tap(async () => {
      if (typeof RouteList.panel === 'undefined') {
        const artisan = await Common.getArtisanRoot();
        RouteList.panel = await Common.openVirtualHtmlFile('route-list', 'Route List', RouteList.headers, [], artisan);
        RouteList.panel.onDidDispose(() => RouteList.subscription.unsubscribe());
      }
    }),
    exhaustMap(cmd => RouteList.runCommand(cmd)),
    filter(info => {
      if (info.err) {
        Common.showError('The route list could not be generated.', info.err);
        return false;
      }
      return true;
    }),
    switchMap(c =>
      of(c).pipe(
        map(info => RouteList.parseRouteList(info.stdout)),
        tap(async info => RouteList.panel.webview.postMessage({ rows: info.rows }))
      )
    )
  );
  private static subscription?: Subscription;

  public static async run() {
    this.subscription = this.observable.subscribe();
  }

  private static runCommand(cmd) {
    return new Observable<CommandInfo>(sub => {
      this.execCmd(cmd, async info => {
        sub.next(info);
        sub.complete();
      });
    });
  }

  private static parseRouteList(stdout: string): { headers: string[]; rows: string[][] } {
    const data = JSON.parse(stdout);
    console.log('data', data);
    // {domain: null, method: 'GET|HEAD', uri: '/', name: null, action: 'Closure', middleware: []}
    const rows = data.map((row: any) => {
      return [row.method, row.uri, row.name, row.action, row.middleware.join(', ')];
    });
    return { headers: ['Method', 'URI', 'Name', 'Action', 'Middleware'], rows };
  }
}

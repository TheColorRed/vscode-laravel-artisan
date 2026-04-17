import { Terminal, window, workspace } from 'vscode';
import Common from '../../Common';

export default class Tinker extends Common {
  private static terminal: Terminal | undefined;

  public static async run() {
    const config = workspace.getConfiguration('artisan');
    const wsl = config.get<boolean>('wsl.enabled', false);
    const phpLocation = config.get<string>('php.location', 'php');

    let artisanToUse = await this.listArtisanPaths();

    Tinker.terminal = window.createTerminal('Laravel Tinker');
    Tinker.terminal.show();

    if (wsl) {
      Tinker.terminal.sendText('wsl');
      artisanToUse = artisanToUse.replace(/^(\w):/, '/mnt/$1').replace(/\\/g, '/');
    }

    setTimeout(() => {
      Tinker.terminal.sendText(`${phpLocation} "${artisanToUse}" tinker`);
    }, 1000);
  }
}

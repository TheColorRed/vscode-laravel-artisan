import { Terminal, window, workspace } from 'vscode';
import Common from '../../Common';

export class QueueWork extends Common {
  private static terminal: Terminal | undefined;

  public static async run() {
    const config = workspace.getConfiguration('artisan');
    const wsl = config.get<boolean>('wsl.enabled', false);
    const phpLocation = config.get<string>('php.location', 'php');

    const queue = await this.getInput('Queue name (leave blank for default)');
    const queueArg = queue.length > 0 ? ` --queue=${queue}` : '';

    let artisanToUse = await this.listArtisanPaths();

    QueueWork.terminal = window.createTerminal('Laravel Queue Worker');
    QueueWork.terminal.show();

    if (wsl) {
      QueueWork.terminal.sendText('wsl');
      artisanToUse = artisanToUse.replace(/^(\w):/, '/mnt/$1').replace(/\\/g, '/');
    }

    setTimeout(() => {
      QueueWork.terminal.sendText(`${phpLocation} "${artisanToUse}" queue:work${queueArg}`);
    }, 1000);
  }

  public static stop() {
    QueueWork.terminal?.dispose();
    QueueWork.terminal = undefined;
  }
}

export class QueueListen extends Common {
  private static terminal: Terminal | undefined;

  public static async run() {
    const config = workspace.getConfiguration('artisan');
    const wsl = config.get<boolean>('wsl.enabled', false);
    const phpLocation = config.get<string>('php.location', 'php');

    const queue = await this.getInput('Queue name (leave blank for default)');
    const queueArg = queue.length > 0 ? ` --queue=${queue}` : '';

    let artisanToUse = await this.listArtisanPaths();

    QueueListen.terminal = window.createTerminal('Laravel Queue Listener');
    QueueListen.terminal.show();

    if (wsl) {
      QueueListen.terminal.sendText('wsl');
      artisanToUse = artisanToUse.replace(/^(\w):/, '/mnt/$1').replace(/\\/g, '/');
    }

    setTimeout(() => {
      QueueListen.terminal.sendText(`${phpLocation} "${artisanToUse}" queue:listen${queueArg}`);
    }, 1000);
  }

  public static stop() {
    QueueListen.terminal?.dispose();
    QueueListen.terminal = undefined;
  }
}

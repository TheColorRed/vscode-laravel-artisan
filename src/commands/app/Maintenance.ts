import Common from '../../Common';

export class AppDown extends Common {
  public static async run() {
    const message = await this.getInput('Maintenance message (leave blank for default)');
    const secret = await this.getInput('Secret bypass token (leave blank to skip)');

    const msgArg = message.length > 0 ? ` --message="${message}"` : '';
    const secretArg = secret.length > 0 ? ` --secret="${secret}"` : '';

    this.execCmd(`down${msgArg}${secretArg}`, async info => {
      if (info.err) {
        this.showError('Could not put the application into maintenance mode', info.err);
      } else {
        this.showMessage('Application is now in maintenance mode.');
      }
    });
  }
}

export class AppUp extends Common {
  public static async run() {
    this.execCmd('up', async info => {
      if (info.err) {
        this.showError('Could not bring the application out of maintenance mode', info.err);
      } else {
        this.showMessage('Application is now live.');
      }
    });
  }
}

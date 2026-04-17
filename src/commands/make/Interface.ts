import Common from '../../Common';

export default class MakeInterface extends Common {
  public static async run() {
    const name = await this.getInput('Interface Name (e.g. Contracts/PaymentGateway)');
    if (name.length === 0) {
      this.showError('An interface name is required');
      return;
    }

    this.execCmd(`make:interface ${name}`, async info => {
      if (info.err) {
        this.showError('Could not create the interface', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/app/' + name + '.php');
      }
    });
  }
}

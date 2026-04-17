import Common from '../../Common';

export default class MakeClass extends Common {
  public static async run() {
    const name = await this.getInput('Class Name (e.g. Services/PaymentService)');
    if (name.length === 0) {
      this.showError('A class name is required');
      return;
    }

    this.execCmd(`make:class ${name}`, async info => {
      if (info.err) {
        this.showError('Could not create the class', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/app/' + name + '.php');
      }
    });
  }
}

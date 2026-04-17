import Common from '../../Common';

export default class MakeException extends Common {
  public static async run() {
    const name = await this.getInput('Exception Name (e.g. InvalidOrderException)');
    if (name.length === 0) {
      this.showError('An exception name is required');
      return;
    }

    this.execCmd(`make:exception ${name}`, async info => {
      if (info.err) {
        this.showError('Could not create the exception', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/app/Exceptions/' + name + '.php');
      }
    });
  }
}

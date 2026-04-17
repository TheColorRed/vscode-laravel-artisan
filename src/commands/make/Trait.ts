import Common from '../../Common';

export default class MakeTrait extends Common {
  public static async run() {
    const name = await this.getInput('Trait Name (e.g. HasUuid)');
    if (name.length === 0) {
      this.showError('A trait name is required');
      return;
    }

    this.execCmd(`make:trait ${name}`, async info => {
      if (info.err) {
        this.showError('Could not create the trait', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/app/' + name + '.php');
      }
    });
  }
}

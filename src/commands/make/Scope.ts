import Common from '../../Common';

export default class MakeScope extends Common {
  public static async run() {
    const name = await this.getInput('Scope Name (e.g. ActiveScope)');
    if (name.length === 0) {
      this.showError('A scope name is required');
      return;
    }

    this.execCmd(`make:scope ${name}`, async info => {
      if (info.err) {
        this.showError('Could not create the scope', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/app/Models/Scopes/' + name + '.php');
      }
    });
  }
}

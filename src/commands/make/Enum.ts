import Common from '../../Common';

export default class MakeEnum extends Common {
  public static async run() {
    const name = await this.getInput('Enum Name (e.g. Status)');
    if (name.length === 0) {
      this.showError('An enum name is required');
      return;
    }

    const type = await this.getListInput('Backing type?', ['None', 'string', 'int']);
    const backed = type !== 'None' ? `--backed=${type}` : '';

    this.execCmd(`make:enum ${name} ${backed}`, async info => {
      if (info.err) {
        this.showError('Could not create the enum', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/app/Enums/' + name + '.php');
      }
    });
  }
}

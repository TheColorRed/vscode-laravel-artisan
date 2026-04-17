import Common from '../../Common';

export default class MakeConfig extends Common {
  public static async run() {
    const name = await this.getInput('Config Name (e.g. services)');
    if (name.length === 0) {
      this.showError('A config name is required');
      return;
    }

    this.execCmd(`make:config ${name}`, async info => {
      if (info.err) {
        this.showError('Could not create the config file', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/config/' + name + '.php');
      }
    });
  }
}

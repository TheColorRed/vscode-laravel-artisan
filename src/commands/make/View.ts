import Common from '../../Common';

export default class MakeView extends Common {
  public static async run() {
    const name = await this.getInput('View Name (e.g. users.index)');
    if (name.length === 0) {
      this.showError('A view name is required');
      return;
    }

    this.execCmd(`make:view ${name}`, async info => {
      if (info.err) {
        this.showError('Could not create the view', info.err);
      } else {
        const viewPath = name.replace(/\./g, '/');
        await this.openFile(info.artisan.dir, '/resources/views/' + viewPath + '.blade.php');
      }
    });
  }
}

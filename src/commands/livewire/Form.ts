import Common from '../../Common';

export default class LivewireForm extends Common {
  public static async run() {
    let name = await this.getInput('Form Class Name');
    if (name.length === 0) {
      this.showError('A form class name is required');
      return;
    }

    this.execCmd(`livewire:form ${name}`, async info => {
      if (info.err) {
        if (await this.handleLivewireNotInstalled(info)) return;
        this.showError('Could not create Livewire form class', info.err);
      } else {
        const infoMatch = (info.stdout ?? '').match(/\[([^\]]+\.php)\]/i);
        if (infoMatch) {
          await this.openFile(info.artisan.dir, `/${infoMatch[1].replace(/\\/g, '/')}`);
        }
      }
    });
  }
}

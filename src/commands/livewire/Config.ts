import Common from '../../Common';

export default class LivewireConfig extends Common {
  public static async run() {
    this.execCmd(`livewire:config`, async info => {
      if (info.err) {
        if (await this.handleLivewireNotInstalled(info)) return;
        this.showError('Could not publish Livewire config file', info.err);
      } else {
        const infoMatch = (info.stdout ?? '').match(/\[([^\]]+\.php)\]/i);
        if (infoMatch) {
          await this.openFile(info.artisan.dir, `/${infoMatch[1].replace(/\\/g, '/')}`);
        } else {
          this.showMessage('Livewire config file published successfully.');
        }
      }
    });
  }
}

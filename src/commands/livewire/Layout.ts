import Common from '../../Common';

export default class LivewireLayout extends Common {
  public static async run() {
    this.execCmd(`livewire:layout`, async info => {
      if (info.err) {
        if (await this.handleLivewireNotInstalled(info)) return;
        this.showError('Could not create Livewire layout', info.err);
      } else {
        const infoMatch = (info.stdout ?? '').match(/\[([^\]]+\.blade\.php)\]/i);
        if (infoMatch) {
          await this.openFile(info.artisan.dir, `/${infoMatch[1].replace(/\\/g, '/')}`);
        } else {
          this.showMessage('Livewire layout created successfully.');
        }
      }
    });
  }
}

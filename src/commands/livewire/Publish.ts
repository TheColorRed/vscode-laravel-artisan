import Common from '../../Common';

export default class LivewirePublish extends Common {
  public static async run() {
    this.execCmd(`livewire:publish`, async info => {
      if (info.err) {
        if (await this.handleLivewireNotInstalled(info)) return;
        this.showError('Could not publish Livewire configuration', info.err);
      } else {
        this.showMessage('Livewire configuration published successfully.');
      }
    });
  }
}

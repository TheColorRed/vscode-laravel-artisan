import Common from '../../Common';

export default class LivewireStubs extends Common {
  public static async run() {
    this.execCmd(`livewire:stubs`, async info => {
      if (info.err) {
        if (await this.handleLivewireNotInstalled(info)) return;
        this.showError('Could not publish Livewire stubs', info.err);
      } else {
        this.showMessage('Livewire stubs published successfully.');
      }
    });
  }
}

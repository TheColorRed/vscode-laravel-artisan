import Common from '../../Common';

export default class LivewireConvert extends Common {
  public static async run() {
    let name = await this.getInput('Component Name to Convert');
    if (name.length === 0) {
      this.showError('A component name is required');
      return;
    }

    this.execCmd(`livewire:convert ${name}`, async info => {
      if (info.err) {
        if (await this.handleLivewireNotInstalled(info)) return;
        this.showError('Could not convert Livewire component', info.err);
      } else {
        this.showMessage(`Livewire component "${name}" converted successfully.`);
      }
    });
  }
}

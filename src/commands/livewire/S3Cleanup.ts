import Common from '../../Common';

export default class LivewireS3Cleanup extends Common {
  public static async run() {
    this.execCmd(`livewire:configure-s3-upload-cleanup`, async info => {
      if (info.err) {
        if (await this.handleLivewireNotInstalled(info)) return;
        this.showError('Could not configure S3 upload cleanup', info.err);
      } else {
        this.showMessage('Livewire S3 upload cleanup configured successfully.');
      }
    });
  }
}

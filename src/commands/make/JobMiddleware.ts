import Common from '../../Common';

export default class MakeJobMiddleware extends Common {
  public static async run() {
    const name = await this.getInput('Job Middleware Name (e.g. RateLimited)');
    if (name.length === 0) {
      this.showError('A job middleware name is required');
      return;
    }

    this.execCmd(`make:job-middleware ${name}`, async info => {
      if (info.err) {
        this.showError('Could not create the job middleware', info.err);
      } else {
        await this.openFile(info.artisan.dir, '/app/Jobs/Middleware/' + name + '.php');
      }
    });
  }
}

import Common from '../../Common';

/** Runs a make:*-table command and opens the generated migration file. */
async function runTableCommand(cmd: string, errorLabel: string) {
  Common['execCmd'](cmd, async (info: any) => {
    if (info.err) {
      Common['showError'](`Could not create the ${errorLabel} migration`, info.err);
    } else {
      const match = (info.stdout as string).match(/(\d{4}_\d{2}_\d{2}_\d{6}_\S+)\.php/i);
      if (match) {
        await Common['openFile'](info.artisan.dir, '/database/migrations/' + match[1] + '.php');
      } else {
        Common['showMessage'](`${errorLabel} migration created successfully.`);
      }
    }
  });
}

export class MakeNotificationsTable extends Common {
  public static async run() {
    this.execCmd('make:notifications-table', async info => {
      if (info.err) {
        this.showError('Could not create the notifications table migration', info.err);
      } else {
        const match = (info.stdout ?? '').match(/(\d{4}_\d{2}_\d{2}_\d{6}_\S+?)(?:\.php)?['"\s]/i);
        if (match) {
          await this.openFile(info.artisan.dir, '/database/migrations/' + match[1] + '.php');
        } else {
          this.showMessage('Notifications table migration created successfully.');
        }
      }
    });
  }
}

export class MakeQueueBatchesTable extends Common {
  public static async run() {
    this.execCmd('make:queue-batches-table', async info => {
      if (info.err) {
        this.showError('Could not create the queue batches table migration', info.err);
      } else {
        const match = (info.stdout ?? '').match(/(\d{4}_\d{2}_\d{2}_\d{6}_\S+?)(?:\.php)?['"\s]/i);
        if (match) {
          await this.openFile(info.artisan.dir, '/database/migrations/' + match[1] + '.php');
        } else {
          this.showMessage('Queue batches table migration created successfully.');
        }
      }
    });
  }
}

export class MakeQueueFailedTable extends Common {
  public static async run() {
    this.execCmd('make:queue-failed-table', async info => {
      if (info.err) {
        this.showError('Could not create the queue failed table migration', info.err);
      } else {
        const match = (info.stdout ?? '').match(/(\d{4}_\d{2}_\d{2}_\d{6}_\S+?)(?:\.php)?['"\s]/i);
        if (match) {
          await this.openFile(info.artisan.dir, '/database/migrations/' + match[1] + '.php');
        } else {
          this.showMessage('Queue failed jobs table migration created successfully.');
        }
      }
    });
  }
}

export class MakeQueueTable extends Common {
  public static async run() {
    this.execCmd('make:queue-table', async info => {
      if (info.err) {
        this.showError('Could not create the queue table migration', info.err);
      } else {
        const match = (info.stdout ?? '').match(/(\d{4}_\d{2}_\d{2}_\d{6}_\S+?)(?:\.php)?['"\s]/i);
        if (match) {
          await this.openFile(info.artisan.dir, '/database/migrations/' + match[1] + '.php');
        } else {
          this.showMessage('Queue jobs table migration created successfully.');
        }
      }
    });
  }
}

export class MakeSessionTable extends Common {
  public static async run() {
    this.execCmd('make:session-table', async info => {
      if (info.err) {
        this.showError('Could not create the session table migration', info.err);
      } else {
        const match = (info.stdout ?? '').match(/(\d{4}_\d{2}_\d{2}_\d{6}_\S+?)(?:\.php)?['"\s]/i);
        if (match) {
          await this.openFile(info.artisan.dir, '/database/migrations/' + match[1] + '.php');
        } else {
          this.showMessage('Session table migration created successfully.');
        }
      }
    });
  }
}

export class MakeCacheTable extends Common {
  public static async run() {
    this.execCmd('make:cache-table', async info => {
      if (info.err) {
        this.showError('Could not create the cache table migration', info.err);
      } else {
        const match = (info.stdout ?? '').match(/(\d{4}_\d{2}_\d{2}_\d{6}_\S+?)(?:\.php)?['"\s]/i);
        if (match) {
          await this.openFile(info.artisan.dir, '/database/migrations/' + match[1] + '.php');
        } else {
          this.showMessage('Cache table migration created successfully.');
        }
      }
    });
  }
}

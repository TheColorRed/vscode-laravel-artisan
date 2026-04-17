import Common from '../../Common';

export class QueueClear extends Common {
  public static async run() {
    const queue = await this.getInput('Queue name to clear (leave blank for default)');
    const cmd = queue.length > 0 ? `queue:clear ${queue}` : 'queue:clear';
    this.execCmd(cmd, async info => {
      if (info.err) {
        this.showError('Could not clear the queue', info.err);
      } else {
        this.showMessage('Queue cleared successfully.');
      }
    });
  }
}

export class QueueFailed extends Common {
  public static async run() {
    this.execCmd('queue:failed', async info => {
      if (info.err) {
        this.showError('Could not list failed queue jobs', info.err);
      } else {
        this.showMessage(info.stdout?.trim() || 'No failed jobs found.');
      }
    });
  }
}

export class QueueFlush extends Common {
  public static async run() {
    this.execCmd('queue:flush', async info => {
      if (info.err) {
        this.showError('Could not flush failed queue jobs', info.err);
      } else {
        this.showMessage('All failed queue jobs flushed.');
      }
    });
  }
}

export class QueueForget extends Common {
  public static async run() {
    const id = await this.getInput('Failed job ID to delete');
    if (id.length === 0) {
      this.showError('A job ID is required');
      return;
    }
    this.execCmd(`queue:forget ${id}`, async info => {
      if (info.err) {
        this.showError('Could not delete the failed job', info.err);
      } else {
        this.showMessage(`Failed job ${id} deleted.`);
      }
    });
  }
}

export class QueueRestart extends Common {
  public static async run() {
    this.execCmd('queue:restart', async info => {
      if (info.err) {
        this.showError('Could not restart queue workers', info.err);
      } else {
        this.showMessage('Queue workers will restart after finishing their current job.');
      }
    });
  }
}

export class QueuePause extends Common {
  public static async run() {
    const queue = await this.getInput('Queue name to pause (leave blank for default)');
    const cmd = queue.length > 0 ? `queue:pause ${queue}` : 'queue:pause';
    this.execCmd(cmd, async info => {
      if (info.err) {
        this.showError('Could not pause the queue', info.err);
      } else {
        this.showMessage('Queue paused successfully.');
      }
    });
  }
}

export class QueueResume extends Common {
  public static async run() {
    const queue = await this.getInput('Queue name to resume (leave blank for default)');
    const cmd = queue.length > 0 ? `queue:resume ${queue}` : 'queue:resume';
    this.execCmd(cmd, async info => {
      if (info.err) {
        this.showError('Could not resume the queue', info.err);
      } else {
        this.showMessage('Queue resumed successfully.');
      }
    });
  }
}

export class QueueRetry extends Common {
  public static async run() {
    const id = await this.getInput('Failed job ID to retry (or "all")');
    if (id.length === 0) {
      this.showError('A job ID is required');
      return;
    }
    this.execCmd(`queue:retry ${id}`, async info => {
      if (info.err) {
        this.showError('Could not retry the failed job', info.err);
      } else {
        this.showMessage(`Job ${id} pushed back onto the queue.`);
      }
    });
  }
}

export class QueueRetryBatch extends Common {
  public static async run() {
    const id = await this.getInput('Batch ID to retry');
    if (id.length === 0) {
      this.showError('A batch ID is required');
      return;
    }
    this.execCmd(`queue:retry-batch ${id}`, async info => {
      if (info.err) {
        this.showError('Could not retry the batch', info.err);
      } else {
        this.showMessage(`Failed jobs for batch ${id} pushed back onto the queue.`);
      }
    });
  }
}

export class QueuePruneBatches extends Common {
  public static async run() {
    this.execCmd('queue:prune-batches', async info => {
      if (info.err) {
        this.showError('Could not prune batch records', info.err);
      } else {
        this.showMessage('Stale batch records pruned.');
      }
    });
  }
}

export class QueuePruneFailed extends Common {
  public static async run() {
    this.execCmd('queue:prune-failed', async info => {
      if (info.err) {
        this.showError('Could not prune failed jobs', info.err);
      } else {
        this.showMessage('Stale failed job records pruned.');
      }
    });
  }
}

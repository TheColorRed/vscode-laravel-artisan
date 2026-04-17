import Common from '../../Common';

// Strips ANSI escape codes from a string
function stripAnsi(str: string): string {
  return str.replace(/[\u001b\u009b][[()#?]*(?:[0-9]{1,4}(?:[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

export default class LivewireMake extends Common {
  /**
   * Parses the CLASS and VIEW paths from livewire artisan output.
   * Handles two formats:
   *   Legacy: "CLASS: app/..." and "VIEW: resources/..."
   *   Modern: "INFO  Livewire component [resources/views/...] created successfully."
   */
  private static parsePaths(output: string): { classPath: string | null; viewPath: string | null } {
    const clean = stripAnsi(output);

    // Legacy format
    const classMatch = clean.match(/CLASS\s*:\s*(\S+\.php)/i);
    const viewLegacy = clean.match(/VIEW\s*:\s*(resources[/\\]\S+\.blade\.php)/i);
    if (classMatch || viewLegacy) {
      return {
        classPath: classMatch ? classMatch[1].replace(/\\/g, '/') : null,
        viewPath: viewLegacy ? viewLegacy[1].replace(/\\/g, '/') : null,
      };
    }

    // Modern format: INFO  Livewire component [resources/views/...] created successfully.
    const infoMatch = clean.match(/\[([^\]]+\.blade\.php)\]/i);
    return {
      classPath: null,
      viewPath: infoMatch ? infoMatch[1].replace(/\\/g, '/') : null,
    };
  }

  /**
   * Derives candidate CLASS and VIEW paths from the component name.
   * Returns multiple candidates since we can't check the Docker filesystem.
   */
  private static guessCandidates(componentName: string): { classCandidates: string[]; viewCandidates: string[] } {
    const normalized = componentName.replace(/\\/g, '/');
    const parts = normalized.split('/');
    const className = parts[parts.length - 1];
    const viewName = className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const subDir = parts.slice(0, -1).map(p => p.toLowerCase()).join('/');
    const viewDir = subDir ? `${subDir}/` : '';

    return {
      // v3 first, then v2
      classCandidates: [
        `app/Livewire/${normalized}.php`,
        `app/Http/Livewire/${normalized}.php`,
      ],
      // livewire dir first, then components
      viewCandidates: [
        `resources/views/livewire/${viewDir}${viewName}.blade.php`,
        `resources/views/components/${viewDir}${viewName}.blade.php`,
      ],
    };
  }

  /**
   * Tries to open each candidate path, stopping at the first one that succeeds.
   */
  private static async openFirstExisting(artisanDir: string, candidates: string[]): Promise<void> {
    for (const candidate of candidates) {
      try {
        await this.openFile(artisanDir, `/${candidate}`);
        return;
      } catch {
        // try next candidate
      }
    }
  }

  public static async run() {
    let componentName = await this.getInput('Component Name (e.g. Counter or Forms/Register)');
    if (componentName.length === 0) {
      this.showError('A component name is required');
      return;
    }

    this.execCmd(`make:livewire ${componentName}`, async info => {
      if (info.err) {
        if (await this.handleLivewireNotInstalled(info)) return;

        const output = (info.err?.message ?? '') + (info.stderr ?? '') + (info.stdout ?? '');
        if (/component already exists/i.test(output)) {
          const choice = await this.showWarningWithOptions(
            `Livewire component "${componentName}" already exists.`,
            'Open Existing'
          );
          if (choice === 'Open Existing') {
            await this.openParsedOrGuessed(info.artisan.dir, output, componentName);
          }
          return;
        }

        this.showError('Could not create Livewire component', info.err);
      } else {
        await this.openParsedOrGuessed(info.artisan.dir, info.stdout ?? '', componentName);
      }
    });
  }

  private static async openParsedOrGuessed(artisanDir: string, output: string, componentName: string): Promise<void> {
    const { classPath, viewPath } = this.parsePaths(output);
    const { classCandidates, viewCandidates } = this.guessCandidates(componentName);

    await this.openFirstExisting(artisanDir, classPath ? [classPath] : classCandidates);
    await this.openFirstExisting(artisanDir, viewPath ? [viewPath] : viewCandidates);
  }
}

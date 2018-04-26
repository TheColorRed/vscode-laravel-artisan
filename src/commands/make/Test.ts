import { window, workspace } from 'vscode';
import cp = require('child_process');
import Common from '../../Common';
import Output from '../../utils/Output';

export default class MakeTest extends Common {

  public static async run() {
    // Get the name of the controller to create
    let testName = await this.getInput('Test Name');
    if (testName.length == 0) {
      this.showError('A test name is required');
      return;
    }

    // Determine if this is a resource controller or not
    let isUnitTest = await this.getYesNo('Should I make this a unit test?');
    let command = `php artisan make:test ${testName} ${isUnitTest ? '--unit' : ''}`;
    Output.command(command);
    // Generate the controller
    this.execCmd(command, async (err, stdout) => {
      if (err) {
        Output.error(stdout)
        this.showError('Could not create the test', err);
      } else {
        await this.openFile(`/tests/${isUnitTest ? 'Unit' : 'Feature'}/${testName}.php`);
      }
    });
  }
}
import Common from "../../Common";
import cp = require('child_process');
import Output from "../../utils/Output";

export default class RunCommand extends Common {
  public static async run() {
    // Get a list of installed commands
    let commands = await this.getCommandList()

    // get a list of strings for selectable options
    let items = commands.reduce((a, v) => a.concat(v.name + ' -- ' + v.description), [])
    let cmd = await this.getListInput('Command to run', items)
    // Find the command settings from the selected option
    let commandSettings = commands.find(c => c.name == cmd.split('--')[0].trim())

    // Initialize an array of options and arguments
    let opts: string[] = []
    let args: string[] = []

    // Ask for information about the arguments
    for (let arg of commandSettings.arguments) {
      let input = await this.getInput(`${arg.name} ${this.getDefaultText(arg)} ${this.getDescription(arg)}`)
      if (this.isValidInput(input)) {
        args.push(`${input.toString().length > 0 ? input : this.toValidInput(arg.default)}`)
      }
    }

    // Ask for information about the options
    for (let opt of commandSettings.options) {
      let input = await this.getInput(`${opt.name} ${this.getDefaultText(opt)} ${this.getDescription(opt)}`)
      if (this.isValidInput(input)) {
        opts.push(`${opt.name}=${input.length > 0 ? input : this.toValidInput(opt.default)}`)
      }
    }

    // Remove empty items
    args = args.filter(a => a != '')
    opts = opts.filter(a => a != '')

    let command = `php "${this.artisan}" ${commandSettings.name} ${args.join(' ')} ${opts.join(' ')}`
    Output.command(command)
    cp.exec(command, (err, stdout) => {
      if (err) {
        Output.error(stdout)
        this.showError('Could not run the command')
      } else {
        this.showMessage(`Command "${commandSettings.name}" has finished (See output console for more information)`)
        Output.info(stdout)
      }
    })
  }

  private static getDefaultText(obj) {
    return this.isValidInput(obj.default) && obj.default.toString().length > 0 ? `[${obj.default}]` : ''
  }

  private static getDescription(obj) {
    return obj.description.toString().length > 0 ? `(${obj.description})` : ''
  }

  private static isValidInput(input) {
    return ['string', 'number'].indexOf(typeof input) > -1
  }

  private static toValidInput(input) {
    return ['string', 'number'].indexOf(typeof input) > -1 ? input : ''
  }
}
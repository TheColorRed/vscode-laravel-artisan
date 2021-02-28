import Common from '../../Common'

export default class MakeComponent extends Common {
  
  public static async run() {
    // Get the name of the component to create
    let componentName = await this.getInput('Component Name')
    if (componentName.length == 0) {
      this.showError('A component name is required')
      return
    }
    
    let inlineView = false
    // Determine the type of view (basic, inline)
    inlineView = await this.getNoYes('Should this render an inline view?')

    let inlineOption = inlineView ? '--inline' : ''
    let command = `make:component ${inlineOption} ${componentName}`

    // Generate the component
    this.execCmd(command, async (info) => {
      if (info.err) {
        this.showError('Could not create component', info.err)
      } else {
        await this.openFile(info.artisan.dir, '/app/View/Components/' + componentName + '.php')

        if (!inlineView) {
          await this.openFile(info.artisan.dir, '/resources/views/components/' + componentName + '.blade.php')
        }
      }
    })
  }
}
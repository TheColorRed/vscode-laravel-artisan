import { workspace, window } from 'vscode';

export default class Common {

    protected static artisan = workspace.rootPath + '/artisan';

    protected static async openFile(filename: string) {
        try {
            let doc = await workspace.openTextDocument(workspace.rootPath + filename);
            window.showTextDocument(doc);
        } catch (e) {
            console.log(e.getMessage);
        }
    }

    protected static async getInput(placeHolder: string) {
        let name = await window.showInputBox({ placeHolder: placeHolder });
        name = name == undefined ? '' : name;
        // if (name.length == 0) {
        //     window.showErrorMessage('Invalid ' + placeHolder);
        //     return '';
        // }
        return name;
    }

    protected static async getYesNo(placeHolder: string): Promise<boolean> {
        let value = await window.showQuickPick(['Yes', 'No'], { placeHolder: placeHolder });
        return value.toLowerCase() == 'yes' ? true : false;
    }

    protected static async showMessage(message: string) {
        window.showInformationMessage(message);
        return true;
    }

    protected static async showError(message: string, consoleErr = null) {
        window.showErrorMessage(message);
        if (consoleErr !== null) {
            console.error(consoleErr);
        }
        return false;
    }
}
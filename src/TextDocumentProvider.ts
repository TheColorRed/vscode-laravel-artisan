import { TextDocumentContentProvider, Uri, CancellationToken, commands } from 'vscode';

export default class Test implements TextDocumentContentProvider {

    public async provideTextDocumentContent(uri: Uri, token: CancellationToken): Promise<string> {
        // await commands.executeCommand('vscode.previewHtml', uri);
        return '';
    }

}
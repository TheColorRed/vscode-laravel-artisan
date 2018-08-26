import { TextDocumentContentProvider, Uri, CancellationToken } from 'vscode'

export default class Test implements TextDocumentContentProvider {

  public async provideTextDocumentContent(uri: Uri, token: CancellationToken): Promise<string> {
    return ''
  }

}
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry'
import { NotebookPanel, INotebookModel, INotebookTracker } from '@jupyterlab/notebook';
import { IDisposable, DisposableDelegate } from '@phosphor/disposable';
import { SaveStash, STASH_FILE_NAME } from '../persistence/save';
import { ContentsManager } from '@jupyterlab/services';
import { JSONArray } from '@phosphor/coreutils';

const STASH_TOOLBAR_CLASS = 's-nbtoolbar-icon'


export class StashToolBarButton implements 
DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  createNew(
    panel: NotebookPanel, 
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    let callback = () => {
      let contents = new ContentsManager();
      contents
          .get(STASH_FILE_NAME)
          .then(s => {
            var stashManager = new SaveStash(panel);
            if (s.content) {
              let file: JSONArray = JSON.parse(s.content).stash;
              stashManager.fromFile = file;
            }
            stashManager.stashSelection();
          })
    }
    let button = new ToolbarButton({
      className: 'stashToolBarButton',
      iconClassName: STASH_TOOLBAR_CLASS,
      onClick: callback,
      tooltip: 'Stash Cells'
    });
    
    panel.toolbar.insertAfter('spacer', 'stash', button);
    return new DisposableDelegate(() => {
      button.dispose();
    })
  }
  notebookTracker: INotebookTracker = null;
}


/**
 * A button in the toolbar to stash cells.
 * @param panel 
 */
/*
export function createStashToolbarButton(
        panel: NotebookPanel, 
    ): void {
        function onClick() {
            console.log('stashed from toolbar');
        }

        panel.toolbar.insertItem(
            toArray(panel.toolbar.names()).length - 2,
            'stashToolbarButton',
            new ToolbarButton({
                iconClassName: STASH_TOOLBAR_CLASS,
                className: 'jp-ToolbarButton',
                label: 'Stash',
                onClick: () => { onClick(); },
                tooltip: 'Stash selected cells'
            }),
        )
}
*/
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry'
import { NotebookPanel, INotebookModel, INotebookTracker } from '@jupyterlab/notebook';
import { IDisposable, DisposableDelegate } from '@phosphor/disposable';
import { CheckStash } from '../persistence/save';

const STASH_TOOLBAR_CLASS = 's-nbtoolbar-icon'


export class StashToolBarButton implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  createNew(
    panel: NotebookPanel, 
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    let callback = () => {
      console.log('toolbar button')
      let selected = CheckStash(panel.content);
      console.log(selected.length);
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
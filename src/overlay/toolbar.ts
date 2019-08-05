import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry'
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { IDisposable, DisposableDelegate } from '@phosphor/disposable';
import { StashPanel } from './sidebar';
import { StashManager, STASH_FILE_NAME } from '../persistence/manager';
import { ContentsManager } from '@jupyterlab/services';
//import { JSONArray } from '@phosphor/coreutils';
//import { StashLoadManager } from '../persistence/load';

const STASH_TOOLBAR_CLASS = 's-nbtoolbar-icon'


export class StashToolBarButton implements 
DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {

  constructor(sPanel: StashPanel) {
    this.stashPanel = sPanel;
  }

  createNew(
    panel: NotebookPanel, 
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    let callback = () => {
      var stashManager = new StashManager(panel, this.stashPanel);
      let contents = new ContentsManager(); 
      contents
          .get(STASH_FILE_NAME)
          .then(s => {
            if (s.content) {
              let file: string[] = JSON.parse(s.content).stash;
              stashManager.fromFile = file;
            }
            stashManager.stashSelection();
          })
          .catch(() => {
            contents.newUntitled({
              path: './',
              ext: '.stash',
              type: 'file'
            });
            contents.rename('./untitled.stash', './.stash');
            stashManager.stashSelection();
          })
    }
    let button = new ToolbarButton({
      className: 'stashToolBarButton',
      iconClassName: STASH_TOOLBAR_CLASS,
      onClick: callback,
      tooltip: 'Stash current cell selection',
    });
    button.node.classList.add("jp-Icon", "jp-Icon-16");

    panel.toolbar.insertAfter('spacer', 'stash', button);
    return new DisposableDelegate(() => {
      button.dispose();
    })
  }
  stashPanel: StashPanel;
}
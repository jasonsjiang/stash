import {
  ILabShell,
  JupyterFrontEndPlugin,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { IStatusBar } from '@jupyterlab/statusbar';
import { 
  INotebookTracker, 
  //Notebook, 
  /*NotebookPanel*/ } from '@jupyterlab/notebook';
import { StashPanel } from './overlay/sidebar';
import { StashCells } from './overlay/statusbar'
//import { createStashToolbarButton } from './overlay/toolbar'
import { CheckStash } from './persistence/save';
import '../style/index.css';
//import { DocumentRegistry } from '@jupyterlab/docregistry';


/*
import {
  Widget
} from '@phosphor/widgets'; */

/**
 * Initialization data for the stash sidepanel.
 */
const extension: JupyterFrontEndPlugin<void> = {
  activate: activateStash,
  id: 'stashPanel',
  autoStart: true,
  requires: [
    ILabShell,
    INotebookTracker,
    IStatusBar
  ]
};

function activateStash(
  app: JupyterFrontEnd,
  labShell: ILabShell,
  statusBar: IStatusBar,
  nbTracker: INotebookTracker
) {
  const stash = new StashPanel();
  stash.title.iconClass = 's-Stash-icon jp-SideBar-tabIcon';
  stash.title.caption = 'Stash';
  stash.id = 'stashPanel';

  labShell.add(stash, 'left', { rank: 700 });
}

/**
 * A plugin providing a button located in the statusbar 
 * to stash selected cells. 
 */
/*
const stashStatusBarButton: JupyterFrontEndPlugin<void> = {
  id: 'stashStatusBarButton',
  autoStart: true,
  requires: [
    IStatusBar
  ],
  activate: (
    app: JupyterFrontEnd, 
    statusBar: IStatusBar,
    nbTracker: INotebookTracker
  ) => {
    let item = new StashCells({
      onClick: () => CheckStash(nbTracker)
    });
    
    statusBar.registerStatusItem(
       'stashStatusBarButton',
       {
         item,
         align: 'left',
         rank: 900,
         isActive: () => {
           return true;
         }
       }
    );
  }
};

/**
 * A plugin providing a button located in the notebook
 * toolbar to stash selected cells.
 */
/*
const stashToolBarButton: JupyterFrontEndPlugin<void> = {
  id: 'stashToolBarButton',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (
    app: JupyterFrontEnd,
    panel: NotebookPanel,
    //context: DocumentRegistry.IContext<INotebookModel>
  ) => {
    createStashToolbarButton(panel);
  }
}; */

export default extension;

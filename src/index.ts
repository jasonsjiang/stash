import {
  ILabShell,
  JupyterFrontEndPlugin,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { IStatusBar } from '@jupyterlab/statusbar';
import { 
  INotebookTracker, 
  //NotebookPanel
 } from '@jupyterlab/notebook';
import { StashPanel } from './overlay/sidebar';
import { StashCells } from './overlay/statusbar'
//import { createStashToolbarButton } from './overlay/toolbar'
//import { SaveStash } from './persistence/save';
import '../style/index.css';
import { StashToolBarButton } from './overlay/toolbar';
//import { DocumentRegistry } from '@jupyterlab/docregistry';

/*
import {
  Widget
} from '@phosphor/widgets'; */

/**
 * Initialization data for the stash sidepanel.
 */
const panel: JupyterFrontEndPlugin<void> = {
  activate: activateStash,
  id: 'stash:stashPanel',
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

const stashStatusBarButton: JupyterFrontEndPlugin<void> = {
  id: 'stash:statusBarButton',
  autoStart: true,
  requires: [
    IStatusBar,
    INotebookTracker
  ],
  activate: (
    app: JupyterFrontEnd, 
    statusBar: IStatusBar,
    nbTracker: INotebookTracker
  ) => {
    // when button is clicked, stash current cells

    let item = new StashCells(nbTracker);
    
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
const stashToolBarButton: JupyterFrontEndPlugin<void> = {
  id: 'stash:ToolBarButton',
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
  ) => {
    app.docRegistry.addWidgetExtension('Notebook', new StashToolBarButton);
  }
}; 

const extension: JupyterFrontEndPlugin<any>[] = [
  panel,
  stashStatusBarButton,
  stashToolBarButton
]
export default extension;

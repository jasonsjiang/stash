import {
  ILabShell,
  JupyterFrontEnd,
  ILayoutRestorer,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';


import { INotebookTracker } from '@jupyterlab/notebook';
import { StashPanel } from './overlay/sidebar';
import '../style/index.css';

/*
import {
  Widget
} from '@phosphor/widgets'; */

/**
 * Initialization data for the stash extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'stash',
  autoStart: true,
  requires: [
    ILabShell,
    ILayoutRestorer,
    INotebookTracker
  ],
  activate: activateStash
};

function activateStash(
  app: JupyterFrontEnd,
  labShell: ILabShell,
) {
  const stash = new StashPanel();
  stash.title.iconClass = 's-Stash-icon jp-SideBar-tabIcon';
  stash.title.caption = 'Stash';
  stash.id = 'stash';

  labShell.add(stash, 'left', { rank: 700 });
}

export default extension;

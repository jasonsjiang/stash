import { ToolbarButton } from '@jupyterlab/apputils';

import { toArray } from '@phosphor/algorithm';

import { NotebookPanel } from '@jupyterlab/notebook';

const STASH_TOOLBAR_CLASS = 's-nbtoolbar-icon'

/*
export class StashButton extends ToolbarButton {
  constructor(
    name: string,
    props?: ToolbarButtonComponent.IProps
  ) {
    super(props);
    this._name = name;
  }

  private _name: string;
}
*/

/**
 * A button in the toolbar to stash cells.
 * @param panel 
 */
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

import React from 'react';

import { VDomRenderer, VDomModel } from '@jupyterlab/apputils';

import { GroupItem, IconItem, interactiveItem, TextItem } from '@jupyterlab/statusbar';


/**
 * A pure functional component for rendering stash status 
 * based on number of cells selected.
 */
function StashCellsComponent(
  props: StashCellsComponent.IProps
): React.ReactElement<StashCellsComponent.IProps> {
  return (
    <GroupItem spacing={4} onClick={props.handleClick}>
      <IconItem source={'s-statusbar-icon'} />
      <TextItem source={'Stash Cells'}/>
    </GroupItem>
  );
}

/**
 * A namespace for numCellsComponent statics.
 */
namespace StashCellsComponent {
  /**
   * The props for rendering the StashCellsComponent.
   */
  export interface IProps {
    handleClick: () => void;
    numSelected: number;
  }
}

/**
 * A VDomRenderer widget for displaying the stash status.
 */
export class StashCells extends VDomRenderer<StashCells.Model> {
  /**
   * Construct the stash status widget.
   */
  constructor(opts: StashCells.IOptions) {
    super();
    this._handleClick = opts.onClick;

    this.model = new StashCells.Model();
    this.addClass(interactiveItem);
  }

  /**
   * Render the kernel status item.
   */
  render() {
    if (!this.model) {
      return null;
    } else {
      return (
        <StashCellsComponent
          numSelected={this.model.numSelected}
          handleClick={this._handleClick}
        />
      );
    }
  }

  private _handleClick: () => void;
}

/**
 * A namespace for stashCells statics.
 */
export namespace StashCells {

  export class Model extends VDomModel {
    /**
     * Number of selected cells.
     */
    get numSelected(): number {
      return this._numSelected;
    }

    set numSelected(selected: number) {
      if (selected === this._numSelected) {
        return;
      }
      this._numSelected = selected;
    }

    private _numSelected: number = 0;
  }

  /**
   * Options for creating a stashCells object
   */
  export interface IOptions {

    selection: any;
    /**
     * A click handler which by default stashes
     * the selected cells.
     */
    onClick: () => void;
  }
}
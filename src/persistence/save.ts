// import { Cell, ICellModel } from '@jupyterlab/cells';
//import { StashPanel } from '../overlay/sidebar';
import { Cell } from '@jupyterlab/cells';
import { INotebookTracker } from '@jupyterlab/notebook';

//const STASH_DIRECTORY = '~/.stash'

export function CheckStash(tracker: INotebookTracker) {
    const panel = tracker.currentWidget;
    if (!panel) {
        return;
    }
    const notebook = panel.content;
    const cellsToStash = notebook.widgets.filter(
        cell => notebook.isSelectedOrActive(cell)
    );
    SaveStash(cellsToStash)
}

export function SaveStash(cells: Cell[]) {
    console.log("will save " + cells.length + " cells")
}

/*
if current panel != notebook
    don't save
if !selectedCells()
    don't run
if selectedCells():
    saveAll
*/
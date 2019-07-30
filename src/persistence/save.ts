// import { Cell, ICellModel } from '@jupyterlab/cells';
//import { StashPanel } from '../overlay/sidebar';
import { Cell } from '@jupyterlab/cells';
import { Notebook } from '@jupyterlab/notebook';

//const STASH_DIRECTORY = '~/.stash'

export function CheckStash(notebook: Notebook) {
    return notebook.widgets.filter(cell => notebook.isSelectedOrActive(cell)); 
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
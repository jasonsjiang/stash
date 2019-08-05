import { Widget, PanelLayout } from '@phosphor/widgets';
import { JSONObject } from '@phosphor/coreutils';
import { toArray } from '@phosphor/algorithm';
import { ContentsManager } from '@jupyterlab/services';
import { STASH_FILE_NAME, 
    StashArray
    //StashCellJSON 
} from '../persistence/manager'
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import CodeMirror from 'codemirror';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
import { Clipboard } from '@jupyterlab/apputils';

//import { Cell, ICellModel } from '@jupyterlab/cells';
//import { IDocumentManager } from '@jupyterlab/docmanager';

const STASH_CONTAINER_CLASS = "s-SideBar-stash-container";

const BUTTON_CONTAINER_CLASS = "s-StashSidePanel-toolbar";

const BUTTON_CLASS = "s-Stash-toolbar-button"

const ICON_CLASS = "s-Stash-toolbar-icon";

const TITLE_CONTAINER_CLASS = "s-StashSideBar-title-container"

const TITLE_CLASS = "s-StashSideBar-title-content";

//const STASH_CELL_CLASS = "s-Stash-cell"

/**
 * A widget that displays a stash
 */
export class StashPanel extends Widget {
    // TODO: ADD "SAVE" LISTENER TO STASH PANEL FOR DRAG N' DROP
    constructor() {
        super();
        this.addClass("s-StashSideBar");

        let header = this.buildToolbar();
        this.node.appendChild(header);

        let title = this.buildTitle();
        this.node.appendChild(title);

        this.buildStash();
    }

    /**
     * Builds button toolbar in the side panel.
     * TODO: Add event listeners to toggle between tabs or delete cells/log
     */
    private buildToolbar() {
        let toolbarContainer = document.createElement("div");
        toolbarContainer.classList.add(BUTTON_CONTAINER_CLASS);

        // add stash button in toolbar
        this.stashButton = document.createElement("div");
        this.stashButton.classList.add(BUTTON_CLASS, "s-stash-button");

        let stashButtonIcon = document.createElement("div");
        stashButtonIcon.classList.add("jp-Icon", ICON_CLASS, "s-toolbar-icon-stash");
        stashButtonIcon.setAttribute("title", "Stash");
        this.stashButton.appendChild(stashButtonIcon);

        this.stashButton.classList.add("active");
        toolbarContainer.appendChild(this.stashButton)

        // add trash button in toolbar
        this.trashButton = document.createElement("div");
        this.trashButton.classList.add(BUTTON_CLASS, "s-trash-button");
        this.trashButton.addEventListener('click', () => {
            this.deleteStash();
        });

        let trashButtonIcon = document.createElement("div");
        trashButtonIcon.classList.add("jp-Icon", ICON_CLASS, "s-toolbar-icon-trash");
        trashButtonIcon.setAttribute("title", "Empty Stash");
        this.trashButton.appendChild(trashButtonIcon);

        toolbarContainer.appendChild(this.trashButton);
        
        return toolbarContainer;
    }

    /**
     * Builds title in sidebar.
     * TODO: dynamically change title depending on tab in sidebar
     */
    private buildTitle() {
        let titleContainer = document.createElement("div");
        titleContainer.classList.add(TITLE_CONTAINER_CLASS);

        this.titleBox = document.createElement("div");
        this.titleBox.classList.add(TITLE_CLASS);
        this.titleBox.textContent = "Stash";
        titleContainer.appendChild(this.titleBox);

        return titleContainer;
    }

    /**
     * Creates stash.
     */
    private buildStash() {
        let contents = new ContentsManager();
        contents
            .get(STASH_FILE_NAME)
            .then(s => {
                this.stashBox = new Widget( {node: document.createElement("div") });
                this.stashBox.addClass(STASH_CONTAINER_CLASS); 
                this.stashBoxLayout = (this.stashBox.layout = new PanelLayout());
                if (s.content.length > 0) {
                    let file: [] = JSON.parse(s.content).stash;
                    for (let i = 0; i < file.length; i += 1) {
                        let loadC: StashCell = JSON.parse(file[i]);
                        this.fileStash.push(loadC);
                        this.currStashIDs.add(loadC.id);
                    }
                    this.fileStash = sortCells(this.fileStash);
                }
                this.fileStash = sortCells(this.fileStash);
                this.buildCells(this.fileStash.reverse());
                this.node.append(this.stashBox.node);
            })
    }

    /**
     * Builds cells in sidebar.
     */
    private buildCells(list: StashCell[]) {
        for (let cell of list) {
            let cmElement = document.createElement('div');
            let code = JSON.parse(cell.content).source;
            let cm = CodeMirror(cmElement, {
                value: code,
                mode: 'text/x-python',
                readOnly: 'nocursor',
                theme: 'cm-s-jupyter',
            });
            this.cmCells.add(cm);
            let cmWidget = new Widget( {node: cm.getWrapperElement()} );

            cmWidget.addClass('jp-Cell-inputarea');
            cmWidget.addClass('jp-InputArea-editor');
            cmWidget.node.style.cursor = 'default';

            let cellBox = new StashCellWidget(
                document.createElement('div'),
                cm,
                cell);
                /*
            cellBox.node.addEventListener('onclick', () => {
                this.cellBox;
            }) */
            cellBox.node.addEventListener('dblclick', () => {
                let file: StashArray;
                let cm = new ContentsManager();
                cm.get(STASH_FILE_NAME)
                    .then(s => {
                        let f = ((JSON.parse(s.content)).stash as string[]);
                        f = f.filter(entry => entry !== JSON.stringify(cellBox.cell));
                        console.log("after filter: " + f.length);
                        file = new StashArray(f);
                        console.log(file);
                    });
                    setTimeout(function() {
                        cm.save(STASH_FILE_NAME, file)
                    }, 1000)
                
                this.destash(cellBox);
            })
            cellBox.node.appendChild(cmWidget.node);
            this.stashBoxLayout.insertWidget(0, cellBox);
            this.refreshCodeMirror();
        }
    }

    public refreshCodeMirror() {
        setTimeout(function() {}, 1);
        let a = this.cmCells;
        for (let renderedCell of a) {
            renderedCell.refresh()
        }
    }

    /**
     * Checks if any cells are currently in stash.
     * If not, then cell is rendered in sidebar.
     */ 
    public updateStash(f: string[]) {
        //this.fromFile = f;
        let toRender: StashCell[] = [];
        for (let i = 0; i < f.length; i++ ) {
            let cell = (JSON.parse(f[i]) as StashCell);
            if (!this.currStashIDs.has(cell.id)) {
                this.currStashIDs.add(cell.id);
                toRender.push(cell);
            }
        }
        this.buildCells(toRender);
        this.refreshCodeMirror();
    }

    private deleteStash() {
        new ContentsManager()
            .save(STASH_FILE_NAME, new StashArray([]))
            .then(() => {
                console.log('trigger delete');
                toArray(this.stashBox.children()).forEach(w => {
                    w.dispose()
                    this.currStashIDs.clear();
                    this.cmCells.clear();
                })
            })
    }

    private destash(element: StashCellWidget) {
        const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';

        let currNotebook = this.nbTracker.currentWidget.content;
        //let selectedCell = currNotebook.activeCell;
        
        const clipboard = Clipboard.getInstance();
        if (clipboard.hasData(JUPYTER_CELL_MIME)) {
            window.alert("Please paste the cells in your clipboard before you stash!");
        } else {
            clipboard.clear();

            this.cmCells.delete(element.cm);
            this.fileStash = this.fileStash.filter(obj => obj !== element.cell);
            this.currStashIDs.delete(element.id);

            clipboard.setData(JUPYTER_CELL_MIME, [JSON.parse(element.cell.content)]);
            
            NotebookActions.paste(currNotebook, "below");
            clipboard.clear();
            element.dispose();
        }
    }
    
    fileStash: StashCell[] = [];
    cmCells: Set<CodeMirror.Editor> = new Set();
    nbTracker: INotebookTracker;

    private currStashIDs: Set<string> = new Set();
    private stashBoxLayout: PanelLayout;
    private stashBox: Widget;
    
    private stashButton: HTMLElement;
    private trashButton: HTMLElement;
    private titleBox: HTMLElement;

    /*

    private openStash() {}

    private openLog() {}

    private emptyStash() {}
    */
}

export class StashCellWidget extends Widget {
    
    constructor(node: HTMLDivElement, cm: CodeMirror.Editor, cell: StashCell) {
        super();
        this.cm = cm;
        this.cell = cell;
        this.addClass('p-Widget');
        this.addClass('s-Stash-cell-container');
    }

    cell: StashCell;
    cellBox: Widget;
    readonly cm: CodeMirror.Editor;
}

export interface StashCell {
    id: string;
    type: string;
    created: string;
    content: string;
    metadata: JSONObject;
}

export function sortCells(list: StashCell[]) {
    return list.sort((
        a: StashCell, b: StashCell
    ) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
    })
}
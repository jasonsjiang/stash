import { Widget, PanelLayout } from '@phosphor/widgets';
import { JSONObject } from '@phosphor/coreutils';
import { ContentsManager } from '@jupyterlab/services';
//import { JSONArray } from '@phosphor/coreutils';
import { STASH_FILE_NAME, 
    //StashCellJSON 
} from '../persistence/manager'
//import { JSONArray } from '@phosphor/coreutils';

import CodeMirror from 'codemirror';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';

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
        stashButtonIcon.classList.add(ICON_CLASS, "s-toolbar-icon-stash");
        stashButtonIcon.setAttribute("title", "Stash");
        this.stashButton.appendChild(stashButtonIcon);

        this.stashButton.classList.add("active");
        toolbarContainer.appendChild(this.stashButton)

        // add trash button in toolbar
        this.trashButton = document.createElement("div");
        this.trashButton.classList.add(BUTTON_CLASS, "s-trash-button");

        let trashButtonIcon = document.createElement("div");
        trashButtonIcon.classList.add(ICON_CLASS, "s-toolbar-icon-trash");
        trashButtonIcon.setAttribute("title", "Empty")
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
                if (s.content) {
                    let file: [] = JSON.parse(s.content).stash;
                    for (let i = 0; i < file.length; i += 1) {
                        let loadC: StashCell = JSON.parse(file[i]);
                        this.fileStash.push(loadC);
                        this.currStashIDs.add(loadC.id);
                    }
                    this.stashBox = new Widget( {node: document.createElement("div") });
                    this.stashBox.addClass(STASH_CONTAINER_CLASS); 
                    this.stashBoxLayout = (this.stashBox.layout = new PanelLayout());
                    this.fileStash = this.sortCells(this.fileStash);

                    this.buildCells(this.fileStash);
                }
                this.node.append(this.stashBox.node);
            })
    }

    /**
     * Builds cells in sidebar.
     */
    private buildCells(list: StashCell[], ) {
        for (let cell of list) {
            let cmElement = document.createElement('div');
            let cm = CodeMirror(cmElement, {
                value: cell.content,
                mode: 'python',
                readOnly: 'nocursor',
                theme: 'cm-s-jupyter',
            });
            this.cmCells.add(cm);

            let cmWidget = new Widget( {node: cm.getWrapperElement()} );

            cmWidget.addClass('jp-Cell-inputarea');
            cmWidget.addClass('jp-InputArea-editor');
            
            let cellBox = new Widget( {node: document.createElement('div')} );
            // add some styling/wrappers so that the cells aren't compact
            cellBox.node.appendChild(cmWidget.node);
            this.stashBoxLayout.insertWidget(0, cellBox);
        }
    }

    public refreshCodeMirror() {
        setTimeout(function() {
            console.log('pause')
        }, 1);
        let a = this.cmCells;
        for (let renderedCell of a) {
            renderedCell.refresh()
        }
    }
    /**
     * Checks if any cells are currently in stash.
     * If not, then 
     */ 
    public updateStash(f: string[]) {
        let toRender: StashCell[] = [];
        for (let i = 0; i < f.length; i++ ) {
            let cell = (JSON.parse(f[i]) as StashCell);
            if (!this.currStashIDs.has(cell.id)) {
                this.currStashIDs.add(cell.id);
                toRender.push(cell);
            }
        }
        toRender = this.sortCells(toRender);
        console.log(toRender);
        this.buildCells(toRender);
        this.refreshCodeMirror();
    }

    private sortCells(list: StashCell[]) {
        return list.sort((
            a: StashCell, b: StashCell
        ) => {
            return new Date(b.created).getTime() - new Date(a.created).getTime();
        })
    }

    private currStashIDs: Set<string> = new Set();
    private stashBoxLayout: PanelLayout;
    private stashBox: Widget;
    fileStash: StashCell[] = [];
    cmCells: Set<CodeMirror.Editor> = new Set();
    private stashButton: HTMLElement;
    private trashButton: HTMLElement;
    private titleBox: HTMLElement;
    /*
    private update() {}

    private openStash() {}

    private openLog() {}

    private emptyStash() {}
    */
}

export interface StashCell {
    id: string;
    type: string;
    created: string;
    content: string;
    metadata: JSONObject;
}
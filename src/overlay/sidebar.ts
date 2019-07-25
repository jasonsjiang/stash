import { Widget } from '@phosphor/widgets';

//import { Cell, ICellModel } from '@jupyterlab/cells';
//import { IDocumentManager } from '@jupyterlab/docmanager';

const STASH_CONTAINER_CLASS = "s-SideBar-stash-container";

const BUTTON_CONTAINER_CLASS = "s-StashSidePanel-toolbar";

const BUTTON_CLASS = "s-Stash-toolbar-button"

const ICON_CLASS = "s-Stash-toolbar-icon";

const TITLE_CONTAINER_CLASS = "s-StashSideBar-title-container"

const TITLE_CLASS = "s-StashSideBar-title-content";

/**
 * A widget that displays a stash
 */
export class StashPanel extends Widget {
    readonly stashBox: HTMLElement;
    //private stashTabBox: HTMLElement;
    private stashButton: HTMLElement;
    private trashButton: HTMLElement;
    private titleBox: HTMLElement;

    // TODO: ADD "SAVE" LISTENER TO STASH PANEL FOR DRAG N' DROP
    constructor() {
        super();
        this.addClass("s-StashSideBar");

        let header = this._buildToolbar();
        this.node.appendChild(header);

        let title = this._buildTitle();
        this.node.appendChild(title);

        this.stashBox = document.createElement("div");
        this.stashBox.classList.add(STASH_CONTAINER_CLASS);
        this.node.appendChild(this.stashBox);
    }

    /**
     * Builds button toolbar in the side panel.
     * TODO: Add event listeners to toggle between tabs or delete cells/log
     */
    private _buildToolbar() {
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
    private _buildTitle() {
        let titleContainer = document.createElement("div");
        titleContainer.classList.add(TITLE_CONTAINER_CLASS);

        this.titleBox = document.createElement("div");
        this.titleBox.classList.add(TITLE_CLASS);
        this.titleBox.textContent = "Stash";
        titleContainer.appendChild(this.titleBox);

        return titleContainer;
    }

    /*
    private openStash() {}

    private openLog() {}

    private emptyStash() {}
    */
}

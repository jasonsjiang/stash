import { NotebookPanel } from '@jupyterlab/notebook';
import { ContentsManager } from '@jupyterlab/services';
import { Cell, ICellModel } from '@jupyterlab/cells';
import { JSONObject, JSONArray } from '@phosphor/coreutils';
import { Contents } from '@jupyterlab/services'

export const STASH_FILE_NAME = '.stash'

export class SaveStash {
    constructor(nbPanel: NotebookPanel) {
        this.stashTime = new Date();
        this.nbPanel = nbPanel;
    }

    get fromFile() {
        return this._fromFile;
    }

    set fromFile(newStash: JSONArray) {
        this._fromFile = newStash;
    }

    public stashSelection() {
        let notebook = this.nbPanel.content;

        // only stash selected code cells (for now)
        let cells = notebook.widgets.filter(
            cell => notebook.isSelectedOrActive(cell)
        )
        .filter(c => c.model.type == 'code'); 
        
        let stashContent: JSONArray = [];
        for (let cell of cells) {
            let stashCell = new StashSaveModel(cell, this.stashTime, STASH_FILE_NAME);
            stashContent.push(stashCell.content);
        }

        this.toStash = stashContent;

        if (this._fromFile) {
            this.aggregate()
        }
        console.log("selected + already stashed: " + this.toStash);
        this.writeToStash(new StashArray(this.toStash));
    }

    private writeToStash(
        toStash: StashArray
    ): Promise<void> {
        return new Promise((accept, reject) => {
            let contents = new ContentsManager();
            contents.save(STASH_FILE_NAME, toStash)
                .then(() => {
                    console.log("Written to ", STASH_FILE_NAME);
                    accept();
                })
        });
    }

    private aggregate() {
        this._fromFile.concat(this.toStash)
    }

    private _fromFile: JSONArray;
    private toStash: JSONArray;
    readonly stashTime: Date;
    readonly nbPanel: NotebookPanel;
}

export interface StashCellJSON extends JSONObject {
    name: string;
    path: string;
    created: string;
    last_modified: string;
    content: any;
}

class StashArray implements Contents.IModel {
    constructor(contentArray: JSONArray) {
        this.name = "StashArray";
        this.path = STASH_FILE_NAME;
        this.created = new Date().toISOString();
        this.last_modified = this.created;

        let contentJSON = new Object(null) as JSONObject;
        contentJSON.stash = contentArray
        this.content = JSON.stringify(contentJSON);
    }
    readonly type: Contents.ContentType = "file";
    readonly writable: boolean = true;
    readonly mimetype: string = "application/json";
    readonly format: Contents.FileFormat = "text";

    readonly name: string;
    readonly path: string;
    readonly created: string;
    readonly last_modified: string;
    public content: string;
} 

export class StashSaveModel implements Contents.IModel {
    constructor(
        cell: Cell,
        createDate: Date,
        nbPath: string
    ) {
        this.cell = cell.model;
        this.name = cell.model.id;
        this.created = createDate.toISOString();
        this.last_modified = '';
        this.path = nbPath;  
        this.metadata = cell.model.metadata.toJSON();

        let contentJSON = new Object(null) as JSONObject;
        contentJSON.id = this.name;
        contentJSON.type = this.cell.type;
        contentJSON.created = this.created;
        contentJSON.content = this.cell.value.text;
        contentJSON.metadata = this.metadata;
        this.content = JSON.stringify(contentJSON);
    }
    
    toJSON(): StashCellJSON {
        let json = new Object(null) as StashCellJSON;
        json.name = this.name;
        json.path = this.path;
        json.created = this.created
        json.last_modified = this.last_modified;
        json.content = this.content
        return json;
    }
    readonly type: Contents.ContentType = "file";
    readonly writable: boolean = true;
    readonly mimetype: string = "text/plain";
    readonly format: Contents.FileFormat = "text";
    
    readonly metadata: JSONObject;
    readonly cell: ICellModel;
    // for contentmanager to save to a file
    readonly name: string;
    readonly path: string;
    readonly created: string;
    readonly last_modified: string;
    readonly content: string;
}

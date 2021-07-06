import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FruitService } from '../service/fruit.service';

/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(public item: Model, public level = 1, public expandable = false,
    public isLoading = false, public more = false) { }
}

export interface Model {
  name: string, id: number
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({ providedIn: 'root' })
export class DynamicDatabase {
  dataMap = new Map<Model, Model[]>([]);

  getChildren(node: Model): Model[] | undefined {
    //search by string and provide array
    for (let key of this.dataMap.entries()) {
      if (key[0].name == node.name) {
        return key[1];
      }
    }
    return [];
    //return this.dataMap.get(node);
  }

  isExpandable(node: Model): boolean {
    for (let key of this.dataMap.entries()) {
      if (key[0].name == node.name)
        return true;
    }
    return false;
    //return this.dataMap.has(node);
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class DynamicDataSource implements DataSource<DynamicFlatNode> {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase, private fruitService: FruitService) { }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void { }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    // const children = this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (index < 0) { // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    if (expand) {
      let nodes = null;
      switch (node.level) {
        case 0:
          this.fruitService.getVitamins(node.item.id)
            .subscribe(data => {
              nodes = data.map(n => {
                return new DynamicFlatNode(
                  { name: n.name, id: n.id },
                  node.level + 1,
                  true
                );
              })
              this.refreshTree(index, nodes);
              node.isLoading = false;
            });
          if (nodes)
            this.data.splice(index + 1, 0, ...nodes);
          break;
        case 1:
          this.fruitService.getFruits(node.item.id)
            .subscribe(data => {
              nodes = data.map(n => {
                return new DynamicFlatNode(
                  { name: n.name, id: n.id },
                  node.level + 1,
                  true
                )
              })
              this.refreshTree(index, nodes);
              node.isLoading = false;
            });
          if (nodes)
            this.data.splice(index + 1, 0, ...nodes);
          break;
      }
    } else {
      let count = 0;
      for (let i = index + 1; i < this.data.length
        && this.data[i].level > node.level; i++, count++) { }
      this.data.splice(index + 1, count);
    }

    // notify the change
    this.dataChange.next(this.data);
    node.isLoading = false;
  }

  private refreshTree(index, nodes) {
    this.data.splice(index + 1, 0, ...nodes);
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with dynamic data
 */
@Component({
  selector: 'app-tree-component',
  templateUrl: 'tree-component.component.html',
  styleUrls: ['tree-component.component.css']
})
export class TreeComponentComponent {

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;

  constructor(database: DynamicDatabase, private fruitService: FruitService) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(
      this.treeControl, database, this.fruitService);

    //initialize data.
    this.fruitService.getInitialData()
      .subscribe(all => {
        this.dataSource.data = all.map(data => new DynamicFlatNode(data, 0, true));
      }
      );
  }

  getLevel = (node: DynamicFlatNode) => {
    return node.level;
  }

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}

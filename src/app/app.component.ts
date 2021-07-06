import {FlatTreeControl} from '@angular/cdk/tree';
import {Component} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { VitsService } from './service/vits.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
  id: number
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Den Main Terminal',
    id: 1,
    children: [
      {name: 'loading..', children: [], id: 0}
    ]
  }, {
    name: 'Vegetables',
    id: 2,
    children: [
      {name: 'loading..', children: [], id: 0}
    ]
      // {
      //   name: 'Green',
      //   children: [
      //     {name: 'Broccoli'},
      //     {name: 'Brussels sprouts'},
      //   ]
      // }, {
      //   name: 'Orange',
      //   children: [
      //     {name: 'Pumpkins'},
      //     {name: 'Carrots'},
      //   ]
      // },
    //]
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  lastData = null;

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private vitsService: VitsService) {
    this.dataSource.data = TREE_DATA;
  }

  async populate(node) {
    switch(node.level) {
      case 0: 
        //get id
        let site = this.dataSource.data.find( name => name.name == node.name);
        let selected = await this.vitsService.getVits(site.id);
        let vits = [];
        selected.forEach( v => {
          vits.push({
            name: v.name,
            children: [
              {name: "loading..", children: []}
            ]
          });
        });

        let data = this.dataSource.data;
        data[0].children = vits;
        this.lastData = data;
        this.dataSource.data = data;
        this.dataSource.data = null;
        this.dataSource.data = data;
        break;
      case 1: 
        //get id
        console.log('here');
        this.dataSource.data[0].children[0] = [
          {name: "loading......", id: 0, children: []}
        ];
    }

  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
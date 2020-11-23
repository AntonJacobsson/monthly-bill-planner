import {DialogController} from 'aurelia-dialog';
import {inject } from 'aurelia-framework';
import { Planning } from 'models/planning';

@inject(DialogController)
export class PlanningModal {
    public controller: DialogController;
    public planning: Planning;
    public name: string;

    constructor(controller: DialogController){
      this.controller = controller;
    }

    public activate(planning: Planning){
        this.planning = planning;
        this.name = this.planning.name;
    }

    public edit() {
        this.planning.name = this.name
        this.controller.ok(this.planning);
    }

    public delete() {
        if(this.planning.key !== 0) {
            this.controller.ok(this.planning.key);
        }
    }

}
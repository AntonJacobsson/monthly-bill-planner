import { BillModal } from '../../components/bill-modal';
import { PlanningModal } from '../../components/planning-modal';
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';
import { DeletePrompt } from 'components/delete-prompt';
import { LanguageService } from 'services/language-service';
import { Planning, PlanningRequest } from 'models/planning';
import { I18N } from 'aurelia-i18n';

@inject(DialogService, BillService, LanguageService, I18N)

export class BillHandler {
  public bills: Bill[] = [];
  public plannings: Planning[] = [];
  public dialogService: DialogService;
  private _billService: BillService;
  public currentPlanning: Planning;

  constructor(dialogService: DialogService, billService: BillService, private _languageService: LanguageService, private _i18n: I18N) {
    this._billService = billService;
    this.dialogService = dialogService;
  }

  public activate(): void {

    window.scroll({
      top: 0,
      behavior: 'auto'
    });

    this.plannings = this._billService.getPlannings();
    if (this._billService.currentPlanningId === undefined) {
      this.currentPlanning = this.plannings[0];
    } else {
      this.currentPlanning = this.plannings.find(x => x.key == this._billService.currentPlanningId);
    }
    this.bills = this._billService.getBillsByPlanning(this.currentPlanning);
  }

  public submit(): void {
    this.dialogService.open({ viewModel: BillModal, model: null, lock: false }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        let createdBill = this._billService.createBill(response.output)
        this.bills.push(createdBill);
      }
    });
  }

  public openDeletePrompt(bill: Bill): void {
    navigator.vibrate(50);
    this.dialogService.open({ viewModel: DeletePrompt, model: bill, lock: false }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        this.deleteBill(response.output);
      }
    });
  }

  public deleteBill(bill: Bill): void {
    this._billService.deleteBill(bill);
    this.bills = this.bills.filter(x => x !== bill);
  }

  public edit(bill: Bill): void {
    this.dialogService.open({ viewModel: BillModal, model: bill, lock: false }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        this._billService.updateBill(response.output);
      }
    });
  }

  public formatFromTomDateString(startDate: string, endDate: string): string {

    let locale = this._languageService.getLanguage();
    let start = new Date(startDate);

    let options = { year: 'numeric', month: 'short', day: 'numeric' };

    let dateString = start.toLocaleString(locale, options);

    if (endDate !== undefined && endDate !== "") {
      let end = new Date(endDate).toLocaleString(locale, options);

      dateString = dateString + " - " + end

    }
    return dateString
  }

  public addPlanning(): void {
    let name = this._i18n.tr("new");

    let planning: PlanningRequest = {
      name: name,
    };
    let result = this._billService.createPlanning(planning);
    this.plannings.push(result);
  }

  public selectPlanning(planning: Planning): void {
    this.currentPlanning = planning;
    this.bills = this._billService.getBillsByPlanning(this.currentPlanning);
  }

  public editPlanning(planning: Planning): void {
    navigator.vibrate(50);
    this.dialogService.open({ viewModel: PlanningModal, model: planning, lock: false }).whenClosed((response: { wasCancelled: any; output: any; }) => {
      if (!response.wasCancelled) {
        if (response.output.name != undefined) {
          this._billService.updatePlanning(response.output);
        } else {
          this._billService.deletePlanning(response.output);
          this.plannings = this._billService.getPlannings();

          if(this.currentPlanning.key == response.output) {
            this.currentPlanning = this.plannings[0];
          }
          this.bills = this._billService.getBillsByPlanning(this.currentPlanning);
        }
      }
    });
  }

  public deactivate(): void {
    this.dialogService.closeAll();
  }

}
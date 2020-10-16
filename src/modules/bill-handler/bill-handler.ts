import { BillModal } from '../../components/bill-modal';
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';
import { DeletePrompt } from 'components/delete-prompt';
import { LanguageService } from 'services/language-service';

@inject(DialogService, BillService, LanguageService)

export class BillHandler {
  public bills: Bill[] = [];
  public dialogService: DialogService;
  private _billService: BillService

  constructor(dialogService: DialogService, billService: BillService, private _languageService: LanguageService) {
    this._billService = billService;
    this.dialogService = dialogService;
  }

  activate() {
    this.bills = this._billService.getBills();
  }

  submit() {
    this.dialogService.open({ viewModel: BillModal, model: null, lock: false }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        var createdBill = this._billService.createBill(response.output)
        this.bills.push(createdBill);
      }
    });
  }

  openDeletePrompt(bill: Bill) {
    this.dialogService.open({ viewModel: DeletePrompt, model: bill , lock: false}).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        this.deleteBill(response.output);
      }
    });
  }

  deleteBill(bill: Bill) {
    this._billService.deleteBill(bill);
    this.bills = this.bills.filter(x => x !== bill);
  }

  edit(bill: Bill) {
    this.dialogService.open({ viewModel: BillModal, model: bill , lock: false}).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        this._billService.updateBill(response.output);
      }
    });
  }

  formatFromTomDateString(startDate: string, endDate: string) {

    var locale = this._languageService.getLanguage();
    var start = new Date(startDate);

    let options = {year: 'numeric', month: 'short', day: 'numeric' };
    
    var dateString = start.toLocaleString(locale, options);
    
    if(endDate !== undefined && endDate !== "") {
      var end = new Date(endDate).toLocaleString(locale, options);

      dateString = dateString + " - " + end

    } 
    return dateString
    
  }

}
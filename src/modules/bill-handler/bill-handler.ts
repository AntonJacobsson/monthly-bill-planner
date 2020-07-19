import { BillModal } from '../../components/bill-modal';
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';
import { DeletePrompt } from 'components/delete-prompt';

@inject(DialogService, BillService)

export class BillHandler {
  public bills: Bill[] = [];
  public dialogService: DialogService;
  private _billService: BillService

  constructor(dialogService: DialogService, billService: BillService) {
    this._billService = billService;
    this.dialogService = dialogService;
  }

  activate() {
    this.bills = this._billService.getBills();
  }

  submit() {
    this.dialogService.open({ viewModel: BillModal, model: null }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        var createdBill = this._billService.createBill(response.output)
        this.bills.push(createdBill);
      }
    });
  }

  openDeletePrompt(bill: Bill) {
    this.dialogService.open({ viewModel: DeletePrompt, model: bill }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
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
    this.dialogService.open({ viewModel: BillModal, model: bill }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        this._billService.updateBill(response.output);
      }
    });
  }
}
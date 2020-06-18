import { BillModal } from '../../components/bill-modal';
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';

@inject(DialogService, BillService)

export class BillHandler {
  public bills: Bill[] = [];
  public dialogService: DialogService;
  private _billService: BillService

  constructor(dialogService: DialogService, billService: BillService) {
    this._billService = billService;
    this.bills = this._billService.getBills();
    this.dialogService = dialogService;
  }

  submit() {
    this.dialogService.open({ viewModel: BillModal, model: null }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        this._billService.createBill(response.output)
      } else {

      }
    });
  }

  deleteBill(bill: Bill) {
    this.bills = this.bills.filter(x => x !== bill);
  }

  edit(bill: Bill) {
    this.dialogService.open({ viewModel: BillModal, model: bill }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        bill.name = response.output.name;
        bill.newBill = response.output.newBill;
        bill.payPeriod = response.output.payPeriod;
        bill.payStartMonth = response.output.payStartMonth;
        bill.totalCost = response.output.totalCost;
      } else {

      }
    });
  }
}
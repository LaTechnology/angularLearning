import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from 'app/model-popup/confirmation-popup/confirmation-popup.component';
import { UtilService } from 'app/services/util.service';

@Component({
  selector: 'app-client-landing',
  templateUrl: './client-landing.component.html',
  styleUrl: './client-landing.component.scss',
})
export class ClientLandingComponent {
  probationDataColumns: string[] = [
    'select',
    'name',
    'phone',
    'email',
    'address',
    'action',
  ];

  userList = new MatTableDataSource<any>();
  userCount: number = 0;
  isDataLoading: boolean = false;
  selectedIndex: any = -1;

  clientSelection = new SelectionModel<any>(true, []);
  tableSearch: any = '';

  data: any[] = [
    {
      first_name: 'dsfghj',
      last_name: 'sdfgh',
      phone: '+918977878787',
      mail: 'gfhgfh@gmail.com',
      address_line1: 'etereretet',
      address_line2: 'fgfhfhfhfh',
      country: 'Afghanistan',
      state: 'Badghis',
      city: 'Ghormach',
      pin_code: '4567890',
    },
  ];

  constructor(public _util: UtilService, private _dialog: MatDialog,private router: Router) {}

  // search
  liveSearchCurrentlyOt(event: any) {
    this.tableSearch = event;
  }

  //clientSelection
  isAllEmployeeSelected(): boolean {
    const check = this.userList.data.every((element) =>
      this.clientSelection.selected.includes(element)
    );
    return check;
  }

  selectAllEmployee() {
    if (this.isAllEmployeeSelected()) {
      this.clientSelection.clear();
      return;
    } else {
      this.userList.data.forEach((row: any) =>
        this.clientSelection.select(row)
      );
    }
  }

  ngOnInit() {
    this.userList.data = this.data;
  }

  toggleRightPanel(userAction: string, item?: any, i?: any) {
    this.selectedIndex = i;
    if (userAction == 'edit') {
      this.router.navigate(['/client/edit']);
    }
    if (userAction === 'create') {
      this.router.navigate(['/client/add']);
    }
  }

  deletePlan(i: number, item: any) {
    if (this.userList.data.length > 1) {
      this._dialog
        .open(ConfirmationPopupComponent, {
          width: '400px',
          data: {
            action: {
              title: 'Requires Confirmation!',
              body: 'Are you sure you would like to delete this user?',
              img: 'assets/images/icons/error-confirmation.svg',
              cancelButton: true,
            },
          },
        })
        .afterClosed()
        .subscribe((res: any) => {
          if (res) {
            this.deleteUser(item.id, i);
          }
        });
    } else {
      this._dialog.open(ConfirmationPopupComponent, {
        width: '400px',
        data: {
          action: {
            title: 'Requires Confirmation!',
            body: 'Please maintain at least one User',
            img: 'assets/images/icons/error-confirmation.svg',
            saveText: 'Got It',
            cancelButton: false,
          },
        },
      });
    }
  }

  deleteUser(id: any, i: any) {
    const updatedData = [...this.userList.data]; 
    updatedData.splice(i, 1);
    this.userList.data = updatedData;
    this._util.snackNotification(
      'success',
      'Hurray!!',
      'User deleted successfully'
    );
  }
}

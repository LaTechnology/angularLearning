import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from 'app/model-popup/confirmation-popup/confirmation-popup.component';
import { ClientService } from 'app/services/client.service';
import { SessionStorageService } from 'app/services/session-storage.service';
import { UtilService } from 'app/services/util.service';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
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
  
    data: any[] = [];
  
    constructor(public _util: UtilService, private _dialog: MatDialog,private router: Router,public _client:ClientService,public _session:SessionStorageService) {}
  
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
      this.getClientList();
      this._client.trigger$.subscribe(() => {
        this.getClientList();
      });
    }
  
    toggleRightPanel(userAction: string, item?: any, i?: any) {
      this.selectedIndex = i;
      if (userAction == 'edit') {
        this._session.setItem('clientID', item.id);
        const id = this._session.getItem('clientID');
        this.router.navigate([`/client/edit/${id}`]);
      }
      if (userAction === 'create') {
        this.router.navigate(['/client/add']);
      } else if (userAction === 'bulk') {
        const idList = this.clientSelection.selected.map((item: any) => item.id);
        this._session.setItem('clientIDList', idList);
        this.router.navigate(['/client/bulk-upload']);
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

    getClientList() {
        this._client?.getAllClients()?.subscribe({
          next: (res: any) => {
            this.userList.data = res;
          },
          error: (err: HttpErrorResponse) => {},
          complete: () => {
           
          }
        });
      }
  
    deleteUser(id: any, i: any) {
      this._client?.deleteClient(id)?.subscribe({
        next: (res: any) => {
        },
        error: (err: HttpErrorResponse) => {},
        complete: () => {
          this._util.snackNotification('success','Hurray!!','User deleted successfully');
          this.getClientList();
        }
      });
      
      
    }

}

import { Component, ViewChild } from '@angular/core';
import { UserRoleService } from '../models/user-role.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { BulkEditDialogComponent } from '../bulk-edit-dialog/bulk-edit-dialog.component';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrl: './list-role.component.scss'
})
export class ListRoleComponent {

  searchQuery: string = '';
  users: any[] = [];
  paginatedUsers: any[] = [];
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userRoleService: UserRoleService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.updatePagination();
      });
    }
  }

  getUsers(): void {
    this.userRoleService.getRole().subscribe({
      next: (data) => {
        this.users = data;
        this.updatePagination();
        console.log('users:', this.users);
      },
      error: (error) => {
        console.error('Error userdata:', error);
      }
    });
  }

  filteredUsers(): any[] {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  updatePagination(): void {
    const filtered = this.filteredUsers();
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedUsers = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.updatePagination();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  editRole(id: string) {
    this.router.navigate(['role/edit', id]);
  }

  addRole() {
    this.router.navigate(['addrole']);
  }

  deleteUser(id: string): void {
    this.deleteRole(id);
  }

  deleteRole(id: string): void {
    this.userRoleService.deleteRole(id).subscribe(
      () => {
        alert('Data deleted successfully');
        this.getUsers();
      },
      (error) => {
        console.error('Error deleting role', error);
        alert('Error deleting data');
      }
    );
  }

  openDeleteDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(id);
      }
    });
  }

  bulkEdit(): void {
    const selectedUsers = this.selectedUsers();
    if (selectedUsers.length === 0) {
      alert("No users selected!");
      return;
    }

    this.dialog.open(BulkEditDialogComponent, {
      width: '400px',
      data: { users: selectedUsers }
    }).afterClosed().subscribe((updatedRoles: string[]) => {
      if (updatedRoles) {
        selectedUsers.forEach((user: any) => {
          user.selectedRoles = updatedRoles;
        });
      }
    });
  }

  selectedUsers(): any[] {
    return this.paginatedUsers.filter(user => user.selected);
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.paginatedUsers.forEach(user => (user.selected = isChecked));
  }

  isAnyUserSelected(): boolean {
    return this.paginatedUsers.some(user => user.selected);
  }

}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRoleService } from '../models/user-role.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrl: './update-role.component.scss'
})
export class UpdateRoleComponent {

  userForm!: FormGroup;
  userId: string = '';
  user: any;
  newRoles: string[] = ['Admin', 'General', 'Inventory', 'Orders'];

  constructor(
    private fb: FormBuilder,
    private userRoleService: UserRoleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      roles: this.fb.array([], Validators.required)
    });

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id')!;
      this.fetchUserData();
    });
  }

  fetchUserData(): void {
    this.userRoleService.getUserById(this.userId).subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
  }

  onRoleChange(event: any, role: string): void {
    const rolesArray = this.userForm.get('roles') as FormArray;

    if (event.target.checked) {
      rolesArray.push(new FormControl(role));
    } else {
      const index = rolesArray.controls.findIndex(x => x.value === role);
      rolesArray.removeAt(index);
    }

    this.userForm.markAsDirty();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      alert('Please select at least one role.');
      return;
    }

    const updatedUser = {
      name: this.user.name,
      email: this.user.email,
      selectedRoles: this.userForm.value.roles
    };

    this.userRoleService.updateUserRoles(this.userId, updatedUser).subscribe(
      response => {
        console.log('User roles updated successfully:', response);
        alert('User roles updated successfully!');
        this.router.navigate(['/role']);
      },
      error => {
        console.error('Error updating user:', error);
        alert('Failed to update user roles. Please try again.');
      }
    );
  }

  viewRoles() {
    this.router.navigate(['/role']);
  }

}

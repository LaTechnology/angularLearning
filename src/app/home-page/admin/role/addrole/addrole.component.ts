import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User, Data } from '../models/model';
import { UserRoleService } from '../models/user-role.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrl: './addrole.component.scss'
})
export class AddroleComponent {

  userId: string = '';
  user: any;

  userForm!: FormGroup;
  roles: string[] = [];
  names: string[] = [];
  emails: { [key: string]: string } = {};

  constructor(private fb: FormBuilder, private http: HttpClient, private userRoleService: UserRoleService, private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id')!;
      this.fetchUserData();
    });
   
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      selectedRoles: this.fb.array([], Validators.required)
    });


    this.loadData().subscribe((data: Data) => {
      console.log('Fetched data:', data);
      this.roles = data.roles;


      data.users.forEach((user: User) => {
        this.names.push(user.name);
        this.emails[user.name] = user.email;
      });

      const savedEmail = sessionStorage.getItem('userEmail');
      if (savedEmail) {
        this.userForm.patchValue({ email: savedEmail });
      }
    });

    this.userForm.get('name')?.valueChanges.subscribe((selectedName) => {
      if (selectedName && this.emails[selectedName]) {
        const selectedEmail = this.emails[selectedName];

        this.userForm.patchValue({ email: selectedEmail });
      }
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

  loadData(): Observable<Data> {
    return this.http.get<Data>('assets/model.json');
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      this.userRoleService.saveUserRole(formData).subscribe({
        next: (response) => {
          console.log('data', response);
          alert('UserRole successfully submitted!');
          this.router.navigate(['/listrole']);
        },
        error: (error) => {
          console.error('Error submitting form data:', error);
          alert('Failed to submit. Please try again.');
        }
      });
    }
  }

  viewRoles() {
    this.router.navigate(['/listrole'])
  }

  get selectedRoles(): FormArray {
    return this.userForm.get('selectedRoles') as FormArray;
  }

  onRoleChange(event: any, role: string): void {
    if (event.target.checked) {
      this.selectedRoles.push(this.fb.control(role));
    } else {
      const index = this.selectedRoles.controls.findIndex(ctrl => ctrl.value === role);
      if (index !== -1) {
        this.selectedRoles.removeAt(index);
      }
    }
  }
}

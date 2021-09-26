import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'cdk-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public profileForm: FormGroup;
  submitted = false;
  hide=true;
  constructor(public form: FormBuilder, public authService: AuthService, private _router: Router, private snack: MatSnackBar) {
    this.profileForm = this.form.group({
      username: ['', Validators.required],
      pwd: ['', Validators.required]
    });

  }
  get username() {
    return this.profileForm.get('username');
  }
  get pwd() {
    return this.profileForm.get('pwd');
  }
  // checkUserExists() {


  //         this.profileForm.value.userName.setErrors({ userExists: `User Name  already exists` });

  // }
  onSubmit() {
    this.submitted = true;
    let userName = this.username.value;
    let password = this.pwd.value;
    if (this.profileForm.valid) {
      this.authService.login(userName, password).subscribe((res: any) => {
        if (res.status === 1) {
          console.log(res.data);
          this.authService.setAuthData(res.data);
          localStorage.setItem('auth_token', res.data.access_token);
          this._router.navigate(['admin/dashboard']);
          this.submitted = true;
        }
        else{
          this.submitted = false;
          this.snack.open(res.message, "Đóng")
        }
      })
    }
    else{
      this.submitted = false;
    }
  }
  ngOnInit() {
  }

}

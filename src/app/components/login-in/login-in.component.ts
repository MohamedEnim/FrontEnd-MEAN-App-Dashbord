import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-in',
  templateUrl: './login-in.component.html',
  styleUrls: ['./login-in.component.css']
})
export class LoginInComponent implements OnInit {

 
  @ViewChild('loginForm') loginForm: NgForm;
  inputEmail: string;
  inputPassword: string;
  public loginInvalid = false;

  constructor(private route: ActivatedRoute, private router: Router, private authSErv: AuthService) { }

  ngOnInit() {
  
  }

   onSubmit() {
   // this.loginInvalid = false;
  
   
   //   try {
   
        this.authSErv.login(this.inputEmail, this.inputPassword).subscribe((res) => {
         
          this.authSErv.onNavigateToAllMovies();
        });

       
   //   } catch (err) {
    //    this.loginInvalid = true;
    //  }
   
  }

}

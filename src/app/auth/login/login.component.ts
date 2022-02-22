import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }
  onLogin(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    this.isLoading = false;
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}

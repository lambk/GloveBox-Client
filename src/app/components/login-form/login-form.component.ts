import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { AlertType, SubmitEvent } from 'src/app/constants';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() submitSubject: Subject<void>;
  @Output() submitEvent = new EventEmitter<SubmitEvent>();

  @ViewChild(NgForm) loginForm;
  public data: any = {};
  public disableForm = false;

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.submitSubject.subscribe(() => this.submit());
  }

  submit(): void {
    this.loginForm.submitted = true;
    this.loginForm.form.markAsPristine(); // Necessary to remove invalid styling once  the user starts modifying
    if (this.loginForm.invalid) { return; }
    this.onSubmitStart();
    this.authService.login(this.data).subscribe((response) => {
      this.router.navigate(['/']);
    }, (err) => {
      const error = err.status !== 0 ? err.error : `Service error (Status code: ${err.status})`;
      this.alertService.sendAlert({
        message: error,
        type: AlertType.ERROR
      });
    }).add(() => this.onSubmitEnd());
  }

  private onSubmitStart(): void {
    this.disableForm = true;
    this.submitEvent.emit(SubmitEvent.START);
  }

  private onSubmitEnd(): void {
    this.disableForm = false;
    this.submitEvent.emit(SubmitEvent.END);
  }
}

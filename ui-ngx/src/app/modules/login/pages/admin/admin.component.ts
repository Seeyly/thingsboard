import {Component, OnInit} from '@angular/core';
import {OAuth2ClientInfo} from '@shared/models/oauth2.models';
import {Store} from '@ngrx/store';
import {AppState} from '@core/core.state';
import {AuthService} from '@core/auth/auth.service';
import {UntypedFormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Constants} from '@shared/models/constants';
import {PageComponent} from '@shared/components/page.component';

@Component({
  selector: 'tb-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent  extends PageComponent implements OnInit{
  loginFormGroup = this.fb.group({
    username: '',
    password: ''
  });
  oauth2Clients: Array<OAuth2ClientInfo> = null;

  constructor(protected store: Store<AppState>,
              private authService: AuthService,
              public fb: UntypedFormBuilder,
              private router: Router) {
    super(store);
  }

  ngOnInit() {
    this.oauth2Clients = this.authService.oauth2Clients;
  }

  login(): void {
    if (this.loginFormGroup.valid) {
      this.authService.login(this.loginFormGroup.value).subscribe(
        () => {
          // this.router.navigateByUrl("bim")
        },
        (error: HttpErrorResponse) => {
          if (error && error.error && error.error.errorCode) {
            if (error.error.errorCode === Constants.serverErrorCode.credentialsExpired) {
              this.router.navigateByUrl(`login/resetExpiredPassword?resetToken=${error.error.resetToken}`);
            }
          }
        }
      );
    } else {
      Object.keys(this.loginFormGroup.controls).forEach(field => {
        const control = this.loginFormGroup.get(field);
        control.markAsTouched({onlySelf: true});
      });
    }
  }

  getOAuth2Uri(oauth2Client: OAuth2ClientInfo): string {
    let result = "";
    if (this.authService.redirectUrl) {
      result += "?prevUri=" + this.authService.redirectUrl;
    }
    return oauth2Client.url + result;
  }
}

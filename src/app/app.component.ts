import { Component} from '@angular/core';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.autoAuthUser();
  }
  title = 'mean-course';
  PostInputData = [];
  postInputData(postData) {
    this.PostInputData.push(postData);
  }
}

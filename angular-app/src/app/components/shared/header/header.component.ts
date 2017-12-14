import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
  }

  isAdmin() {
    if (this.auth.isAdmin()) {
      return true;
    }
    return false;
  }

}

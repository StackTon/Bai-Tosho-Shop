import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AllUsersService } from '../../core/services/all-users/all-users.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
  providers: [AllUsersService]
})
export class AllUsersComponent implements OnInit {
  public usersData: any;

  constructor(
    private usersService: AllUsersService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAllUsers().subscribe(allUsers => {
      this.usersData = allUsers["users"];
      let username = localStorage.getItem('username');
      let index = 0;
      for (let i = 0; i < this.usersData.length; i++) {
        if (this.usersData[i].username === username) {
          index = i;
          break;
        }
      }
      this.usersData.splice(index, 1)
    })
  }

  makeAdmin(id) {
    this.usersService.makeAdmin(id).subscribe(data => {
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');
        this.loadUsers();
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  }

  takeAdmin(id) {
    this.usersService.takeAdmin(id).subscribe(data => {
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');
        this.loadUsers();
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  }

}

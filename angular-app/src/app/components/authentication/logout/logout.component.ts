import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    this.toastr.success("You have successfully logout.", 'Success!');
    localStorage.clear();
    this.router.navigate(['/home']);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: ''
  };
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  submitLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin!', 'Lỗi');
      return;
    }

    this.isSubmitting = true;
    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.toastr.success('Đăng nhập thành công!', 'Thành công');
        this.router.navigate(['/']);
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastr.error('Đăng nhập thất bại: ' + err.message, 'Lỗi');
        this.isSubmitting = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  submitForgotPassword(): void {
    if (!this.email) {
      this.toastr.error('Vui lòng nhập email!', 'Lỗi');
      return;
    }

    this.isSubmitting = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.toastr.success('Yêu cầu khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra email.', 'Thành công');
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Lỗi: ' + err.message, 'Lỗi');
        this.isSubmitting = false;
      }
    });
  }
}

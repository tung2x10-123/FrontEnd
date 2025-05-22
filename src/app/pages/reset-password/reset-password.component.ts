import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.toastr.error('Token không hợp lệ!', 'Lỗi');
      this.router.navigate(['/login']);
    } else {
      console.log('Token received:', this.token); // Kiểm tra token
    }
  }

  submitResetPassword(): void {
    if (!this.newPassword) {
      this.toastr.error('Vui lòng nhập mật khẩu mới!', 'Lỗi');
      return;
    }

    this.isSubmitting = true;
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.toastr.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.', 'Thành công');
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

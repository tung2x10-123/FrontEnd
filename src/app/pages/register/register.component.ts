import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm = {
    username: '',
    email: '',
    password: ''
  };
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  submitRegister(): void {
    if (!this.registerForm.username || !this.registerForm.email || !this.registerForm.password) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin!', 'Lỗi');
      return;
    }

    this.isSubmitting = true;
    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.toastr.success('Đăng ký thành công! Vui lòng đăng nhập.', 'Thành công');
        this.router.navigate(['/login']);
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastr.error('Đăng ký thất bại: ' + err.message, 'Lỗi');
        this.isSubmitting = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';
import {LoadingSpinnerComponent} from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  error: string | null = null;
  isEditing = false;
  profileForm: { username: string; email: string } = { username: '', email: '' };

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm = { username: user.username, email: user.email };
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Lỗi khi tải thông tin: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm = { username: this.user!.username, email: this.user!.email };
    }
  }

  updateProfile(): void {
    if (!this.profileForm.username || !this.profileForm.email) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin!', 'Lỗi');
      return;
    }

    this.isLoading = true;
    const updatedUser: User = {
      ...this.user!,
      username: this.profileForm.username,
      email: this.profileForm.email
    };
    this.authService.updateUserProfile(updatedUser).subscribe({
      next: () => {
        this.user = { ...updatedUser };
        this.isEditing = false;
        this.isLoading = false;
        this.toastr.success('Cập nhật thông tin thành công!', 'Thành công');
      },
      error: (err) => {
        this.error = 'Lỗi khi cập nhật thông tin: ' + err.message;
        this.isLoading = false;
      }
    });
  }
}

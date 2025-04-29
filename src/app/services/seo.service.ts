import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  setTitle(title: string): void {
    this.title.setTitle(title);
  }

  setMetaDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  setMetaKeywords(keywords: string): void {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }
}

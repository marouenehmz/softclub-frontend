import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MediaUploadResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';

  uploadImage(file: File, type: string): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new HttpParams().set('type', type);

    return this.http.post<MediaUploadResponse>(`${this.apiUrl}/media/upload`, formData, {
      params,
    });
  }
}

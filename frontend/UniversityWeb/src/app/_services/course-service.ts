import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICourse } from '../models/icourse';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private baseurl = 'https://localhost:7030/api/Course/';
  http = inject(HttpClient);

  getAll() {
    return this.http.get<ICourse[]>(this.baseurl);
  }

  getById(id: number) {
    return this.http.get<ICourse>(this.baseurl + id);
  }

  add(course: ICourse) {
    return this.http.post<ICourse>(this.baseurl, course);
  }

  update(course: ICourse) {
    return this.http.put(this.baseurl + course.id, course);
  }

  delete(id: number) {
    return this.http.delete(this.baseurl + id);
  }
}

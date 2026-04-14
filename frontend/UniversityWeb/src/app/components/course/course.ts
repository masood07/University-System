import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICourse } from '../../models/icourse';
import { CourseService } from '../../_services/course-service';

@Component({
  selector: 'app-course',
  imports: [FormsModule],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class Course implements OnInit {
  courseService = inject(CourseService);
  courses = signal<ICourse[]>([]);
  course: ICourse = {};

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getAll().subscribe((d) => this.courses.set(d));
  }

  save() {
    if (!this.course.id) {
      this.courseService.add(this.course).subscribe(() => {
        this.course = {};
        this.loadCourses();
      });
      return;
    }

    this.courseService.update(this.course).subscribe(() => {
      this.course = {};
      this.loadCourses();
    });
  }

  edit(item: ICourse) {
    this.course = { ...item };
  }

  remove(item: ICourse) {
    const id = item?.id;
    if (!id) return;

    const label = item?.name?.trim() || `ID ${id}`;
    const ok = confirm(`Are you sure you want to delete ${label}?`);
    if (!ok) return;

    this.courseService.delete(id).subscribe(() => this.loadCourses());
  }
}

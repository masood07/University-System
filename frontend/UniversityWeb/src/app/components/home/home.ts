import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../_services/student-service';
import { DepartmentService } from '../../_services/department-service';
import { CourseService } from '../../_services/course-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  stdService = inject(StudentService);
  depService = inject(DepartmentService);
  courseService = inject(CourseService);

  studentsCount = signal(0);
  departmentsCount = signal(0);
  coursesCount = signal(0);

  ngOnInit(): void {
    this.stdService.getAll().subscribe((d) => this.studentsCount.set(d.length));
    this.depService.getAll().subscribe((d) => this.departmentsCount.set(d.length));
    this.courseService.getAll().subscribe((d) => this.coursesCount.set(d.length));
  }
}

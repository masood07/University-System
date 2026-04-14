import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IStudent } from '../../models/i-student';
import { IDepartment } from '../../models/idepartment';
import { ICourse } from '../../models/icourse';
import { IStudentCourseResult } from '../../models/i-student-course-result';
import { StudentService } from '../../_services/student-service';
import { DepartmentService } from '../../_services/department-service';
import { CourseService } from '../../_services/course-service';

@Component({
  selector: 'app-results',
  imports: [FormsModule],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  stdService = inject(StudentService);
  deptService = inject(DepartmentService);
  courseService = inject(CourseService);

  students = signal<IStudent[]>([]);
  assignStudents = signal<IStudent[]>([]);
  departments = signal<IDepartment[]>([]);
  courses = signal<ICourse[]>([]);
  studentCourseIds = signal<number[]>([]);
  filteredStudents = signal<IStudentCourseResult[]>([]);
  assignDeptId?: number;

  studentId?: number;
  selectedCourseId?: number;
  degree?: number;

  filterDeptId?: number;
  filterCourseId?: number;

  statusMessage = signal('');
  isError = signal(false);

  assignableCourses = computed(() => {
    const ids = this.studentCourseIds();
    if (ids.length) {
      return this.courses().filter((course) => !!course.id && ids.includes(course.id));
    }

    const deptIds = this.getDepartmentCourseIds(this.assignDeptId ?? this.getSelectedStudent()?.deptid);
    return this.courses().filter((course) => !!course.id && deptIds.includes(course.id));
  });

  ngOnInit(): void {
    this.stdService.getAll().subscribe((d: unknown) => {
      const normalized = this.toArray<any>(d).map((student) => ({
        id: this.toNumber(student?.id ?? student?.ID),
        name: student?.name,
        age: this.toNumber(student?.age),
        address: student?.address,
        departmentName: student?.departmentName,
        deptid: this.toNumber(student?.deptid ?? student?.deptId ?? student?.departmentId),
      }));

      this.students.set(normalized);
    });

    this.deptService.getAll().subscribe((d: unknown) => {
      const normalized = this.toArray<any>(d).map((item) => ({
        id: this.toNumber(item?.id ?? item?.ID),
        name: item?.name,
        location: item?.location ?? item?.loc ?? item?.Loc,
        departmentCourses: item?.departmentCourses ?? item?.DepartmentCourses ?? [],
      }));

      this.departments.set(normalized);
    });

    this.courseService.getAll().subscribe((d) => this.courses.set(d));
  }

  onStudentChange() {
    this.selectedCourseId = undefined;
    this.studentCourseIds.set([]);

    if (!this.studentId) {
      return;
    }

    const selected = this.getSelectedStudent();
    if (selected?.deptid) {
      this.assignDeptId = this.toNumber(selected.deptid);
    }

    this.stdService.getById(this.studentId).subscribe({
      next: (student: unknown) => {
        const ids = this.extractStudentCourseIds(student);
        this.studentCourseIds.set(ids);
      },
      error: () => {
        this.studentCourseIds.set([]);
        this.setStatus('Unable to load student-course mapping from API. Department courses are shown instead.', true);
      },
    });
  }

  onFilterDepartmentChange() {
    this.filterCourseId = undefined;
  }

  onAssignDepartmentChange() {
    this.assignDeptId = this.toNumber(this.assignDeptId);
    this.studentId = undefined;
    this.selectedCourseId = undefined;
    this.studentCourseIds.set([]);

    if (!this.assignDeptId) {
      this.assignStudents.set([]);
      return;
    }

    this.stdService.getByDepartment(this.assignDeptId).subscribe({
      next: (d: unknown) => {
        const normalized = this.toArray<any>(d).map((student) => ({
          id: this.toNumber(student?.id ?? student?.ID),
          name: student?.name,
          age: this.toNumber(student?.age),
          address: student?.address,
          departmentName: student?.departmentName,
          deptid: this.toNumber(student?.deptid ?? student?.deptId ?? student?.departmentId),
        }));

        this.assignStudents.set(normalized);
      },
      error: () => {
        this.assignStudents.set([]);
        this.setStatus('Unable to load students for selected department.', true);
      },
    });
  }

  reportCourses() {
    if (!this.filterDeptId) return [];
    const ids = this.getDepartmentCourseIds(this.filterDeptId);
    return this.courses().filter((course) => !!course.id && ids.includes(course.id));
  }

  saveDegree() {
    if (!this.studentId || !this.selectedCourseId || this.degree === undefined) {
      this.setStatus('Please select student, course, and degree.', true);
      return;
    }

    this.stdService.addOrUpdateDegree(this.studentId, this.selectedCourseId, this.degree).subscribe({
      next: () => this.setStatus('Degree saved successfully.'),
      error: () => this.setStatus('Failed to save degree. Please verify inputs.', true),
    });
  }

  searchByCourseAndDepartment() {
    if (!this.filterCourseId || !this.filterDeptId) {
      this.setStatus('Please choose both course and department.', true);
      return;
    }

    this.stdService.getByCourseDepartment(this.filterCourseId, this.filterDeptId).subscribe({
      next: (data) => {
        this.filteredStudents.set(data);
        this.setStatus(data.length ? 'Student results loaded successfully.' : 'No records found for selected filters.');
      },
      error: () => this.setStatus('Failed to load report. Please try again.', true),
    });
  }

  setStatus(message: string, error = false) {
    this.statusMessage.set(message);
    this.isError.set(error);
  }

  private getSelectedStudent() {
    const id = this.toNumber(this.studentId);
    return this.students().find((student) => this.toNumber(student.id) === id);
  }

  private getDepartmentCourseIds(departmentId?: number) {
    const id = this.toNumber(departmentId);
    const department = this.departments().find((item) => this.toNumber(item.id) === id);
    const raw = department?.departmentCourses ?? [];

    const ids = raw
      .map((entry: any) => entry?.courseId ?? entry?.CourseId ?? entry?.course?.id ?? entry?.course?.ID)
      .map((value: unknown) => this.toNumber(value))
      .filter((value): value is number => typeof value === 'number');

    return [...new Set(ids)];
  }

  private toNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }

  private toArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value as T[];

    const wrapped = value as { value?: unknown };
    if (Array.isArray(wrapped?.value)) {
      return wrapped.value as T[];
    }

    return [];
  }

  private extractStudentCourseIds(student: unknown) {
    const data = student as any;
    const candidates = [data?.studentCourses, data?.StudentCourses, data?.courses, data?.Courses];

    for (const candidate of candidates) {
      if (!Array.isArray(candidate)) {
        continue;
      }

      const ids = candidate
        .map((entry: any) => {
          if (typeof entry === 'number') return entry;
          return entry?.courseId ?? entry?.CourseId ?? entry?.id ?? entry?.ID ?? entry?.course?.id ?? entry?.course?.ID;
        })
        .filter((value: unknown): value is number => typeof value === 'number');

      return [...new Set(ids)];
    }

    return [];
  }
}

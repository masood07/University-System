import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IDepartment } from '../../models/idepartment';
import { ICourse } from '../../models/icourse';
import { IStudent } from '../../models/i-student';
import { DepartmentService } from '../../_services/department-service';
import { CourseService } from '../../_services/course-service';
import { StudentService } from '../../_services/student-service';

@Component({
  selector: 'app-department',
  imports: [FormsModule],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class Department implements OnInit {
  depService = inject(DepartmentService);
  courseService = inject(CourseService);
  studentService = inject(StudentService);

  departments = signal<IDepartment[]>([]);
  courses = signal<ICourse[]>([]);
  students = signal<IStudent[]>([]);
  selectedAddCourseIds: number[] = [];
  selectedRemoveCourseIds: number[] = [];
  selectedDepartmentId?: number;
  statusMessage = signal('');
  isError = signal(false);

  dep: IDepartment = {};

  ngOnInit(): void {
    this.loadDepartments();
    this.courseService.getAll().subscribe((d) => this.courses.set(d));
    this.studentService.getAll().subscribe((d) => this.students.set(d));
  }

  loadDepartments() {
    this.depService.getAll().subscribe({
      next: (d: any[]) => {
        const normalized = (d ?? []).map((item) => ({
          id: this.normalizeNumericId(item?.id ?? item?.ID ?? item?.departmentId ?? item?.DepartmentId),
          name: item?.name,
          location: item?.location ?? item?.loc ?? item?.Loc,
          departmentCourses: this.normalizeDepartmentCourses(item?.departmentCourses ?? item?.DepartmentCourses),
        }));

        this.departments.set(normalized);
      },
      error: () => {
        this.departments.set([]);
        this.setStatus('Failed to load departments. Please make sure the API is running and check server errors.', true);
      }
    });
  }

  save() {
    if (!this.dep.id) {
      this.depService.add(this.dep).subscribe({
        next: () => {
          this.dep = {};
          this.setStatus('Department added successfully.');
          this.loadDepartments();
        },
        error: () => {
          this.setStatus('Failed to add department. Please check Name and Location.', true);
        }
      });
      return;
    }

    this.depService.update(this.dep).subscribe({
      next: () => {
        this.dep = {};
        this.setStatus('Department updated successfully.');
        this.loadDepartments();
      },
      error: (err: HttpErrorResponse) => {
        const isNotFound = err.status === 404;
        this.setStatus(
          isNotFound
            ? 'Failed to update department because it no longer exists. Refresh and try again.'
            : 'Failed to update department. Please check Name and Location.',
          true
        );
      }
    });
  }

  edit(item: IDepartment) {
    this.dep = { ...item };
  }

  remove(item: IDepartment) {
    const id = item?.id;
    if (typeof id !== 'number') {
      this.setStatus('Cannot delete this department because its ID is invalid. Refresh data and try again.', true);
      return;
    }

    const hasLinkedCourses = this.getDepartmentCourseIdsByDepartmentId(id).length > 0;
    const hasLinkedStudents = this.students().some((s: any) => {
      const deptId = s?.deptid ?? s?.deptId ?? s?.departmentId;
      return deptId === id;
    });

    if (hasLinkedCourses || hasLinkedStudents) {
      this.setStatus('Cannot delete department because it is linked to students or courses. Remove these links first.', true);
      return;
    }

    const label = item?.name?.trim() || `ID ${id}`;
    const ok = confirm(`Are you sure you want to delete ${label}?`);
    if (!ok) return;

    this.depService.delete(id).subscribe({
      next: () => {
        this.setStatus('Department deleted successfully.');
        this.loadDepartments();
      },
      error: (err: HttpErrorResponse) => {
        if (this.isForeignKeyConflict(err)) {
          this.setStatus('Cannot delete department because it is linked to students or courses. Remove these links first.', true);
          return;
        }

        this.setStatus('Failed to delete department. Please try again.', true);
      }
    });
  }

  addCoursesToDepartment() {
    if (!this.selectedDepartmentId) {
      this.setStatus('Please select a department first.', true);
      return;
    }

    if (!this.selectedAddCourseIds.length) {
      this.setStatus('Please choose courses to add.', true);
      return;
    }

    this.depService.addCourses(this.selectedDepartmentId, this.selectedAddCourseIds).subscribe({
      next: () => {
        this.setStatus('Courses added to department successfully.');
        this.selectedAddCourseIds = [];
        this.loadDepartments();
      },
      error: () => this.setStatus('Failed to add courses. Check IDs and try again.', true),
    });
  }

  removeCoursesFromDepartment() {
    if (!this.selectedDepartmentId) {
      this.setStatus('Please select a department first.', true);
      return;
    }

    if (!this.selectedRemoveCourseIds.length) {
      this.setStatus('Please choose courses to remove.', true);
      return;
    }

    this.depService.removeCourses(this.selectedDepartmentId, this.selectedRemoveCourseIds).subscribe({
      next: () => {
        this.setStatus('Courses removed from department successfully.');
        this.selectedRemoveCourseIds = [];
        this.loadDepartments();
      },
      error: () => this.setStatus('Failed to remove courses. Check IDs and try again.', true),
    });
  }

  onDepartmentSelectionChange() {
    this.selectedAddCourseIds = [];
    this.selectedRemoveCourseIds = [];
  }

  getSelectedDepartment() {
    return this.departments().find((d) => d.id === this.selectedDepartmentId);
  }

  getAssignedCourseIds() {
    const dept = this.getSelectedDepartment();
    return (dept?.departmentCourses ?? [])
      .map((n) => n.courseId)
      .filter((n): n is number => typeof n === 'number');
  }

  getAssignedCourses() {
    const ids = this.getAssignedCourseIds();
    return this.courses().filter((c) => !!c.id && ids.includes(c.id));
  }

  getAvailableCourses() {
    const ids = this.getAssignedCourseIds();
    return this.courses().filter((c) => !c.id || !ids.includes(c.id));
  }

  toggleCourseSelection(courseId?: number, checked = false, mode: 'add' | 'remove' = 'add') {
    if (!courseId) return;

    const target = mode === 'add' ? this.selectedAddCourseIds : this.selectedRemoveCourseIds;

    if (checked) {
      if (!target.includes(courseId)) {
        target.push(courseId);
      }
      return;
    }

    if (mode === 'add') {
      this.selectedAddCourseIds = target.filter((id) => id !== courseId);
      return;
    }

    this.selectedRemoveCourseIds = target.filter((id) => id !== courseId);
  }

  isCourseSelected(courseId?: number, mode: 'add' | 'remove' = 'add') {
    if (!courseId) return false;
    return mode === 'add'
      ? this.selectedAddCourseIds.includes(courseId)
      : this.selectedRemoveCourseIds.includes(courseId);
  }

  setStatus(message: string, error = false) {
    this.statusMessage.set(message);
    this.isError.set(error);
  }

  private isForeignKeyConflict(err: HttpErrorResponse) {
    const payload = [
      err?.error?.message,
      err?.error?.title,
      err?.error?.detail,
      err?.error,
      err?.message,
    ];

    const raw = payload
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part == null) return '';
        try {
          return JSON.stringify(part);
        } catch {
          return String(part);
        }
      })
      .join(' ')
      .toLowerCase();

    return (
      err.status === 409 ||
      raw.includes('foreign key') ||
      raw.includes('reference constraint') ||
      raw.includes('conflicted with the reference')
    );
  }

  private getDepartmentCourseIdsByDepartmentId(id: number) {
    const dept = this.departments().find((d) => d.id === id);
    return this.normalizeDepartmentCourses(dept?.departmentCourses)
      .map((n: any) => n?.courseId ?? n?.CourseId ?? n?.course?.id ?? n?.course?.ID)
      .filter((n: unknown): n is number => typeof n === 'number');
  }

  private normalizeDepartmentCourses(value: unknown) {
    if (!Array.isArray(value)) return [];
    return value;
  }

  private normalizeNumericId(value: unknown): number | undefined {
    if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }
}

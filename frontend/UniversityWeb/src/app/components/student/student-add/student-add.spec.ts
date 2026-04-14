import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { StudentAdd } from './student-add';
import { DepartmentService } from '../../../_services/department-service';
import { StudentService } from '../../../_services/student-service';

describe('StudentAdd', () => {
  let component: StudentAdd;
  let fixture: ComponentFixture<StudentAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAdd],
      providers: [
        provideRouter([]),
        {
          provide: DepartmentService,
          useValue: {
            getAll: () => of([]),
          },
        },
        {
          provide: StudentService,
          useValue: {
            Add: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

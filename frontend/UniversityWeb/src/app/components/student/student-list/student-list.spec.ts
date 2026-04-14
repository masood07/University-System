import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { StudentList } from './student-list';
import { StudentService } from '../../../_services/student-service';

describe('StudentList', () => {
  let component: StudentList;
  let fixture: ComponentFixture<StudentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentList],
      providers: [
        provideRouter([]),
        {
          provide: StudentService,
          useValue: {
            getAll: () => of([]),
            delete: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

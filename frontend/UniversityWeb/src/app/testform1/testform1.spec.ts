import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testform1 } from './testform1';

describe('Testform1', () => {
  let component: Testform1;
  let fixture: ComponentFixture<Testform1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testform1],
    }).compileComponents();

    fixture = TestBed.createComponent(Testform1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

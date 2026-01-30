import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDeleteConfirmDialog } from './task-delete-confirm-dialog';

describe('TaskDeleteConfirmDialog', () => {
  let component: TaskDeleteConfirmDialog;
  let fixture: ComponentFixture<TaskDeleteConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDeleteConfirmDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDeleteConfirmDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

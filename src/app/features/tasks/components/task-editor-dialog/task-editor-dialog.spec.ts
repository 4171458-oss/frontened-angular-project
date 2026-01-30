import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditorDialog } from './task-editor-dialog';

describe('TaskEditorDialog', () => {
  let component: TaskEditorDialog;
  let fixture: ComponentFixture<TaskEditorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditorDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditorDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

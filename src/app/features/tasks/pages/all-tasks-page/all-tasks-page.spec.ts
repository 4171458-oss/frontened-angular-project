import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllTasksPage } from './all-tasks-page';

describe('AllTasksPage', () => {
  let component: AllTasksPage;
  let fixture: ComponentFixture<AllTasksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTasksPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

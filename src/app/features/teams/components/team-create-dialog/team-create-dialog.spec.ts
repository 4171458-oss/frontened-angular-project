import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCreateDialog } from './team-create-dialog';

describe('TeamCreateDialog', () => {
  let component: TeamCreateDialog;
  let fixture: ComponentFixture<TeamCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamCreateDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

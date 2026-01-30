import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAddMemberDialog } from './team-add-member-dialog';

describe('TeamAddMemberDialog', () => {
  let component: TeamAddMemberDialog;
  let fixture: ComponentFixture<TeamAddMemberDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamAddMemberDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamAddMemberDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

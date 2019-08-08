import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkFooterComponent } from './bookmark-footer.component';

describe('BookmarkFooterComponent', () => {
  let component: BookmarkFooterComponent;
  let fixture: ComponentFixture<BookmarkFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

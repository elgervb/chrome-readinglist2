import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkHeaderComponent } from './bookmark-header.component';

describe('BookmarkHeaderComponent', () => {
  let component: BookmarkHeaderComponent;
  let fixture: ComponentFixture<BookmarkHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarkHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });
});

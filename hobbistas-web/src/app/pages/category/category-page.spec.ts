import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryPageComponent } from './category-page';
import { ActivatedRoute } from '@angular/router';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                title: 'Test Category',
                category: 'gaming',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    expect(component.title).toBe('Test Category');
  });

  it('should generate mock articles', () => {
    expect(component.articles.length).toBeGreaterThan(0);
  });
});

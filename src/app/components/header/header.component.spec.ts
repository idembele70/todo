import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { routes } from '@app/app.routes';
import { BOOTSTRAP_CSS_CLASSES } from '@app/core/constants/bootstrap-css-classes.enum';
import { APP_ROUTES } from '@constants/app.routes';
import { getAttributesValue } from '@testing/helpers/dom-test.utils';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  const ROUTER_LINK_ATTRIBUTE_NAME = 'ng-reflect-router-link';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await router.navigateByUrl(APP_ROUTES.HOME_ALL);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify nav link count', () => {
    const navLinkCount = 3;
    const navLinks = fixture.debugElement.queryAll(By.css('a.nav-link')) as DebugElement[];

    expect(navLinks.length).toBe(navLinkCount);
  });

  describe('All Todos', () => {
    let allTodosLinkEl: HTMLAnchorElement;
    beforeEach(() => {
      allTodosLinkEl = fixture.nativeElement.querySelector('[data-test-id="nav-all"]');
    });

    it('should verify text content', () => {
      expect(allTodosLinkEl.textContent).toEqual('All Todos');
    });

    it('should verify class list contains "active"', () => {
      expect(allTodosLinkEl.classList).toContain(BOOTSTRAP_CSS_CLASSES.ACTIVE);
    });
    it('should verify router link', () => {
      expect(getAttributesValue(allTodosLinkEl, ROUTER_LINK_ATTRIBUTE_NAME)).toBe(APP_ROUTES.HOME_ALL);
    });
  });

  describe('Active Todos', () => {
    let activeTodosEl: HTMLAnchorElement;
    beforeEach(() => {
      activeTodosEl = fixture.nativeElement.querySelector('[data-test-id="nav-active"]');
    });

    it('should verify text content', () => {
      expect(activeTodosEl.textContent).toBe('Active Todos');
    });

    it('should verify router link', () => {
      expect(getAttributesValue(activeTodosEl, ROUTER_LINK_ATTRIBUTE_NAME)).toBe(APP_ROUTES.HOME_ACTIVE);
    });

    it('should verify class list contains active', fakeAsync(() => {
      activeTodosEl.click();
      tick();
      expect(activeTodosEl.classList).toContain(BOOTSTRAP_CSS_CLASSES.ACTIVE);
    }));
  });

  describe('Complete Todos', () => {
    let completeTodosEl: HTMLAnchorElement;

    beforeEach(() => {
      completeTodosEl = fixture.nativeElement.querySelector('[data-test-id="nav-complete"]');
    });

    it('should verify text content', () => {
      expect(completeTodosEl.textContent).toBe('Complete Todos');
    });

    it('should verify router link', () => {
      expect(getAttributesValue(completeTodosEl, ROUTER_LINK_ATTRIBUTE_NAME)).toBe(APP_ROUTES.HOME_COMPLETED);
    });

    it('should verify class list contains "active"', async () => {
      completeTodosEl.click();
      await fixture.whenStable();
      expect(completeTodosEl.classList).toContain(BOOTSTRAP_CSS_CLASSES.ACTIVE);
    });
  });
});

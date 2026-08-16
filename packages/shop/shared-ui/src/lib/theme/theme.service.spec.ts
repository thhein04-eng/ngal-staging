import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to following the system setting', () => {
    service.initialize();

    expect(service.theme()).toBe('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('applies an explicit dark choice to the document', () => {
    service.set('dark');

    expect(service.theme()).toBe('dark');
    expect(service.resolvedTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('applies an explicit light choice to the document', () => {
    service.set('light');

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(service.resolvedTheme()).toBe('light');
  });

  it('persists an explicit choice', () => {
    service.set('dark');

    expect(localStorage.getItem('nl-theme')).toBe('dark');
  });

  it('restores a persisted choice on initialize', () => {
    localStorage.setItem('nl-theme', 'dark');

    service.initialize();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('ignores a corrupted stored value', () => {
    localStorage.setItem('nl-theme', 'chartreuse');

    service.initialize();

    expect(service.theme()).toBe('system');
  });

  it('clears the attribute and storage when returning to system', () => {
    service.set('dark');
    service.set('system');

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem('nl-theme')).toBeNull();
  });

  it('toggles from light to dark and back', () => {
    service.set('light');

    service.toggle();
    expect(service.resolvedTheme()).toBe('dark');

    service.toggle();
    expect(service.resolvedTheme()).toBe('light');
  });
});

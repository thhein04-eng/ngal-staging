import { TestBed } from '@angular/core/testing';
import { StagingContentService } from './staging-content.service';

describe('StagingContentService', () => {
  let service: StagingContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StagingContentService);
  });

  it('exposes the full content set', () => {
    expect(service.services.length).toBe(4);
    expect(service.projects.length).toBe(6);
    expect(service.team.length).toBeGreaterThan(0);
    expect(service.faqs.length).toBeGreaterThan(0);
  });

  it('starts with no portfolio filter applied', () => {
    expect(service.activeFilter()).toBe('all');
    expect(service.filteredProjects().length).toBe(service.projects.length);
  });

  it('filters projects by staging package', () => {
    service.setFilter('vacant');

    const filtered = service.filteredProjects();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((project) => project.service === 'vacant')).toBe(true);
  });

  it('sorts filtered projects newest first', () => {
    service.setFilter('all');

    const years = service.filteredProjects().map((project) => project.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('restores every project when the filter is cleared', () => {
    service.setFilter('luxury');
    expect(service.filteredProjects().length).toBe(1);

    service.setFilter('all');
    expect(service.filteredProjects().length).toBe(6);
  });

  it('features the three fastest-selling projects', () => {
    const featured = service.featuredProjects();

    expect(featured.length).toBe(3);
    const days = featured.map((project) => project.daysOnMarket);
    expect(days).toEqual([...days].sort((a, b) => a - b));
  });

  it('marks exactly one service as featured', () => {
    const featured = service.services.filter((item) => item.featured);

    expect(featured.length).toBe(1);
    expect(service.featuredService().id).toBe(featured[0].id);
  });

  it('looks up a service by id', () => {
    expect(service.getServiceById('luxury')?.name).toBe('Luxury Portfolio');
  });

  it('looks up a project by slug', () => {
    expect(service.getProjectBySlug('pearl-district-loft')?.neighborhood).toBe(
      'Pearl District'
    );
  });

  it('returns undefined for an unknown slug', () => {
    expect(service.getProjectBySlug('nope')).toBeUndefined();
  });

  it('maps property types to readable labels', () => {
    expect(service.propertyTypeLabel('luxury-estate')).toBe('Luxury estate');
    expect(service.propertyTypeLabel('condo')).toBe('Condo');
  });

  it('gives every project a matching before and after image', () => {
    for (const project of service.projects) {
      expect(project.beforeImage).toMatch(/^\/images\/projects\/.+-before\.svg$/);
      expect(project.afterImage).toMatch(/^\/images\/projects\/.+-after\.svg$/);
    }
  });
});

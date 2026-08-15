import { Component, computed, inject } from '@angular/core';
import { PortfolioProject, ServiceTier } from '@org/models';
import { StagingContentService } from '@org/shop/data';
import {
  BeforeAfterComponent,
  CtaBannerComponent,
  ProjectCardComponent,
  SectionHeadingComponent,
} from '@org/shop/shared-ui';

interface FilterOption {
  readonly value: ServiceTier | 'all';
  readonly label: string;
}

@Component({
  selector: 'shop-portfolio-page',
  imports: [
    BeforeAfterComponent,
    CtaBannerComponent,
    ProjectCardComponent,
    SectionHeadingComponent,
  ],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.css',
})
export class PortfolioPageComponent {
  private readonly content = inject(StagingContentService);

  protected readonly filters: readonly FilterOption[] = [
    { value: 'all', label: 'All projects' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'vacant', label: 'Vacant' },
    { value: 'luxury', label: 'Luxury' },
  ];

  protected readonly activeFilter = this.content.activeFilter;
  protected readonly projects = this.content.filteredProjects;

  /** The two most dramatic transformations, shown as full comparison sliders. */
  protected readonly showcase = computed(() =>
    [...this.content.projects]
      .sort((a, b) => a.daysOnMarket - b.daysOnMarket)
      .slice(0, 2)
  );

  protected readonly resultsLabel = computed(() => {
    const count = this.projects().length;
    return `${count} ${count === 1 ? 'project' : 'projects'}`;
  });

  protected setFilter(filter: ServiceTier | 'all'): void {
    this.content.setFilter(filter);
  }

  protected typeLabel(project: PortfolioProject): string {
    return this.content.propertyTypeLabel(project.propertyType);
  }
}

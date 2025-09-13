/**
 * TreeSearch Component
 *
 * A comprehensive search and filter interface for the BreakdownTree component
 * with support for text search, type filtering, status filtering, and more.
 *
 * @fileoverview Search and filter component for BreakdownTree
 * @version 1.0.0
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Settings,
  Target,
  CheckSquare,
  Flag,
  Circle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  type SearchConfig,
  type FilterConfig,
  TreeNodeType,
  type SearchFilterState,
} from './BreakdownTree.types';
import { useTreeContext } from './TreeContext';

// =============================================================================
// Type Icons
// =============================================================================

const NODE_TYPE_ICONS = {
  [TreeNodeType.GOAL]: Target,
  [TreeNodeType.OUTCOME]: Circle,
  [TreeNodeType.MILESTONE]: Flag,
  [TreeNodeType.TASK]: CheckSquare,
  [TreeNodeType.SUBTASK]: CheckSquare,
} as const;

// =============================================================================
// Component Props
// =============================================================================

interface TreeSearchProps {
  className?: string;
  /** Whether search is enabled */
  enableSearch?: boolean;
  /** Whether filters are enabled */
  enableFilters?: boolean;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Callback when search/filter state changes */
  onSearchFilterChange?: (state: SearchFilterState) => void;
}

// =============================================================================
// TreeSearch Component
// =============================================================================

export function TreeSearch({
  className,
  enableSearch = true,
  enableFilters = true,
  searchPlaceholder = 'Search nodes...',
  onSearchFilterChange,
}: TreeSearchProps) {
  const { state, operations } = useTreeContext();
  const { searchFilter } = state;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // =============================================================================
  // Search Handlers
  // =============================================================================

  const handleSearchChange = useCallback((value: string) => {
    operations.setSearch({ query: value });
  }, [operations]);

  const handleSearchOptionsChange = useCallback((options: Partial<SearchConfig>) => {
    operations.setSearch(options);
  }, [operations]);

  const clearSearch = useCallback(() => {
    operations.setSearch({ query: '' });
  }, [operations]);

  // =============================================================================
  // Filter Handlers
  // =============================================================================

  const handleNodeTypeFilter = useCallback((nodeType: TreeNodeType, checked: boolean) => {
    const currentTypes = searchFilter.filters.nodeTypes;
    const newTypes = checked
      ? [...currentTypes, nodeType]
      : currentTypes.filter(t => t !== nodeType);

    operations.setFilters({ nodeTypes: newTypes });
  }, [searchFilter.filters.nodeTypes, operations]);

  const handleStatusFilter = useCallback((status: string, checked: boolean) => {
    const currentStatuses = searchFilter.filters.statuses;
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);

    operations.setFilters({ statuses: newStatuses });
  }, [searchFilter.filters.statuses, operations]);

  const handlePriorityFilter = useCallback((priority: string, checked: boolean) => {
    const currentPriorities = searchFilter.filters.priorities;
    const newPriorities = checked
      ? [...currentPriorities, priority]
      : currentPriorities.filter(p => p !== priority);

    operations.setFilters({ priorities: newPriorities });
  }, [searchFilter.filters.priorities, operations]);

  const handleProgressRangeChange = useCallback((range: [number, number]) => {
    operations.setFilters({
      progressRange: { min: range[0], max: range[1] }
    });
  }, [operations]);

  const clearFilters = useCallback(() => {
    operations.setFilters({
      nodeTypes: Object.values(TreeNodeType),
      statuses: [],
      priorities: [],
      progressRange: { min: 0, max: 100 },
      dateRange: { start: null, end: null },
    });
  }, [operations]);

  const clearAll = useCallback(() => {
    clearSearch();
    clearFilters();
  }, [clearSearch, clearFilters]);

  // =============================================================================
  // Computed Values
  // =============================================================================

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    const { filters } = searchFilter;

    // Count active node type filters (if not all selected)
    if (filters.nodeTypes.length < Object.values(TreeNodeType).length) {
      count++;
    }

    // Count other filters
    if (filters.statuses.length > 0) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.progressRange.min > 0 || filters.progressRange.max < 100) count++;

    return count;
  }, [searchFilter.filters]);

  const hasActiveSearch = searchFilter.search.query.length > 0;
  const hasActiveFilters = activeFiltersCount > 0;
  const hasAnyActive = hasActiveSearch || hasActiveFilters;

  const matchingCount = searchFilter.matchingIds.size;
  const totalCount = state.tree.count;

  // =============================================================================
  // Available Filter Options
  // =============================================================================

  const statusOptions = useMemo(() => [
    'draft', 'active', 'on_hold', 'completed', 'cancelled', 'overdue',
    'todo', 'in_progress', 'blocked'
  ], []);

  const priorityOptions = useMemo(() => [
    'low', 'medium', 'high', 'critical'
  ], []);

  // =============================================================================
  // Effect: Notify parent of changes
  // =============================================================================

  React.useEffect(() => {
    onSearchFilterChange?.(searchFilter);
  }, [searchFilter, onSearchFilterChange]);

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Search Bar */}
      {enableSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchFilter.search.query}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {hasActiveSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-destructive/10"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Filter Controls */}
      {enableFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>

                  {/* Node Type Filter */}
                  <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-0">
                        <span className="text-sm font-medium">Node Types</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2">
                      {Object.values(TreeNodeType).map((nodeType) => {
                        const Icon = NODE_TYPE_ICONS[nodeType];
                        const isChecked = searchFilter.filters.nodeTypes.includes(nodeType);

                        return (
                          <div key={nodeType} className="flex items-center space-x-2">
                            <Checkbox
                              id={`nodeType-${nodeType}`}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleNodeTypeFilter(nodeType, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`nodeType-${nodeType}`}
                              className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                            >
                              <Icon className="h-3 w-3" />
                              {nodeType.replace('_', ' ')}
                            </Label>
                          </div>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Status Filter */}
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {statusOptions.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={searchFilter.filters.statuses.includes(status)}
                            onCheckedChange={(checked) =>
                              handleStatusFilter(status, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`status-${status}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {status.replace('_', ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Priority Filter */}
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="mt-2 space-y-2">
                      {priorityOptions.map((priority) => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority}`}
                            checked={searchFilter.filters.priorities.includes(priority)}
                            onCheckedChange={(checked) =>
                              handlePriorityFilter(priority, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`priority-${priority}`}
                            className="text-sm font-normal cursor-pointer capitalize"
                          >
                            {priority}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Progress Range Filter */}
                  <div>
                    <Label className="text-sm font-medium">Progress Range</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[searchFilter.filters.progressRange.min, searchFilter.filters.progressRange.max]}
                        onValueChange={handleProgressRangeChange}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{searchFilter.filters.progressRange.min}%</span>
                        <span>{searchFilter.filters.progressRange.max}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Search Options */}
            {enableSearch && hasActiveSearch && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Options
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-64" align="start">
                  <div className="space-y-3">
                    <h4 className="font-medium">Search Options</h4>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="searchTitles"
                          checked={searchFilter.search.searchTitles}
                          onCheckedChange={(checked) =>
                            handleSearchOptionsChange({ searchTitles: checked as boolean })
                          }
                        />
                        <Label htmlFor="searchTitles" className="text-sm">
                          Search titles
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="searchDescriptions"
                          checked={searchFilter.search.searchDescriptions}
                          onCheckedChange={(checked) =>
                            handleSearchOptionsChange({ searchDescriptions: checked as boolean })
                          }
                        />
                        <Label htmlFor="searchDescriptions" className="text-sm">
                          Search descriptions
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="caseSensitive"
                          checked={searchFilter.search.caseSensitive}
                          onCheckedChange={(checked) =>
                            handleSearchOptionsChange({ caseSensitive: checked as boolean })
                          }
                        />
                        <Label htmlFor="caseSensitive" className="text-sm">
                          Case sensitive
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="useRegex"
                          checked={searchFilter.search.useRegex}
                          onCheckedChange={(checked) =>
                            handleSearchOptionsChange({ useRegex: checked as boolean })
                          }
                        />
                        <Label htmlFor="useRegex" className="text-sm">
                          Use regex
                        </Label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Clear All Button */}
          {hasAnyActive && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Results Summary */}
      {searchFilter.isActive && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {matchingCount} of {totalCount} nodes
            {hasActiveSearch && ` matching "${searchFilter.search.query}"`}
          </span>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1">
              {activeFiltersCount === 1 ? '1 filter' : `${activeFiltersCount} filters`} active
            </div>
          )}
        </div>
      )}

      {/* No Results Message */}
      {searchFilter.isActive && matchingCount === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No nodes match your current search and filter criteria
        </div>
      )}
    </div>
  );
}
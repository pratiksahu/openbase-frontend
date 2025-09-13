import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import type { ChecklistItem } from '@/types/smart-goals.types';

import { ChecklistEditor } from './ChecklistEditor';

const meta = {
  title: 'Components/TaskEditor/ChecklistEditor',
  component: ChecklistEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive checklist management component with drag-and-drop reordering, inline editing, markdown support, and bulk operations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onChecklistChange: {
      description: 'Callback fired when the checklist array changes',
    },
    onItemAdd: {
      description: 'Callback fired when a new checklist item is added',
    },
    onItemUpdate: {
      description: 'Callback fired when a checklist item is updated',
    },
    onItemDelete: {
      description: 'Callback fired when a checklist item is deleted',
    },
    onItemToggle: {
      description: 'Callback fired when a checklist item completion status is toggled',
    },
    onItemReorder: {
      description: 'Callback fired when checklist items are reordered',
    },
    supportMarkdown: {
      control: 'boolean',
      description: 'Enable markdown support in item descriptions',
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Whether the component is in read-only mode',
    },
  },
} satisfies Meta<typeof ChecklistEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const basicChecklistItems: ChecklistItem[] = [
  {
    id: 'check-1',
    title: 'All forms have proper validation',
    description: 'Both client-side and server-side validation are implemented and tested',
    isCompleted: true,
    isRequired: true,
    order: 0,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    completedAt: new Date('2024-01-16T14:30:00Z'),
    completedBy: 'user-1',
  },
  {
    id: 'check-2',
    title: 'Error messages are user-friendly',
    description: 'No technical jargon in user-facing error messages',
    isCompleted: true,
    isRequired: false,
    order: 1,
    createdAt: new Date('2024-01-16T09:00:00Z'),
    updatedAt: new Date('2024-01-16T15:20:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    completedAt: new Date('2024-01-16T15:20:00Z'),
    completedBy: 'user-1',
  },
  {
    id: 'check-3',
    title: 'Loading states are implemented',
    description: 'Show spinners or skeleton screens during data loading',
    isCompleted: false,
    isRequired: true,
    order: 2,
    createdAt: new Date('2024-01-17T11:00:00Z'),
    updatedAt: new Date('2024-01-17T11:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'check-4',
    title: 'Accessibility standards are met',
    description: 'WCAG 2.1 AA compliance verified with automated and manual testing',
    isCompleted: false,
    isRequired: false,
    order: 3,
    createdAt: new Date('2024-01-17T13:00:00Z'),
    updatedAt: new Date('2024-01-17T13:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'check-5',
    title: 'Performance benchmarks met',
    description: 'Core Web Vitals scores meet or exceed targets',
    isCompleted: false,
    isRequired: true,
    order: 4,
    createdAt: new Date('2024-01-18T10:00:00Z'),
    updatedAt: new Date('2024-01-18T10:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
];

const markdownChecklistItems: ChecklistItem[] = [
  {
    id: 'md-1',
    title: 'API Documentation Complete',
    description: `**Endpoint Documentation:**
- All REST endpoints documented
- Request/response examples provided
- Error codes and messages listed

**Authentication:**
- \`JWT\` token usage explained
- *Rate limiting* details included

\`\`\`
GET /api/users
Authorization: Bearer <token>
\`\`\``,
    isCompleted: true,
    isRequired: true,
    order: 0,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    completedAt: new Date('2024-01-16T14:30:00Z'),
    completedBy: 'user-1',
  },
  {
    id: 'md-2',
    title: 'Security Review Passed',
    description: `**Security Checklist:**

1. **Input Validation**
   - SQL injection prevention ✅
   - XSS protection implemented ✅
   - CSRF tokens in use ✅

2. **Authentication & Authorization**
   - Password hashing with \`bcrypt\` ✅
   - Role-based access control ✅
   - Session management secure ❌

3. **Data Protection**
   - Sensitive data encrypted ❌
   - PII handling compliant ❌

> **Note:** Items marked with ❌ need attention`,
    isCompleted: false,
    isRequired: true,
    order: 1,
    createdAt: new Date('2024-01-16T09:00:00Z'),
    updatedAt: new Date('2024-01-16T15:20:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'md-3',
    title: 'Performance Testing Results',
    description: `**Load Testing Results:**

| Metric | Target | Actual | Status |
|--------|--------|---------|---------|
| Response Time | < 200ms | 150ms | ✅ Pass |
| Throughput | > 1000 RPS | 1250 RPS | ✅ Pass |
| Error Rate | < 0.1% | 0.05% | ✅ Pass |
| Memory Usage | < 512MB | 480MB | ✅ Pass |

**Browser Performance:**
- Lighthouse score: **92/100**
- First Contentful Paint: *1.2s*
- Largest Contentful Paint: *2.1s*`,
    isCompleted: true,
    isRequired: false,
    order: 2,
    createdAt: new Date('2024-01-17T11:00:00Z'),
    updatedAt: new Date('2024-01-17T16:45:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-2',
    completedAt: new Date('2024-01-17T16:45:00Z'),
    completedBy: 'user-2',
  },
];

const comprehensiveChecklistItems: ChecklistItem[] = [
  ...basicChecklistItems,
  {
    id: 'check-6',
    title: 'Cross-browser compatibility verified',
    description: 'Tested on Chrome, Firefox, Safari, and Edge browsers',
    isCompleted: true,
    isRequired: false,
    order: 5,
    createdAt: new Date('2024-01-18T11:00:00Z'),
    updatedAt: new Date('2024-01-19T09:15:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-2',
    completedAt: new Date('2024-01-19T09:15:00Z'),
    completedBy: 'user-2',
  },
  {
    id: 'check-7',
    title: 'Mobile responsiveness tested',
    description: 'Layout works correctly on phones and tablets',
    isCompleted: false,
    isRequired: true,
    order: 6,
    createdAt: new Date('2024-01-19T10:00:00Z'),
    updatedAt: new Date('2024-01-19T10:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'check-8',
    title: 'Database migrations tested',
    description: 'All database schema changes tested in staging environment',
    isCompleted: false,
    isRequired: true,
    order: 7,
    createdAt: new Date('2024-01-19T14:00:00Z'),
    updatedAt: new Date('2024-01-19T14:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'check-9',
    title: 'Documentation updated',
    description: 'User guides and technical documentation reflect all changes',
    isCompleted: false,
    isRequired: false,
    order: 8,
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'check-10',
    title: 'Rollback plan prepared',
    description: 'Procedures documented for rolling back changes if issues arise',
    isCompleted: false,
    isRequired: true,
    order: 9,
    createdAt: new Date('2024-01-20T11:00:00Z'),
    updatedAt: new Date('2024-01-20T11:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
];

/**
 * Default checklist with mixed completion states
 */
export const Default: Story = {
  args: {
    checklist: basicChecklistItems,
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default checklist showing items in various completion states with required and optional items.',
      },
    },
  },
};

/**
 * Empty checklist
 */
export const Empty: Story = {
  args: {
    checklist: [],
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state showing when no checklist items have been created yet.',
      },
    },
  },
};

/**
 * Checklist with markdown support
 */
export const WithMarkdownSupport: Story = {
  args: {
    checklist: markdownChecklistItems,
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checklist with markdown support enabled, showing rich text formatting in descriptions.',
      },
    },
  },
};

/**
 * Read-only checklist
 */
export const ReadOnly: Story = {
  args: {
    checklist: basicChecklistItems,
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only mode where checklist items can be viewed but not modified.',
      },
    },
  },
};

/**
 * All completed checklist
 */
export const AllCompleted: Story = {
  args: {
    checklist: basicChecklistItems.map(item => ({
      ...item,
      isCompleted: true,
      completedAt: new Date('2024-01-20T12:00:00Z'),
      completedBy: 'user-1',
    })),
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checklist where all items are completed, showing full progress completion.',
      },
    },
  },
};

/**
 * Only required items
 */
export const RequiredItemsOnly: Story = {
  args: {
    checklist: basicChecklistItems.filter(item => item.isRequired),
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checklist showing only required items that must be completed.',
      },
    },
  },
};

/**
 * Large checklist with many items
 */
export const LargeChecklist: Story = {
  args: {
    checklist: comprehensiveChecklistItems,
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large checklist with many items showing how the component handles extensive lists.',
      },
    },
  },
};

/**
 * Checklist with long descriptions
 */
export const LongDescriptions: Story = {
  args: {
    checklist: [
      {
        id: 'long-1',
        title: 'Comprehensive security audit completed',
        description: `A thorough security assessment has been conducted covering all aspects of the application:

1. Authentication and Authorization Systems
   - Multi-factor authentication implementation verified
   - Role-based access control (RBAC) tested across all user types
   - Session management and timeout policies validated
   - Password policies and storage mechanisms audited

2. Data Protection and Privacy
   - Encryption at rest and in transit verified
   - Personal Identifiable Information (PII) handling reviewed
   - GDPR and other compliance requirements addressed
   - Data retention and deletion policies implemented

3. Infrastructure Security
   - Server hardening and patch management verified
   - Network segmentation and firewall rules audited
   - SSL/TLS configuration and certificate management checked
   - Backup and disaster recovery procedures tested

4. Application Security
   - Input validation and sanitization across all endpoints
   - SQL injection and XSS prevention measures tested
   - CSRF protection implemented and verified
   - API rate limiting and throttling configured

The audit was conducted by an external security firm and all critical and high-severity issues have been addressed. Medium and low-severity items have been documented and scheduled for future releases.`,
        isCompleted: true,
        isRequired: true,
        order: 0,
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-16T14:30:00Z'),
        createdBy: 'user-1',
        updatedBy: 'user-1',
        completedAt: new Date('2024-01-16T14:30:00Z'),
        completedBy: 'user-1',
      },
      {
        id: 'long-2',
        title: 'Performance optimization and monitoring setup',
        description: `Complete performance optimization and monitoring infrastructure has been implemented:

Frontend Optimizations:
- Code splitting implemented for main application bundles
- Lazy loading configured for non-critical components and routes
- Image optimization with WebP format and responsive sizing
- CSS optimization with unused styles removal and minification
- JavaScript bundling optimized with tree shaking and compression

Backend Optimizations:
- Database query optimization with proper indexing
- Redis caching layer implemented for frequently accessed data
- API response compression and efficient serialization
- Connection pooling and resource management improved
- Background job processing with queue management

Monitoring and Observability:
- Application Performance Monitoring (APM) tools integrated
- Real User Monitoring (RUM) for frontend performance tracking
- Server resource monitoring with alerting thresholds
- Error tracking and reporting system implemented
- Performance budgets established with automated checking

The optimizations have resulted in a 40% improvement in page load times and 60% reduction in server response times.`,
        isCompleted: false,
        isRequired: true,
        order: 1,
        createdAt: new Date('2024-01-16T09:00:00Z'),
        updatedAt: new Date('2024-01-16T15:20:00Z'),
        createdBy: 'user-1',
        updatedBy: 'user-1',
      },
    ],
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checklist items with extensive descriptions showing how long content is displayed and managed.',
      },
    },
  },
};

/**
 * Mixed states with recent activity
 */
export const RecentActivity: Story = {
  args: {
    checklist: basicChecklistItems.map((item, index) => ({
      ...item,
      updatedAt: new Date(Date.now() - (index * 2 * 60 * 60 * 1000)), // Stagger updates over last few hours
      completedAt: item.isCompleted ? new Date(Date.now() - (index * 60 * 60 * 1000)) : undefined,
    })),
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checklist showing recent activity with items completed at different times.',
      },
    },
  },
};

/**
 * Interactive checklist demo
 */
export const Interactive: Story = {
  args: {
    checklist: basicChecklistItems.slice(0, 3), // Start with fewer items for demo
    onChecklistChange: fn(),
    onItemAdd: (item) => {
      console.log('Adding item:', item);
      fn()(item);
    },
    onItemUpdate: (id, changes) => {
      console.log('Updating item:', id, changes);
      fn()(id, changes);
    },
    onItemDelete: (id) => {
      console.log('Deleting item:', id);
      fn()(id);
    },
    onItemToggle: (id) => {
      console.log('Toggling item:', id);
      fn()(id);
    },
    onItemReorder: (fromIndex, toIndex) => {
      console.log('Reordering from', fromIndex, 'to', toIndex);
      fn()(fromIndex, toIndex);
    },
    supportMarkdown: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing add, edit, delete, toggle, and reorder operations with console logging.',
      },
    },
  },
};

/**
 * High-priority required items
 */
export const CriticalItems: Story = {
  args: {
    checklist: [
      {
        id: 'critical-1',
        title: '🔒 Security vulnerability patched',
        description: 'Critical security vulnerability in authentication system addressed',
        isCompleted: true,
        isRequired: true,
        order: 0,
        createdAt: new Date('2024-01-20T08:00:00Z'),
        updatedAt: new Date('2024-01-20T10:30:00Z'),
        createdBy: 'user-1',
        updatedBy: 'user-1',
        completedAt: new Date('2024-01-20T10:30:00Z'),
        completedBy: 'user-1',
      },
      {
        id: 'critical-2',
        title: '⚡ Performance regression fixed',
        description: 'Database query causing 5-second delays has been optimized',
        isCompleted: false,
        isRequired: true,
        order: 1,
        createdAt: new Date('2024-01-20T09:00:00Z'),
        updatedAt: new Date('2024-01-20T09:00:00Z'),
        createdBy: 'user-1',
        updatedBy: 'user-1',
      },
      {
        id: 'critical-3',
        title: '🚨 Data backup verified',
        description: 'Critical data backup integrity checked and restoration process tested',
        isCompleted: false,
        isRequired: true,
        order: 2,
        createdAt: new Date('2024-01-20T10:00:00Z'),
        updatedAt: new Date('2024-01-20T10:00:00Z'),
        createdBy: 'user-1',
        updatedBy: 'user-1',
      },
    ],
    onChecklistChange: fn(),
    onItemAdd: fn(),
    onItemUpdate: fn(),
    onItemDelete: fn(),
    onItemToggle: fn(),
    onItemReorder: fn(),
    supportMarkdown: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Critical checklist items with high priority indicators and urgent requirements.',
      },
    },
  },
};
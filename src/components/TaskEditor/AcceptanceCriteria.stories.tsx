import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import { AcceptanceCriteria } from './AcceptanceCriteria';
import { AcceptanceCriteriaFormat, type AcceptanceCriteriaData, type TemplateSnippet } from './TaskEditor.types';

const meta = {
  title: 'Components/TaskEditor/AcceptanceCriteria',
  component: AcceptanceCriteria,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive acceptance criteria editor with support for multiple formats: plain text bullets, Gherkin syntax (Given/When/Then), and Markdown format. Includes syntax highlighting, validation, templates, and preview mode.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onCriteriaChange: {
      description: 'Callback fired when criteria content or format changes',
    },
    supportedFormats: {
      control: 'check',
      options: Object.values(AcceptanceCriteriaFormat),
      description: 'List of supported acceptance criteria formats',
    },
    showPreview: {
      control: 'boolean',
      description: 'Enable preview mode toggle',
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Whether the component is in read-only mode',
    },
  },
} satisfies Meta<typeof AcceptanceCriteria>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock templates
const mockTemplates: TemplateSnippet[] = [
  {
    id: 'gherkin-login',
    name: 'User Login Scenario',
    description: 'Basic user authentication flow',
    format: AcceptanceCriteriaFormat.GHERKIN,
    content: `Given I am on the login page
When I enter valid credentials
Then I should be logged in successfully
And I should be redirected to the dashboard`,
    category: 'Authentication',
    keywords: ['login', 'auth', 'user'],
  },
  {
    id: 'gherkin-form',
    name: 'Form Validation',
    description: 'Testing form validation with error cases',
    format: AcceptanceCriteriaFormat.GHERKIN,
    content: `Given I am on the registration form
When I submit the form with invalid email format
Then I should see an email validation error
And the form should not be submitted
But the form should retain my other valid inputs`,
    category: 'Forms',
    keywords: ['form', 'validation', 'error'],
  },
  {
    id: 'plain-basic',
    name: 'Basic Requirements',
    description: 'Simple bullet-point requirements',
    format: AcceptanceCriteriaFormat.PLAIN_TEXT,
    content: `• User can view the main dashboard
• All navigation links work correctly
• Page loads within 3 seconds
• Error messages are user-friendly
• Data is automatically saved`,
    category: 'General',
    keywords: ['basic', 'requirements', 'dashboard'],
  },
  {
    id: 'markdown-detailed',
    name: 'Detailed Specifications',
    description: 'Rich markdown with sections and formatting',
    format: AcceptanceCriteriaFormat.MARKDOWN,
    content: `## User Interface Requirements

### Must Have
- **Responsive design** that works on all device sizes
- **Accessibility compliance** with WCAG 2.1 AA
- **Loading indicators** for all async operations

### Should Have
- *Dark mode support* with theme persistence
- *Keyboard navigation* for power users
- *Progressive enhancement* for slower connections

### Performance Criteria
1. Initial page load < 3 seconds
2. Time to interactive < 5 seconds
3. Lighthouse score > 90

\`\`\`
Note: All criteria must pass before production deployment
\`\`\``,
    category: 'UI/UX',
    keywords: ['markdown', 'detailed', 'ui', 'performance'],
  },
];

// Sample acceptance criteria data
const plainTextCriteria: AcceptanceCriteriaData = {
  format: AcceptanceCriteriaFormat.PLAIN_TEXT,
  content: `• User can successfully create a new account
• Email verification is sent immediately after registration
• Password must meet complexity requirements
• User receives welcome email after verification
• Account is automatically activated after email confirmation
• Invalid email addresses are rejected with clear error message
• Duplicate email registrations are prevented
• Registration form is mobile-friendly and accessible`,
  isValid: true,
};

const gherkinCriteria: AcceptanceCriteriaData = {
  format: AcceptanceCriteriaFormat.GHERKIN,
  content: `Given I am a new user on the registration page
When I fill out the form with valid information
Then my account should be created successfully
And I should receive a verification email
And I should see a confirmation message

Given I am on the registration page
When I enter an email that already exists
Then I should see an error message
And the form should not be submitted
But my other form data should be preserved

Given I enter a weak password
When I try to submit the registration form
Then I should see password strength requirements
And the form should highlight the password field
And I should see suggestions for a stronger password`,
  isValid: true,
};

const markdownCriteria: AcceptanceCriteriaData = {
  format: AcceptanceCriteriaFormat.MARKDOWN,
  content: `## User Registration Acceptance Criteria

### Functional Requirements

#### Account Creation
- **Valid Information**: User can create account with valid email and password
- **Email Verification**: Verification email sent within 60 seconds
- **Account Activation**: Account activated upon email verification
- **Welcome Process**: Welcome email sent after activation

#### Validation Rules
- **Email Format**: Must be valid email format (RFC 5322 compliant)
- **Password Strength**: Minimum 8 characters with mixed case, numbers, and symbols
- **Unique Email**: Duplicate registrations prevented with clear messaging
- **Required Fields**: All mandatory fields enforced with clear indicators

### Non-Functional Requirements

#### Performance
1. **Registration Form Load**: < 2 seconds
2. **Form Submission**: < 3 seconds response time
3. **Email Delivery**: Within 60 seconds of registration

#### Security
- **Password Hashing**: Using bcrypt with minimum 12 salt rounds
- **Rate Limiting**: Max 5 registration attempts per IP per hour
- **CSRF Protection**: All forms protected against CSRF attacks

#### Accessibility
- **Screen Reader Support**: All form elements properly labeled
- **Keyboard Navigation**: Full form accessible via keyboard
- **Color Contrast**: All text meets WCAG AA standards

### Error Handling

| Scenario | Expected Behavior |
|----------|------------------|
| Invalid email | Clear error message below email field |
| Weak password | Real-time password strength indicator |
| Network error | Retry option with offline support |
| Server error | User-friendly error with support contact |

### Browser Support

\`\`\`
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
\`\`\`

> **Note**: All criteria must be verified through automated tests before deployment`,
  isValid: true,
};

const invalidGherkinCriteria: AcceptanceCriteriaData = {
  format: AcceptanceCriteriaFormat.GHERKIN,
  content: `This is not valid Gherkin syntax
It should start with Given, When, Then
But this text doesn't follow the pattern
And will show validation errors`,
  isValid: false,
  validationErrors: [
    'Line "This is not valid Gherkin syntax" doesn\'t start with a valid Gherkin keyword',
    'Line "It should start with Given, When, Then" doesn\'t start with a valid Gherkin keyword',
    'Line "But this text doesn\'t follow the pattern" doesn\'t start with a valid Gherkin keyword',
    'Missing "Given" clause',
    'Missing "When" clause',
    'Missing "Then" clause',
  ],
};

/**
 * Default plain text acceptance criteria
 */
export const PlainText: Story = {
  args: {
    criteria: plainTextCriteria,
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Plain text acceptance criteria with bullet points for simple requirements.',
      },
    },
  },
};

/**
 * Gherkin (BDD) format acceptance criteria
 */
export const Gherkin: Story = {
  args: {
    criteria: gherkinCriteria,
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Gherkin format acceptance criteria following Given/When/Then BDD pattern with syntax highlighting.',
      },
    },
  },
};

/**
 * Markdown format acceptance criteria
 */
export const Markdown: Story = {
  args: {
    criteria: markdownCriteria,
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Markdown format acceptance criteria with rich formatting, tables, and code blocks.',
      },
    },
  },
};

/**
 * Empty acceptance criteria ready for input
 */
export const Empty: Story = {
  args: {
    criteria: {
      format: AcceptanceCriteriaFormat.PLAIN_TEXT,
      content: '',
      isValid: true,
    },
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty acceptance criteria editor ready for new input with template suggestions.',
      },
    },
  },
};

/**
 * Invalid Gherkin with validation errors
 */
export const InvalidGherkin: Story = {
  args: {
    criteria: invalidGherkinCriteria,
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Invalid Gherkin syntax showing validation errors and helpful guidance.',
      },
    },
  },
};

/**
 * Read-only acceptance criteria
 */
export const ReadOnly: Story = {
  args: {
    criteria: gherkinCriteria,
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only mode where acceptance criteria can be viewed but not edited.',
      },
    },
  },
};

/**
 * Limited format support (Gherkin only)
 */
export const GherkinOnly: Story = {
  args: {
    criteria: gherkinCriteria,
    onCriteriaChange: fn(),
    templates: mockTemplates.filter(t => t.format === AcceptanceCriteriaFormat.GHERKIN),
    supportedFormats: [AcceptanceCriteriaFormat.GHERKIN],
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Acceptance criteria editor with only Gherkin format support enabled.',
      },
    },
  },
};

/**
 * Without preview mode
 */
export const NoPreview: Story = {
  args: {
    criteria: markdownCriteria,
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Acceptance criteria editor without preview mode toggle.',
      },
    },
  },
};

/**
 * Complex Gherkin scenario with multiple conditions
 */
export const ComplexGherkin: Story = {
  args: {
    criteria: {
      format: AcceptanceCriteriaFormat.GHERKIN,
      content: `Given I am a logged-in premium user
And I have active subscription
And I am on the dashboard page
When I click on the "Advanced Analytics" button
Then I should see the advanced analytics panel
And the panel should load within 2 seconds
And I should see charts for the last 30 days
And I should see export options

Given I am a logged-in basic user
And I have no active subscription
When I try to access advanced analytics
Then I should see an upgrade prompt
And I should not see the analytics data
But I should see a preview of available features

Given I am viewing advanced analytics
And the data fails to load
When the system encounters an error
Then I should see a friendly error message
And I should see a "Retry" button
And I should have the option to contact support`,
      isValid: true,
    },
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex Gherkin scenario with multiple Given/When/Then blocks and And/But conditions.',
      },
    },
  },
};

/**
 * Comprehensive markdown with all features
 */
export const ComprehensiveMarkdown: Story = {
  args: {
    criteria: {
      format: AcceptanceCriteriaFormat.MARKDOWN,
      content: `# User Profile Management - Acceptance Criteria

## Overview
This feature allows users to manage their personal profile information, including profile picture, contact details, and preferences.

## User Stories

### 📝 Profile Information Update
**As a** registered user
**I want to** update my profile information
**So that** my account reflects current and accurate details

#### Acceptance Criteria

##### ✅ Must Have Requirements

1. **Profile Picture Upload**
   - Support for \`JPEG\`, \`PNG\`, and \`WebP\` formats
   - Maximum file size: **5MB**
   - Automatic resizing to 200x200px
   - *Fallback to default avatar if upload fails*

2. **Contact Information**
   - Email address (with verification)
   - Phone number (optional, with format validation)
   - Address fields (street, city, country, postal code)

3. **Privacy Settings**
   - Profile visibility (public, friends only, private)
   - Email notification preferences
   - Data sharing consent management

##### 🎯 Should Have Features

- **Social Media Integration**
  - Link LinkedIn, Twitter, GitHub profiles
  - Import profile data from connected accounts
  - Automatic profile picture sync

- **Advanced Preferences**
  - Language and timezone selection
  - Theme preferences (light/dark/auto)
  - Accessibility options

## Technical Requirements

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| \`GET\` | \`/api/profile\` | Retrieve user profile |
| \`PUT\` | \`/api/profile\` | Update profile information |
| \`POST\` | \`/api/profile/avatar\` | Upload profile picture |
| \`DELETE\` | \`/api/profile/avatar\` | Remove profile picture |

### Validation Rules

\`\`\`javascript
const validationSchema = {
  email: {
    required: true,
    format: 'email',
    maxLength: 255
  },
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  lastName: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  phone: {
    required: false,
    format: 'international'
  }
}
\`\`\`

## Testing Scenarios

### 🧪 Functional Tests

1. **Valid Data Submission**
   - ✅ Form accepts valid profile data
   - ✅ Success message displayed after save
   - ✅ Data persisted in database
   - ✅ User redirected to profile view

2. **Invalid Data Handling**
   - ❌ Invalid email format rejected
   - ❌ Required fields cannot be empty
   - ❌ File size limits enforced
   - ❌ Unsupported file formats rejected

3. **Error Recovery**
   - 🔄 Network error handling with retry
   - 🔄 Form state preserved on error
   - 🔄 Clear error messages displayed

### 🔒 Security Tests

- **Input Sanitization**: All user inputs sanitized against XSS
- **File Upload Security**: Image files scanned for malware
- **Authorization**: Users can only edit their own profiles
- **Rate Limiting**: Profile updates limited to 10 per hour

## Performance Requirements

> **Response Time Targets**
> - Profile load: < 1 second
> - Profile update: < 2 seconds
> - Image upload: < 5 seconds
> - Form validation: < 100ms

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| IE | 11 | ❌ Not supported |

---

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Unit tests written with >90% coverage
- [ ] Integration tests pass
- [ ] UI/UX review completed
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Feature flag configuration ready

### 📋 Final Checklist

Before marking this feature as complete:

1. **Code Quality**
   - [ ] Code review approved by 2+ developers
   - [ ] No critical or high severity security issues
   - [ ] Performance profiling completed
   - [ ] Error handling comprehensive

2. **User Experience**
   - [ ] Responsive design works on all screen sizes
   - [ ] Loading states implemented
   - [ ] Error states are user-friendly
   - [ ] Success feedback is clear

3. **Production Readiness**
   - [ ] Monitoring and logging configured
   - [ ] Rollback plan documented
   - [ ] Feature flags tested
   - [ ] Database migrations tested

> **Note**: This feature requires coordination with the Security and DevOps teams for deployment.`,
      isValid: true,
    },
    onCriteriaChange: fn(),
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive markdown acceptance criteria showcasing all formatting features including tables, code blocks, checkboxes, and emojis.',
      },
    },
  },
};

/**
 * Interactive demo with templates
 */
export const Interactive: Story = {
  args: {
    criteria: {
      format: AcceptanceCriteriaFormat.PLAIN_TEXT,
      content: '',
      isValid: true,
    },
    onCriteriaChange: (criteria) => {
      console.log('Criteria changed:', criteria);
      fn()(criteria);
    },
    templates: mockTemplates,
    supportedFormats: Object.values(AcceptanceCriteriaFormat),
    showPreview: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing format switching, template application, and validation with console logging.',
      },
    },
  },
};
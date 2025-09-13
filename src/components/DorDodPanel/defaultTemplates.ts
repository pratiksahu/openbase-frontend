import type { DorDodTemplate } from './DorDodPanel.types';

export const defaultTemplates: DorDodTemplate[] = [
  {
    id: 'software-development-standard',
    name: 'Software Development',
    description: 'Standard DoR/DoD for software development tasks and user stories',
    category: 'software-development',
    isCustom: false,
    dorCriteria: [
      {
        description: 'Requirements are clearly defined and documented',
        category: 'required',
        helpText: 'All functional and non-functional requirements should be specified',
        validationRule: {
          type: 'required',
          message: 'Clear requirements are essential before starting development',
        },
        order: 1,
      },
      {
        description: 'Acceptance criteria are well-defined and testable',
        category: 'required',
        helpText: 'Each requirement should have clear, measurable acceptance criteria',
        validationRule: {
          type: 'required',
          message: 'Testable acceptance criteria are mandatory',
        },
        order: 2,
      },
      {
        description: 'Design mockups or wireframes are available',
        category: 'required',
        helpText: 'Visual guidance for implementation is provided',
        order: 3,
      },
      {
        description: 'Technical dependencies are identified',
        category: 'required',
        helpText: 'All required APIs, libraries, or services are documented',
        order: 4,
      },
      {
        description: 'Story is properly sized and estimated',
        category: 'recommended',
        helpText: 'Effort estimation helps with sprint planning',
        order: 5,
      },
      {
        description: 'Performance requirements are specified',
        category: 'recommended',
        helpText: 'Any specific performance criteria should be documented',
        order: 6,
      },
      {
        description: 'Security considerations are reviewed',
        category: 'recommended',
        helpText: 'Security implications should be assessed',
        order: 7,
      },
      {
        description: 'Accessibility requirements are defined',
        category: 'optional',
        helpText: 'WCAG compliance and accessibility standards',
        order: 8,
      },
    ],
    dodCriteria: [
      {
        description: 'Code is complete and follows coding standards',
        category: 'required',
        helpText: 'Implementation matches requirements and follows team conventions',
        validationRule: {
          type: 'required',
          message: 'Complete, standards-compliant code is mandatory',
        },
        order: 1,
      },
      {
        description: 'All tests pass (unit, integration, E2E)',
        category: 'required',
        helpText: 'Comprehensive test coverage with all tests green',
        validationRule: {
          type: 'required',
          message: 'All tests must pass before completion',
        },
        order: 2,
      },
      {
        description: 'Code has been reviewed and approved',
        category: 'required',
        helpText: 'Peer review completed with all feedback addressed',
        validationRule: {
          type: 'required',
          message: 'Code review approval is mandatory',
        },
        order: 3,
      },
      {
        description: 'Documentation is updated',
        category: 'required',
        helpText: 'Technical documentation, API docs, and user guides updated',
        order: 4,
      },
      {
        description: 'Feature has been tested in staging environment',
        category: 'recommended',
        helpText: 'End-to-end testing in production-like environment',
        order: 5,
      },
      {
        description: 'Performance benchmarks are met',
        category: 'recommended',
        helpText: 'Performance criteria from DoR are satisfied',
        order: 6,
      },
      {
        description: 'Security testing is completed',
        category: 'recommended',
        helpText: 'Security vulnerabilities have been assessed and addressed',
        order: 7,
      },
      {
        description: 'Accessibility testing is completed',
        category: 'optional',
        helpText: 'WCAG compliance verified through testing',
        order: 8,
      },
      {
        description: 'Monitoring and alerting are configured',
        category: 'optional',
        helpText: 'Observability tools are set up for the feature',
        order: 9,
      },
    ],
  },
  {
    id: 'design-standard',
    name: 'Design Project',
    description: 'DoR/DoD template for design tasks and creative projects',
    category: 'design',
    isCustom: false,
    dorCriteria: [
      {
        description: 'Design brief is approved by stakeholders',
        category: 'required',
        helpText: 'Clear creative direction and objectives are established',
        validationRule: {
          type: 'required',
          message: 'Approved design brief is essential',
        },
        order: 1,
      },
      {
        description: 'Target audience is clearly defined',
        category: 'required',
        helpText: 'Understanding of who will use/view the design',
        order: 2,
      },
      {
        description: 'Brand guidelines and assets are available',
        category: 'required',
        helpText: 'Logos, colors, fonts, and style guides accessible',
        order: 3,
      },
      {
        description: 'Content and copy are finalized',
        category: 'required',
        helpText: 'All text content is ready and approved',
        order: 4,
      },
      {
        description: 'Technical constraints are understood',
        category: 'recommended',
        helpText: 'Platform limitations, file formats, size requirements',
        order: 5,
      },
      {
        description: 'Competitive analysis is completed',
        category: 'recommended',
        helpText: 'Understanding of similar designs and market standards',
        order: 6,
      },
      {
        description: 'User research insights are available',
        category: 'optional',
        helpText: 'User feedback, surveys, or testing data',
        order: 7,
      },
    ],
    dodCriteria: [
      {
        description: 'Design meets all brief requirements',
        category: 'required',
        helpText: 'All objectives from the design brief are addressed',
        validationRule: {
          type: 'required',
          message: 'Brief compliance is mandatory',
        },
        order: 1,
      },
      {
        description: 'Design has been reviewed and approved',
        category: 'required',
        helpText: 'Stakeholder sign-off on the final design',
        validationRule: {
          type: 'required',
          message: 'Design approval is required',
        },
        order: 2,
      },
      {
        description: 'All assets are delivered in required formats',
        category: 'required',
        helpText: 'Files exported in correct formats, sizes, and resolutions',
        order: 3,
      },
      {
        description: 'Design system/style guide is updated',
        category: 'recommended',
        helpText: 'New components or styles documented for reuse',
        order: 4,
      },
      {
        description: 'Accessibility compliance is verified',
        category: 'recommended',
        helpText: 'Color contrast, readability, and usability checked',
        order: 5,
      },
      {
        description: 'Responsive behavior is documented',
        category: 'recommended',
        helpText: 'How design adapts to different screen sizes',
        order: 6,
      },
      {
        description: 'Design has been user tested',
        category: 'optional',
        helpText: 'Usability testing or feedback collection completed',
        order: 7,
      },
    ],
  },
  {
    id: 'content-standard',
    name: 'Content Creation',
    description: 'DoR/DoD for content writing, blog posts, and documentation',
    category: 'content',
    isCustom: false,
    dorCriteria: [
      {
        description: 'Topic and content strategy are defined',
        category: 'required',
        helpText: 'Clear understanding of what to write and why',
        validationRule: {
          type: 'required',
          message: 'Content strategy must be defined',
        },
        order: 1,
      },
      {
        description: 'Target audience is identified',
        category: 'required',
        helpText: 'Who will read this content and their needs',
        order: 2,
      },
      {
        description: 'Content outline is approved',
        category: 'required',
        helpText: 'Structure and main points agreed upon',
        order: 3,
      },
      {
        description: 'Research sources are verified',
        category: 'required',
        helpText: 'All facts and claims have reliable sources',
        order: 4,
      },
      {
        description: 'SEO keywords are researched',
        category: 'recommended',
        helpText: 'Target keywords for search optimization identified',
        order: 5,
      },
      {
        description: 'Content calendar slot is confirmed',
        category: 'recommended',
        helpText: 'Publication date and promotion plan in place',
        order: 6,
      },
      {
        description: 'Visual assets are planned',
        category: 'optional',
        helpText: 'Images, graphics, or videos to accompany content',
        order: 7,
      },
    ],
    dodCriteria: [
      {
        description: 'Content is complete and matches outline',
        category: 'required',
        helpText: 'All planned sections and topics covered',
        validationRule: {
          type: 'required',
          message: 'Complete content matching outline is required',
        },
        order: 1,
      },
      {
        description: 'Content has been edited and proofread',
        category: 'required',
        helpText: 'Grammar, spelling, and clarity reviewed',
        validationRule: {
          type: 'required',
          message: 'Professional editing is mandatory',
        },
        order: 2,
      },
      {
        description: 'All sources are properly cited',
        category: 'required',
        helpText: 'Attribution and links to reference materials',
        order: 3,
      },
      {
        description: 'SEO optimization is complete',
        category: 'recommended',
        helpText: 'Meta descriptions, headings, and keyword optimization',
        order: 4,
      },
      {
        description: 'Content is formatted for publication',
        category: 'recommended',
        helpText: 'Proper headings, spacing, and visual formatting',
        order: 5,
      },
      {
        description: 'Social media assets are prepared',
        category: 'recommended',
        helpText: 'Graphics and copy for content promotion',
        order: 6,
      },
      {
        description: 'Content performance metrics are set up',
        category: 'optional',
        helpText: 'Analytics tracking for engagement and success',
        order: 7,
      },
    ],
  },
  {
    id: 'marketing-campaign',
    name: 'Marketing Campaign',
    description: 'DoR/DoD for marketing campaigns and promotional activities',
    category: 'marketing',
    isCustom: false,
    dorCriteria: [
      {
        description: 'Campaign objectives are clearly defined',
        category: 'required',
        helpText: 'Specific, measurable goals for the campaign',
        validationRule: {
          type: 'required',
          message: 'Clear campaign objectives are essential',
        },
        order: 1,
      },
      {
        description: 'Target audience is segmented and defined',
        category: 'required',
        helpText: 'Detailed personas and audience characteristics',
        order: 2,
      },
      {
        description: 'Budget is approved and allocated',
        category: 'required',
        helpText: 'Financial resources confirmed for all campaign elements',
        order: 3,
      },
      {
        description: 'Creative assets are approved',
        category: 'required',
        helpText: 'All visual and copy materials signed off',
        order: 4,
      },
      {
        description: 'Channel strategy is finalized',
        category: 'recommended',
        helpText: 'Which platforms, media, and touchpoints to use',
        order: 5,
      },
      {
        description: 'Success metrics and KPIs are defined',
        category: 'recommended',
        helpText: 'How campaign success will be measured',
        order: 6,
      },
    ],
    dodCriteria: [
      {
        description: 'Campaign is fully launched across all channels',
        category: 'required',
        helpText: 'All planned touchpoints are active',
        validationRule: {
          type: 'required',
          message: 'Full campaign launch is required',
        },
        order: 1,
      },
      {
        description: 'Performance tracking is implemented',
        category: 'required',
        helpText: 'Analytics and measurement tools are active',
        order: 2,
      },
      {
        description: 'Initial performance data is collected',
        category: 'recommended',
        helpText: 'At least 48-72 hours of campaign data available',
        order: 3,
      },
      {
        description: 'Campaign performance report is generated',
        category: 'recommended',
        helpText: 'Summary of results against objectives',
        order: 4,
      },
      {
        description: 'Budget reconciliation is complete',
        category: 'recommended',
        helpText: 'Actual spend vs. planned budget documented',
        order: 5,
      },
      {
        description: 'Lessons learned are documented',
        category: 'optional',
        helpText: 'Insights for future campaign optimization',
        order: 6,
      },
    ],
  },
  {
    id: 'research-project',
    name: 'Research Project',
    description: 'DoR/DoD for research tasks and investigative work',
    category: 'research',
    isCustom: false,
    dorCriteria: [
      {
        description: 'Research questions are clearly formulated',
        category: 'required',
        helpText: 'Specific questions the research aims to answer',
        validationRule: {
          type: 'required',
          message: 'Clear research questions are mandatory',
        },
        order: 1,
      },
      {
        description: 'Research methodology is defined',
        category: 'required',
        helpText: 'Approach, methods, and techniques to be used',
        order: 2,
      },
      {
        description: 'Data sources are identified and accessible',
        category: 'required',
        helpText: 'Primary and secondary sources confirmed',
        order: 3,
      },
      {
        description: 'Timeline and milestones are established',
        category: 'recommended',
        helpText: 'Research phases and completion dates planned',
        order: 4,
      },
      {
        description: 'Ethical considerations are reviewed',
        category: 'recommended',
        helpText: 'Privacy, consent, and ethical implications assessed',
        order: 5,
      },
      {
        description: 'Budget and resources are secured',
        category: 'optional',
        helpText: 'Funding and tools needed for research',
        order: 6,
      },
    ],
    dodCriteria: [
      {
        description: 'All research questions are answered',
        category: 'required',
        helpText: 'Comprehensive responses to initial questions',
        validationRule: {
          type: 'required',
          message: 'Complete answers to research questions required',
        },
        order: 1,
      },
      {
        description: 'Findings are documented and analyzed',
        category: 'required',
        helpText: 'Data analysis and interpretation completed',
        order: 2,
      },
      {
        description: 'Sources are properly documented',
        category: 'required',
        helpText: 'All references cited and verifiable',
        order: 3,
      },
      {
        description: 'Research report is peer reviewed',
        category: 'recommended',
        helpText: 'Expert validation of methodology and findings',
        order: 4,
      },
      {
        description: 'Key insights and recommendations provided',
        category: 'recommended',
        helpText: 'Actionable conclusions from research',
        order: 5,
      },
      {
        description: 'Research data is archived appropriately',
        category: 'optional',
        helpText: 'Data stored securely for future reference',
        order: 6,
      },
    ],
  },
];

export function getTemplateById(id: string): DorDodTemplate | undefined {
  return defaultTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: DorDodTemplate['category']): DorDodTemplate[] {
  return defaultTemplates.filter(template => template.category === category);
}

export function createCustomTemplate(
  name: string,
  description: string,
  dorCriteria: DorDodTemplate['dorCriteria'],
  dodCriteria: DorDodTemplate['dodCriteria']
): DorDodTemplate {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    category: 'custom',
    dorCriteria,
    dodCriteria,
    isCustom: true,
  };
}
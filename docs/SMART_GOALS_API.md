# SMART Goals API Reference

## Base URL
```
https://api.yoursite.com/v1
```

## Authentication

All API requests require authentication using Bearer tokens:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     https://api.yoursite.com/v1/goals
```

## Rate Limiting

- **Rate Limit**: 1000 requests per hour per user
- **Headers**: Rate limit information is included in response headers
  - `X-RateLimit-Limit`: Maximum requests per hour
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required and must be at least 3 characters"
      }
    ],
    "requestId": "req_123456789"
  }
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Goals API

### List Goals

**GET** `/goals`

Retrieve a paginated list of goals with optional filtering.

#### Query Parameters

| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `page` | integer | Page number (1-based) | 1 | `?page=2` |
| `limit` | integer | Items per page (1-100) | 20 | `?limit=50` |
| `status` | string | Filter by status | all | `?status=active` |
| `priority` | string | Filter by priority | all | `?priority=high` |
| `category` | string | Filter by category | all | `?category=professional` |
| `search` | string | Search in title/description | - | `?search=marketing` |
| `sort` | string | Sort field | `updatedAt` | `?sort=title` |
| `order` | string | Sort order (asc/desc) | desc | `?order=asc` |
| `owner` | string | Filter by owner ID | - | `?owner=user123` |
| `tags` | string | Filter by tags (comma-separated) | - | `?tags=urgent,review` |

#### Example Request

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://api.yoursite.com/v1/goals?status=active&priority=high&page=1&limit=20"
```

#### Response

```json
{
  "data": [
    {
      "id": "goal_123456789",
      "title": "Complete Q4 Marketing Campaign",
      "description": "Launch comprehensive marketing campaign for Q4 product release",
      "status": "active",
      "priority": "high",
      "category": "professional",
      "progress": 65,
      "smartScore": 87,
      "ownerId": "user_987654321",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-02-10T14:30:00Z",
      "targetDate": "2024-12-31T23:59:59Z",
      "tags": ["marketing", "q4", "launch"],
      "collaborators": ["user_111111111", "user_222222222"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "totalActive": 45,
    "totalCompleted": 78,
    "totalDraft": 15,
    "totalOverdue": 12
  }
}
```

### Create Goal

**POST** `/goals`

Create a new SMART goal.

#### Request Body

```json
{
  "title": "Complete Advanced React Training",
  "description": "Master advanced React concepts including hooks, context, and performance optimization",
  "specificObjective": "Complete all 12 modules of the advanced React course with 90% score on assessments",
  "category": "education",
  "priority": "medium",
  "tags": ["react", "training", "frontend"],
  "collaborators": ["user_123", "user_456"],
  "measurable": {
    "metricType": "percentage",
    "targetValue": 100,
    "currentValue": 0,
    "unit": "percent",
    "higherIsBetter": true,
    "measurementFrequency": "weekly"
  },
  "achievability": {
    "score": 0.85,
    "requiredResources": [
      {
        "name": "Time",
        "type": "time",
        "quantity": 40,
        "unit": "hours",
        "isAvailable": true
      }
    ],
    "requiredSkills": [
      {
        "name": "Basic React",
        "requiredLevel": 7,
        "currentLevel": 8,
        "isCritical": true
      }
    ],
    "constraints": [
      {
        "description": "Limited study time due to work commitments",
        "type": "time",
        "impactLevel": 5,
        "mitigationStrategy": "Schedule dedicated study hours"
      }
    ],
    "successProbability": 0.85
  },
  "relevance": {
    "rationale": "Essential for career advancement and current project requirements",
    "strategyAlignments": [
      {
        "strategicGoalId": "strategy_123",
        "alignmentDescription": "Supports technical skill development goal",
        "alignmentStrength": 0.9
      }
    ],
    "stakeholders": [
      {
        "name": "Team Lead",
        "role": "Supervisor",
        "influence": 0.8,
        "interest": 0.9,
        "stance": "supportive"
      }
    ],
    "expectedBenefits": [
      "Improved code quality",
      "Better performance optimization",
      "Enhanced team productivity"
    ],
    "relevanceScore": 0.9
  },
  "timebound": {
    "startDate": "2024-02-01T00:00:00Z",
    "targetDate": "2024-05-01T23:59:59Z",
    "estimatedDuration": 90,
    "isRecurring": false,
    "dependencies": []
  }
}
```

#### Response

```json
{
  "data": {
    "id": "goal_987654321",
    "title": "Complete Advanced React Training",
    "status": "draft",
    "smartScore": 85,
    "progress": 0,
    "createdAt": "2024-02-01T10:00:00Z",
    "updatedAt": "2024-02-01T10:00:00Z"
  }
}
```

### Get Goal

**GET** `/goals/{goalId}`

Retrieve detailed information about a specific goal.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `goalId` | string | Unique goal identifier |

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `include` | string | Related data to include | - |

**Include options:**
- `tasks`: Include all tasks
- `metrics`: Include metric checkpoints
- `comments`: Include comments and reviews
- `history`: Include activity history

#### Example Request

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://api.yoursite.com/v1/goals/goal_123456789?include=tasks,metrics"
```

#### Response

```json
{
  "data": {
    "id": "goal_123456789",
    "title": "Complete Q4 Marketing Campaign",
    "description": "Launch comprehensive marketing campaign for Q4 product release",
    "specificObjective": "Execute multi-channel marketing campaign reaching 100K potential customers",
    "status": "active",
    "priority": "high",
    "category": "professional",
    "progress": 65,
    "smartScore": 87,
    "ownerId": "user_987654321",
    "collaborators": ["user_111111111", "user_222222222"],
    "tags": ["marketing", "q4", "launch"],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-02-10T14:30:00Z",
    "measurable": {
      "metricType": "number",
      "targetValue": 100000,
      "currentValue": 65000,
      "unit": "customers",
      "higherIsBetter": true,
      "measurementFrequency": "weekly"
    },
    "achievability": {
      "score": 0.87,
      "successProbability": 0.83,
      "lastAssessedAt": "2024-01-15T10:00:00Z"
    },
    "relevance": {
      "rationale": "Critical for Q4 revenue targets and brand awareness",
      "relevanceScore": 0.95,
      "valueScore": 0.88
    },
    "timebound": {
      "startDate": "2024-01-15T00:00:00Z",
      "targetDate": "2024-12-31T23:59:59Z",
      "estimatedDuration": 351,
      "isRecurring": false
    },
    "tasks": [
      {
        "id": "task_111111111",
        "title": "Design campaign visuals",
        "status": "completed",
        "progress": 100,
        "assignedTo": "user_333333333"
      }
    ],
    "checkpoints": [
      {
        "id": "checkpoint_111111111",
        "value": 65000,
        "recordedDate": "2024-02-10T00:00:00Z",
        "note": "Monthly progress review"
      }
    ]
  }
}
```

### Update Goal

**PUT** `/goals/{goalId}`

Update an existing goal. Supports partial updates.

#### Request Body

```json
{
  "title": "Updated Goal Title",
  "status": "active",
  "progress": 75,
  "measurable": {
    "currentValue": 75000
  }
}
```

#### Response

```json
{
  "data": {
    "id": "goal_123456789",
    "title": "Updated Goal Title",
    "status": "active",
    "progress": 75,
    "updatedAt": "2024-02-11T10:00:00Z"
  }
}
```

### Delete Goal

**DELETE** `/goals/{goalId}`

Delete a goal (soft delete - goal is archived, not permanently removed).

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `permanent` | boolean | Permanently delete (admin only) | false |

#### Response

```json
{
  "data": {
    "id": "goal_123456789",
    "status": "deleted",
    "deletedAt": "2024-02-11T10:00:00Z"
  }
}
```

## Tasks API

### List Tasks

**GET** `/goals/{goalId}/tasks`

Retrieve all tasks for a specific goal.

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `status` | string | Filter by task status | all |
| `assignee` | string | Filter by assignee ID | all |
| `priority` | string | Filter by priority | all |
| `include` | string | Include related data | - |

#### Response

```json
{
  "data": [
    {
      "id": "task_123456789",
      "title": "Create marketing content",
      "description": "Develop blog posts, social media content, and email templates",
      "status": "in_progress",
      "priority": "high",
      "progress": 60,
      "assignedTo": "user_111111111",
      "estimatedHours": 20,
      "actualHours": 12,
      "dueDate": "2024-03-01T23:59:59Z",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-02-10T14:30:00Z",
      "subtasks": [
        {
          "id": "subtask_111111111",
          "title": "Write blog post #1",
          "status": "completed",
          "progress": 100
        }
      ],
      "checklist": [
        {
          "id": "item_111111111",
          "text": "Research target keywords",
          "isCompleted": true
        }
      ]
    }
  ]
}
```

### Create Task

**POST** `/goals/{goalId}/tasks`

Create a new task within a goal.

#### Request Body

```json
{
  "title": "Implement user authentication",
  "description": "Set up secure user login and registration system",
  "priority": "high",
  "estimatedHours": 16,
  "dueDate": "2024-03-15T23:59:59Z",
  "assignedTo": "user_123456789",
  "tags": ["authentication", "security", "backend"],
  "subtasks": [
    {
      "title": "Design database schema",
      "estimatedHours": 4,
      "priority": "high"
    }
  ],
  "checklist": [
    {
      "text": "Set up password hashing",
      "isRequired": true
    },
    {
      "text": "Implement JWT tokens",
      "isRequired": true
    }
  ],
  "acceptanceCriteria": [
    "Users can register with email and password",
    "Users can log in with valid credentials",
    "Passwords are securely hashed",
    "JWT tokens expire after 24 hours"
  ]
}
```

### Update Task Status

**PATCH** `/goals/{goalId}/tasks/{taskId}/status`

Update task status with automatic progress calculation.

#### Request Body

```json
{
  "status": "completed",
  "completedAt": "2024-02-11T10:00:00Z",
  "actualHours": 18,
  "notes": "Task completed ahead of schedule"
}
```

## Metrics API

### List Checkpoints

**GET** `/goals/{goalId}/checkpoints`

Retrieve metric checkpoints for a goal.

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `from` | string | Start date (ISO 8601) | - |
| `to` | string | End date (ISO 8601) | - |
| `limit` | integer | Maximum results | 100 |

#### Response

```json
{
  "data": [
    {
      "id": "checkpoint_123456789",
      "value": 75000,
      "recordedDate": "2024-02-10T00:00:00Z",
      "note": "Monthly progress review - on track",
      "source": "manual",
      "isAutomatic": false,
      "confidence": 0.9,
      "createdBy": "user_987654321",
      "createdAt": "2024-02-10T10:00:00Z"
    }
  ],
  "analytics": {
    "trend": "increasing",
    "velocity": 2500,
    "projectedCompletion": "2024-11-15T00:00:00Z",
    "confidenceLevel": 0.85,
    "status": "on_track"
  }
}
```

### Add Checkpoint

**POST** `/goals/{goalId}/checkpoints`

Record a new metric checkpoint.

#### Request Body

```json
{
  "value": 85000,
  "recordedDate": "2024-02-15T00:00:00Z",
  "note": "Significant progress after campaign optimization",
  "evidence": "Link to analytics dashboard",
  "confidence": 0.95
}
```

### Get Analytics

**GET** `/goals/{goalId}/analytics`

Get detailed progress analytics for a goal.

#### Response

```json
{
  "data": {
    "progressPercentage": 75,
    "trend": "increasing",
    "velocity": 2500,
    "projectedCompletion": "2024-11-15T00:00:00Z",
    "status": "on_track",
    "daysToTarget": 45,
    "confidenceLevel": 0.85,
    "riskFactors": [
      {
        "type": "timeline",
        "severity": "low",
        "description": "Slight delay in content creation",
        "mitigation": "Increased team capacity allocated"
      }
    ],
    "insights": [
      "Progress velocity has increased 20% this month",
      "Current trajectory suggests early completion",
      "Resource utilization is optimal"
    ],
    "recommendations": [
      "Consider advancing timeline by 2 weeks",
      "Allocate additional resources to high-impact tasks",
      "Schedule mid-point review meeting"
    ]
  }
}
```

## Comments API

### List Comments

**GET** `/goals/{goalId}/comments`

Retrieve comments for a goal.

#### Response

```json
{
  "data": [
    {
      "id": "comment_123456789",
      "content": "Great progress on this goal! The metrics look promising.",
      "author": "user_987654321",
      "createdAt": "2024-02-10T14:30:00Z",
      "updatedAt": "2024-02-10T14:30:00Z",
      "isEdited": false,
      "parentId": null,
      "replies": [
        {
          "id": "comment_987654321",
          "content": "Thanks! The team has been working really hard on this.",
          "author": "user_111111111",
          "createdAt": "2024-02-10T15:00:00Z",
          "parentId": "comment_123456789"
        }
      ]
    }
  ]
}
```

### Add Comment

**POST** `/goals/{goalId}/comments`

Add a comment to a goal.

#### Request Body

```json
{
  "content": "This goal is progressing well. Consider adding more specific metrics for better tracking.",
  "parentId": "comment_123456789"  // optional for replies
}
```

## Review API

### Submit Review

**POST** `/goals/{goalId}/review`

Submit a review decision (approve/reject) for a goal.

#### Request Body

```json
{
  "decision": "approve",  // "approve" | "reject" | "request_changes"
  "comment": "Goal meets all SMART criteria and is ready for execution",
  "dorCompleted": true,
  "dodCompleted": false,
  "criteria": [
    {
      "name": "specific",
      "met": true,
      "notes": "Clear and well-defined objective"
    },
    {
      "name": "measurable",
      "met": true,
      "notes": "Quantifiable metrics defined"
    }
  ]
}
```

## Webhooks

### Webhook Events

Subscribe to webhook events to receive real-time updates.

#### Available Events

- `goal.created`: New goal created
- `goal.updated`: Goal updated
- `goal.completed`: Goal marked as completed
- `goal.deleted`: Goal deleted
- `task.created`: New task created
- `task.updated`: Task updated
- `task.completed`: Task completed
- `checkpoint.added`: New metric checkpoint added
- `comment.added`: New comment added
- `review.submitted`: Review submitted

#### Webhook Payload

```json
{
  "event": "goal.updated",
  "timestamp": "2024-02-11T10:00:00Z",
  "data": {
    "id": "goal_123456789",
    "title": "Updated Goal Title",
    "status": "active",
    "progress": 75,
    "changes": {
      "progress": { "from": 65, "to": 75 },
      "updatedAt": { "from": "2024-02-10T14:30:00Z", "to": "2024-02-11T10:00:00Z" }
    }
  },
  "user": {
    "id": "user_987654321",
    "name": "John Doe"
  }
}
```

### Webhook Configuration

Configure webhooks in your application settings:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourapp.com/webhooks/smart-goals",
    "events": ["goal.updated", "task.completed"],
    "secret": "your-webhook-secret"
  }' \
  https://api.yoursite.com/v1/webhooks
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import { SmartGoalsAPI } from '@smart-goals/api-client';

const api = new SmartGoalsAPI({
  baseURL: 'https://api.yoursite.com/v1',
  token: 'your-auth-token'
});

// Create a new goal
const goal = await api.goals.create({
  title: 'Complete API Integration',
  description: 'Integrate SMART Goals API into our application',
  // ... other goal properties
});

// List goals with filtering
const goals = await api.goals.list({
  status: 'active',
  priority: 'high',
  page: 1,
  limit: 20
});

// Add a metric checkpoint
const checkpoint = await api.checkpoints.create(goal.id, {
  value: 75,
  note: 'Halfway point reached'
});

// Subscribe to real-time updates
api.subscribe('goal.updated', (event) => {
  console.log('Goal updated:', event.data);
});
```

### Python

```python
from smart_goals import SmartGoalsClient

client = SmartGoalsClient(
    base_url='https://api.yoursite.com/v1',
    token='your-auth-token'
)

# Create a goal
goal = client.goals.create({
    'title': 'Complete Python Integration',
    'description': 'Integrate SMART Goals API using Python',
    'category': 'professional'
})

# List goals
goals = client.goals.list(status='active', priority='high')

# Add checkpoint
checkpoint = client.checkpoints.create(goal['id'], {
    'value': 80,
    'note': 'Almost complete'
})
```

## Testing

### Test Environment

Use the test environment for development and testing:

- **Base URL**: `https://api-test.yoursite.com/v1`
- **Test Data**: Pre-populated with sample goals and tasks
- **Rate Limits**: Relaxed limits for testing

### API Testing

```bash
# Health check
curl https://api.yoursite.com/v1/health

# Authenticate (returns test token)
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass"}' \
  https://api-test.yoursite.com/v1/auth/login
```

## Support

For API support and questions:
- **Documentation**: [https://docs.yoursite.com/api](https://docs.yoursite.com/api)
- **Status Page**: [https://status.yoursite.com](https://status.yoursite.com)
- **Support Email**: api-support@yoursite.com
- **GitHub Issues**: [https://github.com/yourorg/smart-goals-api](https://github.com/yourorg/smart-goals-api)

---

**Last Updated**: December 2024
**API Version**: v1
**OpenAPI Spec**: [https://api.yoursite.com/v1/openapi.json](https://api.yoursite.com/v1/openapi.json)
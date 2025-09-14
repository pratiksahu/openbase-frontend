/**
 * Goal Review View Page
 *
 * Review and approval interface for goals with DoR/DoD panel,
 * comments, approval workflow, and change history tracking.
 */

'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Edit,
  History,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DorDodPanel } from '@/components/DorDodPanel/DorDodPanel';

import type { SmartGoal } from '@/types/smart-goals.types';
import { mockGoals } from '@/lib/mock-data/smart-goals';

// =============================================================================
// Types and Interfaces
// =============================================================================

interface ReviewPageProps {
  params: {
    id: string;
  };
}

interface ReviewComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'comment' | 'approval' | 'rejection' | 'change_request';
  parentId?: string;
  attachments?: string[];
}

interface ReviewAction {
  id: string;
  type: 'created' | 'updated' | 'approved' | 'rejected' | 'commented';
  user: string;
  timestamp: Date;
  details: string;
  changes?: Record<string, { old: any; new: any }>;
}

interface ReviewStatus {
  status: 'pending' | 'approved' | 'rejected' | 'needs_changes';
  approvers: string[];
  rejectors: string[];
  requiredApprovers: number;
  currentApprovers: number;
  lastReviewDate?: Date;
}

// =============================================================================
// Helper Functions
// =============================================================================

async function getGoal(id: string): Promise<SmartGoal | null> {
  // TODO: Replace with actual API call
  return mockGoals.find(goal => goal.id === id) || null;
}

const mockComments: ReviewComment[] = [
  {
    id: '1',
    author: 'john.doe',
    content: 'The goal looks well-defined, but I think the timeline might be a bit aggressive. Have you considered extending the deadline by 2 weeks?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    type: 'comment',
  },
  {
    id: '2',
    author: 'sarah.smith',
    content: 'I agree with John. The success criteria are clear and measurable, which is great. However, the resource allocation section needs more detail.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    type: 'comment',
  },
  {
    id: '3',
    author: 'mike.wilson',
    content: 'Overall looks good to me. The SMART criteria are well-addressed.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    type: 'approval',
  },
];

const mockReviewActions: ReviewAction[] = [
  {
    id: '1',
    type: 'created',
    user: 'goal.owner',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    details: 'Goal created and submitted for review',
  },
  {
    id: '2',
    type: 'commented',
    user: 'john.doe',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: 'Added comment about timeline concerns',
  },
  {
    id: '3',
    type: 'commented',
    user: 'sarah.smith',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    details: 'Requested more details on resource allocation',
  },
  {
    id: '4',
    type: 'approved',
    user: 'mike.wilson',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    details: 'Approved the goal',
  },
];

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

// =============================================================================
// Components
// =============================================================================

interface CommentCardProps {
  comment: ReviewComment;
  onReply?: (commentId: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onReply }) => {
  const getTypeIcon = () => {
    switch (comment.type) {
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejection':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'change_request':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTypeBadge = () => {
    switch (comment.type) {
      case 'approval':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejection':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'change_request':
        return <Badge className="bg-orange-100 text-orange-800">Change Request</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${comment.author}`} />
            <AvatarFallback>
              {comment.author.split('.').map(n => n[0].toUpperCase()).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{comment.author}</span>
                {getTypeBadge()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {getTypeIcon()}
                <span>{formatTimeAgo(comment.timestamp)}</span>
              </div>
            </div>

            <p className="text-sm mb-3">{comment.content}</p>

            {comment.attachments && comment.attachments.length > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {comment.attachments.length} attachment(s)
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply?.(comment.id)}
              className="text-xs"
            >
              Reply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ReviewStatusCardProps {
  status: ReviewStatus;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: () => void;
}

const ReviewStatusCard: React.FC<ReviewStatusCardProps> = ({
  status,
  onApprove,
  onReject,
  onRequestChanges
}) => {
  const getStatusColor = () => {
    switch (status.status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'needs_changes':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'needs_changes':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Review Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-medium capitalize">
              {status.status.replace('_', ' ')}
            </span>
          </div>
          <Badge className={getStatusColor()}>
            {status.currentApprovers}/{status.requiredApprovers} approvals
          </Badge>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Approvers ({status.approvers.length})</h4>
            {status.approvers.length > 0 ? (
              <div className="flex items-center space-x-2">
                {status.approvers.slice(0, 3).map(approver => (
                  <Avatar key={approver} className="h-6 w-6">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${approver}`} />
                    <AvatarFallback className="text-xs">
                      {approver.split('.').map(n => n[0].toUpperCase()).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {status.approvers.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                    +{status.approvers.length - 3}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No approvals yet</p>
            )}
          </div>

          {status.rejectors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Rejectors ({status.rejectors.length})</h4>
              <div className="flex items-center space-x-2">
                {status.rejectors.slice(0, 3).map(rejector => (
                  <Avatar key={rejector} className="h-6 w-6">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${rejector}`} />
                    <AvatarFallback className="text-xs">
                      {rejector.split('.').map(n => n[0].toUpperCase()).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {status.rejectors.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                    +{status.rejectors.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex space-x-2">
          <Button onClick={onApprove} className="flex-1" size="sm">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button onClick={onReject} variant="destructive" className="flex-1" size="sm">
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button onClick={onRequestChanges} variant="outline" className="flex-1" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ActivityTimelineProps {
  actions: ReviewAction[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ actions }) => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'updated':
        return <Edit className="h-4 w-4 text-orange-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'commented':
        return <MessageCircle className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {actions.map((action, index) => (
        <div key={action.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getActionIcon(action.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <span className="font-medium">{action.user}</span> {action.details}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(action.timestamp)}
              </span>
            </div>
            {action.changes && (
              <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                <span className="font-medium">Changes made:</span>
                <ul className="mt-1 space-y-1">
                  {Object.entries(action.changes).map(([field, change]) => (
                    <li key={field} className="flex items-center space-x-2">
                      <span>{field}:</span>
                      <span className="text-red-600">"{change.old}"</span>
                      <span>→</span>
                      <span className="text-green-600">"{change.new}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// Main Review Page Component
// =============================================================================

export default function GoalReviewPage({ params }: ReviewPageProps) {
  const [goal, setGoal] = React.useState<SmartGoal | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [reviewStatus] = useState<ReviewStatus>({
    status: 'pending',
    approvers: ['mike.wilson'],
    rejectors: [],
    requiredApprovers: 3,
    currentApprovers: 1,
  });

  // Load goal data
  React.useEffect(() => {
    const loadGoal = async () => {
      const goalData = await getGoal(params.id);
      if (goalData) {
        setGoal(goalData);
      }
    };

    loadGoal();
  }, [params.id]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: ReviewComment = {
        id: Date.now().toString(),
        author: 'current.user',
        content: newComment,
        timestamp: new Date(),
        type: 'comment',
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleApprove = () => {
    // TODO: Implement approval logic
    console.log('Approve goal');
  };

  const handleReject = () => {
    // TODO: Implement rejection logic
    console.log('Reject goal');
  };

  const handleRequestChanges = () => {
    // TODO: Implement change request logic
    console.log('Request changes');
  };

  if (!goal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading review...</div>
          <div className="text-sm text-muted-foreground">
            Preparing goal review interface
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="review" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="review">Review & Comments</TabsTrigger>
          <TabsTrigger value="dor-dod">DoR/DoD Checklist</TabsTrigger>
          <TabsTrigger value="history">Change History</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Comments & Feedback</span>
                    <Badge variant="secondary">{comments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add your comment or feedback..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center justify-between">
                      <Select defaultValue="comment">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comment">General Comment</SelectItem>
                          <SelectItem value="approval">Approval</SelectItem>
                          <SelectItem value="rejection">Rejection</SelectItem>
                          <SelectItem value="change_request">Change Request</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        Add Comment
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}

                    {comments.length === 0 && (
                      <div className="text-center py-8">
                        <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No comments yet. Be the first to provide feedback!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Review Status */}
              <ReviewStatusCard
                status={reviewStatus}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestChanges={handleRequestChanges}
              />

              {/* Goal Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Goal Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Status</h4>
                    <Badge>{goal.status}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Priority</h4>
                    <Badge variant="outline">{goal.priority}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Owner</h4>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${goal.ownerId}`} />
                        <AvatarFallback className="text-xs">
                          {goal.ownerId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{goal.ownerId}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Due Date</h4>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{goal.timebound.targetDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dor-dod" className="space-y-6">
          <DorDodPanel
            goalId={goal.id}
            mode="review"
            onSave={(data) => {
              console.log('DoR/DoD saved:', data);
            }}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Change History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline actions={mockReviewActions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useState } from 'react';

import { Progress } from './progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A progress bar component for showing completion progress with smooth transitions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The progress value (0-100)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic progress bar
 */
export const Default: Story = {
  args: {
    value: 60,
    className: 'w-[400px]',
  },
};

/**
 * Different progress values
 */
export const Values: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm">Empty</span>
          <span className="text-sm">0%</span>
        </div>
        <Progress value={0} />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm">Low</span>
          <span className="text-sm">25%</span>
        </div>
        <Progress value={25} />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm">Half</span>
          <span className="text-sm">50%</span>
        </div>
        <Progress value={50} />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm">High</span>
          <span className="text-sm">75%</span>
        </div>
        <Progress value={75} />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm">Complete</span>
          <span className="text-sm">100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress bars showing different completion percentages.',
      },
    },
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <p className="text-sm mb-2">Small (h-1)</p>
        <Progress value={60} className="h-1" />
      </div>
      
      <div>
        <p className="text-sm mb-2">Default (h-2)</p>
        <Progress value={60} />
      </div>
      
      <div>
        <p className="text-sm mb-2">Medium (h-3)</p>
        <Progress value={60} className="h-3" />
      </div>
      
      <div>
        <p className="text-sm mb-2">Large (h-4)</p>
        <Progress value={60} className="h-4" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress bars in different heights/sizes.',
      },
    },
  },
};

/**
 * Animated progress
 */
export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);
    
    return (
      <div className="w-[400px]">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Loading...</span>
          <span className="text-sm">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated progress bar that fills over time.',
      },
    },
  },
};

/**
 * File upload progress
 */
export const FileUpload: Story = {
  render: () => {
    const [uploads, setUploads] = useState([
      { name: 'document.pdf', progress: 100, status: 'complete' },
      { name: 'image.jpg', progress: 75, status: 'uploading' },
      { name: 'video.mp4', progress: 30, status: 'uploading' },
      { name: 'archive.zip', progress: 0, status: 'pending' },
    ]);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setUploads(prev => prev.map(upload => {
          if (upload.status === 'uploading' && upload.progress < 100) {
            const newProgress = Math.min(100, upload.progress + Math.random() * 10);
            return {
              ...upload,
              progress: newProgress,
              status: newProgress === 100 ? 'complete' : 'uploading'
            };
          }
          return upload;
        }));
      }, 1000);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="space-y-4 w-[400px]">
        {uploads.map((upload, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{upload.name}</span>
              <span className={
                upload.status === 'complete' ? 'text-green-600' :
                upload.status === 'uploading' ? 'text-blue-600' :
                'text-gray-500'
              }>
                {upload.status === 'complete' ? 'Complete' : 
                 upload.status === 'uploading' ? `${Math.round(upload.progress)}%` :
                 'Pending'}
              </span>
            </div>
            <Progress 
              value={upload.progress}
              className={
                upload.status === 'complete' ? '[&>div]:bg-green-600' :
                upload.status === 'uploading' ? '[&>div]:bg-blue-600' :
                '[&>div]:bg-gray-400'
              }
            />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple file upload progress with different states and colors.',
      },
    },
  },
};

/**
 * Skill progress bars
 */
export const Skills: Story = {
  render: () => {
    const skills = [
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'React', level: 95 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 70 },
    ];
    
    return (
      <div className="space-y-4 w-[400px]">
        <h3 className="text-lg font-semibold">Skills</h3>
        {skills.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{skill.name}</span>
              <span>{skill.level}%</span>
            </div>
            <Progress 
              value={skill.level}
              className={
                skill.level >= 90 ? '[&>div]:bg-green-600' :
                skill.level >= 80 ? '[&>div]:bg-blue-600' :
                skill.level >= 70 ? '[&>div]:bg-yellow-600' :
                '[&>div]:bg-red-600'
              }
            />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Skills or proficiency indicators with color coding.',
      },
    },
  },
};

/**
 * Custom colors
 */
export const CustomColors: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <p className="text-sm mb-2">Default</p>
        <Progress value={60} />
      </div>
      
      <div>
        <p className="text-sm mb-2">Success</p>
        <Progress value={60} className="[&>div]:bg-green-600" />
      </div>
      
      <div>
        <p className="text-sm mb-2">Warning</p>
        <Progress value={60} className="[&>div]:bg-yellow-600" />
      </div>
      
      <div>
        <p className="text-sm mb-2">Error</p>
        <Progress value={60} className="[&>div]:bg-red-600" />
      </div>
      
      <div>
        <p className="text-sm mb-2">Purple</p>
        <Progress value={60} className="[&>div]:bg-purple-600" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress bars with different color schemes.',
      },
    },
  },
};

/**
 * Indeterminate progress
 */
export const Indeterminate: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <p className="text-sm mb-2">Loading (indeterminate)</p>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
          <div className="absolute h-full w-1/3 bg-primary animate-pulse"></div>
        </div>
      </div>
      
      <div>
        <p className="text-sm mb-2">Processing...</p>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
          <div className="absolute h-full w-1/4 bg-primary animate-bounce"></div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Indeterminate progress indicators for unknown duration tasks.',
      },
    },
  },
};
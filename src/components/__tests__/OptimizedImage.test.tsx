import { OptimizedImage } from '@/components/ui/optimized-image';

import { render, screen, fireEvent, waitFor } from '@/test-utils';

// Mock Next.js Image component
jest.mock('next/image', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockedImage({ src, alt, onLoad, onError, ...props }: any) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        {...props}
        onLoad={onLoad}
        onError={onError}
        data-testid="next-image"
      />
    );
  };
});

describe('OptimizedImage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders image with correct props', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('shows loading skeleton initially', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        showSkeleton={true}
      />
    );

    const skeleton = screen.getByRole('img').parentElement?.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('hides loading skeleton when showSkeleton is false', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        showSkeleton={false}
      />
    );

    const skeleton = screen.getByRole('img').parentElement?.querySelector('.animate-pulse');
    expect(skeleton).not.toBeInTheDocument();
  });

  it('applies correct aspect ratio classes', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        aspectRatio="square"
      />
    );

    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('aspect-square');
  });

  it('applies custom container className', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        containerClassName="custom-container"
      />
    );

    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('custom-container');
  });

  it('handles image load event', async () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
      />
    );

    const image = screen.getByTestId('next-image');
    
    // Simulate image load
    fireEvent.load(image);

    await waitFor(() => {
      expect(image).toHaveClass('opacity-100');
    });
  });

  it('handles image error and shows fallback', async () => {
    const fallbackSrc = '/fallback-image.jpg';
    
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        fallbackSrc={fallbackSrc}
      />
    );

    const image = screen.getByTestId('next-image');
    
    // Simulate image error
    fireEvent.error(image);

    await waitFor(() => {
      expect(image).toHaveAttribute('src', fallbackSrc);
    });
  });

  it('shows error message on error without fallback', async () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
      />
    );

    const image = screen.getByTestId('next-image');
    
    // Simulate image error
    fireEvent.error(image);

    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });
  });
});
'use client';

/**
 * Collection of small skeleton loaders for inline use
 */

// Text skeleton with customizable width and height
interface TextSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export function TextSkeleton({ width = 'w-full', height = 'h-4', className = '' }: TextSkeletonProps) {
  return (
    <div className={`${width} ${height} bg-gray-200 rounded skeleton-shimmer ${className}`} />
  );
}

// Avatar skeleton
interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarSkeleton({ size = 'md', className = '' }: AvatarSkeletonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-300 rounded-full skeleton-shimmer ${className}`} />
  );
}

// Button skeleton
interface ButtonSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ButtonSkeleton({ size = 'md', className = '' }: ButtonSkeletonProps) {
  const sizeClasses = {
    sm: 'w-16 h-8',
    md: 'w-20 h-10',
    lg: 'w-24 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-200 rounded-xl skeleton-shimmer ${className}`} />
  );
}

// Image skeleton
interface ImageSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export function ImageSkeleton({ width = 'w-full', height = 'h-48', className = '' }: ImageSkeletonProps) {
  return (
    <div className={`${width} ${height} bg-gray-200 skeleton-shimmer ${className}`} />
  );
}

// Circle skeleton (for icons, badges, etc.)
interface CircleSkeletonProps {
  size?: string;
  className?: string;
}

export function CircleSkeleton({ size = 'w-6 h-6', className = '' }: CircleSkeletonProps) {
  return (
    <div className={`${size} bg-gray-300 rounded-full skeleton-shimmer ${className}`} />
  );
}

// Line skeleton for single lines of text
interface LineSkeletonProps {
  width?: string;
  className?: string;
}

export function LineSkeleton({ width = 'w-3/4', className = '' }: LineSkeletonProps) {
  return (
    <div className={`${width} h-4 bg-gray-200 rounded skeleton-shimmer ${className}`} />
  );
}

// Paragraph skeleton for multiple lines
interface ParagraphSkeletonProps {
  lines?: number;
  className?: string;
}

export function ParagraphSkeleton({ lines = 3, className = '' }: ParagraphSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <LineSkeleton
          key={index}
          width={index === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

// Wrapper for conditional skeleton loading
interface SkeletonWrapperProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SkeletonWrapper({ isLoading, skeleton, children, className = '' }: SkeletonWrapperProps) {
  return (
    <div className={className}>
      {isLoading ? skeleton : children}
    </div>
  );
}
"use client";

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  let mappedVariant = 'btn-primary';
  if (variant === 'outline') mappedVariant = 'btn-outline';
  if (variant === 'danger') mappedVariant = 'btn-danger';
  if (variant === 'ghost') mappedVariant = ''; // minimal style if ghost

  let mappedSize = '';
  if (size === 'sm') mappedSize = 'btn-sm';
  if (size === 'lg') mappedSize = 'btn-lg';

  const classes = `btn ${mappedVariant} ${mappedSize} ${className}`.trim();

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

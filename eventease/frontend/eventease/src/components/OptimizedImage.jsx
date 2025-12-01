import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

/**
 * OptimizedImage Component
 * Provides lazy loading, progressive loading, and image optimization
 */
const OptimizedImage = ({
    src,
    alt = 'Event',
    width = '100%',
    height = '200px',
    objectFit = 'cover',
    borderRadius = '0px',
    showLoader = true,
    onLoad,
    sx = {}
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);
    const [error, setError] = useState(false);

    // Optimize image URL for better performance
    const getOptimizedImageUrl = (url) => {
        if (!url) return null;
        
        // Handle Unsplash images - optimize with query params
        if (url.includes('unsplash.com')) {
            // Add optimization params to Unsplash URL
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}auto=format&fit=crop&q=50&w=600`;
        }
        
        // For other external images, add basic optimization via CDN-like params
        if (url.startsWith('http')) {
            return url;
        }
        
        return url;
    };

    const optimizedSrc = getOptimizedImageUrl(imageSrc);
    const fallbackImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=50&w=600';

    useEffect(() => {
        setImageLoaded(false);
        setError(false);
        
        // Preload image to detect errors
        const img = new Image();
        
        img.onload = () => {
            setImageLoaded(true);
            onLoad?.();
        };
        
        img.onerror = () => {
            console.warn(`Failed to load image: ${optimizedSrc}`);
            setError(true);
            // Try fallback
            if (optimizedSrc !== fallbackImage) {
                setImageSrc(fallbackImage);
            }
        };
        
        if (optimizedSrc) {
            img.src = optimizedSrc;
        }
    }, [optimizedSrc, onLoad]);

    const finalImageUrl = error ? fallbackImage : optimizedSrc;

    return (
        <Box
            sx={{
                position: 'relative',
                width,
                height,
                overflow: 'hidden',
                borderRadius,
                backgroundColor: '#f0f0f0',
                ...sx
            }}
        >
            {/* Skeleton Loader */}
            {showLoader && !imageLoaded && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                    }}
                />
            )}

            {/* Actual Image */}
            <img
                src={finalImageUrl}
                alt={alt}
                loading="lazy"
                decoding="async"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit,
                    display: imageLoaded ? 'block' : 'none',
                    transition: 'opacity 0.3s ease-in-out'
                }}
                onLoad={() => {
                    setImageLoaded(true);
                    onLoad?.();
                }}
                onError={() => {
                    setError(true);
                    if (finalImageUrl !== fallbackImage) {
                        setImageSrc(fallbackImage);
                    }
                }}
            />
        </Box>
    );
};

export default OptimizedImage;

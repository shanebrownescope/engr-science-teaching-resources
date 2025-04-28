'use client';

import { Button, Text, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CreateReviewButtonProps = {
    type: string;
    resourceName: string;
    disabled: boolean | undefined;
    variant?: 'filled' | 'outline';
};

export function CreateReviewButton({
    type,
    resourceName, 
    disabled, 
    variant = 'filled' 
}: CreateReviewButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = () => {
        setIsLoading(true)
        router.push(`/resources/${type}/${resourceName}/review`);
    };

    if (disabled) {
        return (
            <Tooltip label="You've already submitted a review for this resource">
                <div>
                    <Button 
                        variant={variant} 
                        disabled 
                        aria-disabled="true"
                    >
                        Write a Review
                    </Button>
                </div>
            </Tooltip>
        );
    }
    
    return (
        <Button 
            variant={variant}
            onClick={handleClick}
            loading={isLoading}
            loaderProps={{ type: 'dots' }}
        >
            Write a Review
        </Button>
    );
}
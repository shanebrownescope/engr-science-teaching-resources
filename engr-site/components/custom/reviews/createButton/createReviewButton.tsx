'use client';

import { Button, Text, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';

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

    const handleClick = () => {
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
        >
            Write a Review
        </Button>
    );
}
'use client';

import { Button, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './CreateReviewButton.module.css'; // Create this CSS file

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
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);
        router.push(`/resources/${type}/${resourceName}/review`);
    };

    return (
        <div className={styles.floatingButton}>
            {disabled ? (
                <Tooltip label="You've already submitted a review for this resource">
                    <Button 
                        className={styles.reviewButton}
                        variant={variant}
                        disabled
                        aria-disabled="true"
                    >
                        Write a Review
                    </Button>
                </Tooltip>
            ) : (
                <Button
                    className={styles.reviewButton}
                    variant={variant}
                    onClick={handleClick}
                    loading={isLoading}
                    loaderProps={{ type: 'dots' }}
                >
                    Write a Review
                </Button>
            )}
        </div>
    );
}
"use client";

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Title, Container } from '@mantine/core';
import { Notification } from '@mantine/core';
import { ReviewForm } from '@/components/mantine/ReviewForm';
import requireAuth from '@/actions/auth/requireAuth';
import { getCurrentUser } from '@/utils/authHelpers';
import { fetchReviewsByLinkNameAndUserId } from '@/actions/fetching/reviews/fetchReviewsByLinkNameAndUserId';
import { FetchedReviewsLinkData } from '@/utils/types_v2';
import { updateLinkAvgRating } from '@/actions/update/links/updateLinkAvgRating';
import { uploadLinkReview } from '@/actions/reviews/uploadLinkReview';

export default async function CreateReviewPage({ params }: { params: { linkName: string } }) {
    const [isLoading, setIsLoading] = useState(true);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        title: '',
        comments: '',
        userPublicName: ''
    });
    const { linkName } = params;
    const user = await getCurrentUser();

    // authorize user when page mounts (must have an active session and no reviews already created for this resource)
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                await requireAuth();

                if (!user || !user.id) {
                    return;
                }

                const existingReviews: FetchedReviewsLinkData | null = await fetchReviewsByLinkNameAndUserId(
                    linkName, 
                    user.id
                );
                
                if (existingReviews && existingReviews.success?.length) {
                    redirect("/unauthorized")
                }
            } catch (error) {
                console.log("Failed to authorize user: ", error)
                return
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthorization();
    }, []);

    // handle on change event for review form values
    const handleChange = (field: string, value: string | number) => {
        setReviewData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // handle on submit event (update link average rating and upload new link review)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const resultForUpdate = await updateLinkAvgRating({ 
                linkName: linkName, 
                newRating: reviewData.rating 
            });

            if (resultForUpdate.failure) {
                console.log("Failed to update link average rating: ", resultForUpdate.failure)
                return
            }

            const resultForUpload = await uploadLinkReview({ 
                values: {...reviewData}, 
                userId: user?.id, 
                linkName: linkName 
            })

            if (resultForUpload.failure) {
                console.log("Failed to upload link review: ", resultForUpload.failure)
                return
            }

            redirect(`/resources/link/${linkName}`);

        } catch (error) {
            console.log("Error occured when submitting link review: ", error)
            return
        } finally {
            setIsLoading(false);
        }
    };

    // handle on cancel event
    const handleCancel = () => {
        redirect(`/resources/link/${linkName}`);
    };

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="xl">Write a Review</Title>
            <ReviewForm
                reviewData={reviewData}
                isLoading={isLoading}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </Container>
    );
}
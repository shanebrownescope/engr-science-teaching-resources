"use client";

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Title, Container } from '@mantine/core';
import { Notification } from '@mantine/core';
import { ReviewForm } from '@/components/mantine/ReviewForm';
import requireAuth from '@/actions/auth/requireAuth';
import { getCurrentUser } from '@/utils/authHelpers';
import { fetchReviewsByFileNameAndUserId } from '@/actions/fetching/reviews/fetchReviewsByFileNameAndUserId';
import { FetchedReviewsFileData } from '@/utils/types_v2';
import { updateFileAvgRating } from '@/actions/update/files/updateFileAvgRating';
import { uploadFileReview } from '@/actions/reviews/uploadFileReview';

export default async function CreateReviewPage({ params }: { params: { fileName: string } }) {
    const [isLoading, setIsLoading] = useState(true);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        title: '',
        comments: '',
        userPublicName: ''
    });
    const { fileName } = params;
    const user = await getCurrentUser();

    // authorize user when page mounts (must have an active session and no reviews already created for this resource)
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                await requireAuth();

                if (!user || !user.id) {
                    return;
                }

                const existingReviews: FetchedReviewsFileData | null = await fetchReviewsByFileNameAndUserId(
                    fileName, 
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

    // handle on submit event (update file average rating and upload new file review)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const resultForUpdate = await updateFileAvgRating({ 
                fileName: fileName, 
                newRating: reviewData.rating 
            });

            if (resultForUpdate.failure) {
                console.log("Failed to update file average rating: ", resultForUpdate.failure)
                return
            }

            const resultForUpload = await uploadFileReview({ 
                values: {...reviewData}, 
                userId: user?.id, 
                fileName: fileName 
            })

            if (resultForUpload.failure) {
                console.log("Failed to upload file review: ", resultForUpload.failure)
                return
            }

            redirect(`/resources/file/${fileName}`);

        } catch (error) {
            console.log("Error occured when submitting file review: ", error)
            return
        } finally {
            setIsLoading(false);
        }
    };

    // handle on cancel event
    const handleCancel = () => {
        redirect(`/resources/file/${fileName}`);
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
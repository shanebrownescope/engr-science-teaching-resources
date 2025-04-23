import styles from "./review.module.css";
import { ReviewBox } from "@/components/mantine/ReviewBox";

type ReviewProps = {
    rating: number;
    title: string;
    comments: string;
    userPublicName: string;
    uploadDate: string;
};
  
/**
 * Renders a review.
 *
 * @param {ReviewProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered Review component.
 */

const Review = ({
    rating,
    title,
    comments,
    userPublicName,
    uploadDate
}: ReviewProps) => {
    return (
        <ReviewBox 
            rating={rating}
            title={title}
            comments={comments}
            userPublicName={userPublicName}
            uploadDate={uploadDate}
        />
    )
}

export default Review
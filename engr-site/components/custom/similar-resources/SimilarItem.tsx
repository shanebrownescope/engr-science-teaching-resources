import { AllFilesAndLinksDataFormatted } from "@/utils/types_v2";
import { Badge, Group, Rating, Stack, Text, Tooltip } from "@mantine/core";
import Link from "next/link";
import { IconCalendar, IconUser, IconFile, IconLink, IconFileDescription, IconTag, IconBook2 } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import styles from "./similarResource.module.css";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";

type SimilarItemProps = {
  item: AllFilesAndLinksDataFormatted;
};

/**
 * Renders a similar item card.
 *
 * @param {SimilarItemProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered SimilarItem component.
 */
const SimilarItem = ({ item }: SimilarItemProps) => {
  const relativeTime = formatDistanceToNow(new Date(item.uploadDate), {
    addSuffix: true,
    includeSeconds: true
  }).replace("about ", "");

  return (
    <div className={styles.container}>
      <Link href={`/resources/${item.type}/${item.urlName}`} className={styles.link}>
        <Group justify="space-between" mb={4} wrap="nowrap">
          <Badge 
            color={item.type === 'file' ? 'blue' : 'teal'} 
            variant="light" 
            size="sm"
            leftSection={item.type === 'file' ? 
              <IconFile size={12} style={{ marginRight: 4 }} /> : 
              <IconLink size={12} style={{ marginRight: 4 }} />}
          >
            {item.type}
          </Badge>

          <Tooltip label={`Uploaded ${relativeTime}`}>
            <Group gap={4}>
              <IconCalendar size={14} />
              <Text size="xs">{relativeTime}</Text>
            </Group>
          </Tooltip>
        </Group>

        <Group gap="xs" mb={4} wrap="nowrap">
          <Tooltip label={`Resource Type`}>
            <Group gap={4}>
              <IconFileDescription size={14} />
              <Text size="xs" lineClamp={1}>{trimCapitalizeFirstLetter(item.resourceType)}</Text>
            </Group>
          </Tooltip>
        </Group>

        <Group gap="xs" mb={4} wrap="nowrap">
          <Tooltip label={`Contributor`}>
            <Group gap={4}>
              <IconUser size={14} />
              <Text size="xs" lineClamp={1}>{item.contributor || "Anonymous"}</Text>
            </Group>
          </Tooltip>
        </Group>

        {item.avgRating ? (
          <Tooltip label={`${item.avgRating} rating (${item.numReviews} ${item.numReviews === 1 ? 'review' : 'reviews'})`}>
            <Group gap={4}>
              <Rating value={item.avgRating} fractions={4} readOnly size="xs" />
              <Text size="xs">{item.avgRating}</Text>
            </Group>
          </Tooltip>
        ) : (
          <Text size="xs" c="dimmed">No reviews yet</Text>
        )}

        {(item.tags?.length > 0 || item.courses?.length > 0) && (
          <Stack gap={4} mt={5}>
            <Group gap={4}>
              <IconTag size={16} />
              {item.tags?.map((tag, index) => (
                <Tooltip key={index} label={`Tag: ${tag}`}>
                  <Badge variant="light" size="xs">
                    {tag}
                  </Badge>
                </Tooltip>
              ))}
            </Group>
            <Group gap={4}>
              <IconBook2 size={16} />
              {item.courses?.slice(0, 3).map((course, index) => (
                <Tooltip key={index} label={`Course: ${course}`}>
                  <Badge variant="outline" size="xs">
                    {course}
                  </Badge>
                </Tooltip>
              ))}
            </Group>
          </Stack>
        )}
      </Link>
    </div>
  );
};

export default SimilarItem;

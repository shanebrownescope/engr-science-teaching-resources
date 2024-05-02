import { Textarea, Button } from '@mantine/core';

import { fetchFileById } from '@/actions/fetching/files/fetchFileById';
import { fetchSimilarFilesByTags } from '@/actions/fetching/files/fetchSimilarFilesByTags';

import { DisplayFile } from '@/app/(protected)/_components/DisplayFile';
import SimilarDoc from '@/components/custom/SimilarDoc';
import {
  FetchedFile,
  FetchedFilesDataArray,
  FetchedLinksDataArray,
} from '@/utils/types';
import './page.css';

type searchParams = {
  id: string;
  searchParams: { [key: string]: string | string[] | undefined };
};

const ResourceFilePage = async ({
  params,
  searchParams,
}: {
  params: { fileId: string };
  searchParams: searchParams;
}) => {
  const { fileId } = params;
  const { id } = searchParams;

  const result = await fetchFileById({ id: id });
  let similarItems: FetchedFilesDataArray | null = null;

  //* fetching similar files or links
  if (result && result.success && result.success.tags) {
    console.log(result.success.tags);

    if (result.success?.tags?.length > 0) {
      similarItems = await fetchSimilarFilesByTags({
        fileId: fileId,
        tags: result.success.tags,
      });

      console.log(similarItems);
    }

    console.log(result.success);
  }

  return (
    <div>
      <div className='content'>
        {result?.success && (
          <DisplayFile file={result.success as FetchedFile} />
        )}
      </div>

      <div style={{ paddingTop: '50px', paddingLeft: '30px' }}>
        <h3>Similar resources</h3>
        <div className='similarResourcesContainer'>
          {similarItems?.success?.map((item, idx) => (
            <div key={idx}>
              <SimilarDoc file={item as FetchedFile} />
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ paddingTop: '50px', paddingLeft: '30px' }}>Comments</h3>
      <div style={{ maxWidth: '600px', paddingLeft: '30px' }}>
        <Textarea autosize minRows={2} mb='md' />
        <Button variant='filled' style={{ width: '100%' }}>
          Post
        </Button>{' '}
      </div>
    </div>
  );
};

export default ResourceFilePage;

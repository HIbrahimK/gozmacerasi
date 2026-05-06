import BookReaderClient from './book-reader-client';

export default function BookReaderPage({
  params,
}: {
  params: { id: string };
}) {
  return <BookReaderClient bookId={params.id} />;
}

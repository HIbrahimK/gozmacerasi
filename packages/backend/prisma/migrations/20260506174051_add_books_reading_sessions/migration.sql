-- CreateTable
CREATE TABLE "online_books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "coverColor" TEXT NOT NULL DEFAULT '#6366f1',
    "minAge" INTEGER NOT NULL DEFAULT 3,
    "maxAge" INTEGER NOT NULL DEFAULT 14,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "online_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_book_pages" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "textContent" TEXT NOT NULL,
    "illustration" TEXT,
    "depthLayer" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "online_book_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_sessions" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "pagesRead" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "reading_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "online_book_pages_bookId_pageNumber_key" ON "online_book_pages"("bookId", "pageNumber");

-- AddForeignKey
ALTER TABLE "online_book_pages" ADD CONSTRAINT "online_book_pages_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "online_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "online_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

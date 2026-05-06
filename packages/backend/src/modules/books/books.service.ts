import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface BookSummary {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string | null;
  coverColor: string;
  minAge: number;
  maxAge: number;
  pageCount: number;
  createdAt: string;
}

export interface BookPage {
  id: string;
  pageNumber: number;
  textContent: string;
  illustration: string | null;
  depthLayer: number;
}

export interface BookDetail extends BookSummary {
  pages: BookPage[];
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<BookSummary[]> {
    const books = await this.prisma.onlineBook.findMany({
      where: { isPublished: true },
      include: { _count: { select: { pages: true } } },
      orderBy: { title: 'asc' },
    });

    return books.map(
      (b: {
        id: string;
        title: string;
        author: string;
        category: string;
        description: string | null;
        coverColor: string;
        minAge: number;
        maxAge: number;
        _count: { pages: number };
        createdAt: Date;
      }) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        description: b.description,
        coverColor: b.coverColor,
        minAge: b.minAge,
        maxAge: b.maxAge,
        pageCount: b._count.pages,
        createdAt: b.createdAt.toISOString(),
      }),
    );
  }

  async getById(id: string): Promise<BookDetail | null> {
    const book = await this.prisma.onlineBook.findUnique({
      where: { id },
      include: { pages: { orderBy: { pageNumber: 'asc' } } },
    });

    if (!book) return null;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      coverColor: book.coverColor,
      minAge: book.minAge,
      maxAge: book.maxAge,
      pageCount: book.pages.length,
      createdAt: book.createdAt.toISOString(),
      pages: book.pages.map(
        (p: {
          id: string;
          pageNumber: number;
          textContent: string;
          illustration: string | null;
          depthLayer: number;
        }) => ({
          id: p.id,
          pageNumber: p.pageNumber,
          textContent: p.textContent,
          illustration: p.illustration,
          depthLayer: p.depthLayer,
        }),
      ),
    };
  }

  async startReading(childId: string, bookId: string) {
    return this.prisma.readingSession.create({
      data: { childId, bookId },
    });
  }

  async updateReading(sessionId: string, pagesRead: number) {
    return this.prisma.readingSession.update({
      where: { id: sessionId },
      data: {
        pagesRead,
        duration: { increment: 1 },
      },
    });
  }

  async finishReading(sessionId: string) {
    return this.prisma.readingSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });
  }

  async getReadingHistory(childId: string) {
    const sessions = await this.prisma.readingSession.findMany({
      where: { childId },
      include: { book: true },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    return sessions.map(
      (s: {
        id: string;
        book: { title: string; author: string };
        pagesRead: number;
        duration: number;
        startedAt: Date;
        endedAt: Date | null;
      }) => ({
        sessionId: s.id,
        bookTitle: s.book.title,
        bookAuthor: s.book.author,
        pagesRead: s.pagesRead,
        duration: s.duration,
        startedAt: s.startedAt.toISOString(),
        endedAt: s.endedAt?.toISOString() ?? null,
      }),
    );
  }
}

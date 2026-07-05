CREATE EXTENSION IF NOT EXISTS vector;
-- After `prisma migrate dev`, optionally speed up similarity search:
-- CREATE INDEX ON "TranscriptChunk" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

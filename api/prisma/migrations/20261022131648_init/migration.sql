-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('draft', 'ready', 'scheduled', 'published', 'pending-approval');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('post', 'reel', 'story', 'carousel', 'video', 'article');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('instagram', 'facebook', 'linkedin', 'x', 'tiktok', 'youtube', 'threads', 'pinterest', 'bluesky', 'reddit');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandSpace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "userId" TEXT NOT NULL,
    "brandSpaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandDna" (
    "id" TEXT NOT NULL,
    "brandSpaceId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "voice" TEXT,
    "audience" TEXT,
    "goals" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandDna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "brandSpaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "brandSpaceId" TEXT NOT NULL,
    "campaignId" TEXT,
    "contentType" "ContentType" NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "body" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL,
    "brandSpaceId" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "displayName" TEXT,
    "tokenCiphertext" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "brandSpaceId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BrandSpace_slug_key" ON "BrandSpace"("slug");

-- CreateIndex
CREATE INDEX "Membership_brandSpaceId_idx" ON "Membership"("brandSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_brandSpaceId_key" ON "Membership"("userId", "brandSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandDna_brandSpaceId_key" ON "BrandDna"("brandSpaceId");

-- CreateIndex
CREATE INDEX "Campaign_brandSpaceId_idx" ON "Campaign"("brandSpaceId");

-- CreateIndex
CREATE INDEX "Post_brandSpaceId_status_idx" ON "Post"("brandSpaceId", "status");

-- CreateIndex
CREATE INDEX "Post_brandSpaceId_scheduledAt_idx" ON "Post"("brandSpaceId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Post_campaignId_idx" ON "Post"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_brandSpaceId_platform_externalAccountId_key" ON "SocialAccount"("brandSpaceId", "platform", "externalAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_brandSpaceId_storageKey_key" ON "MediaAsset"("brandSpaceId", "storageKey");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_brandSpaceId_fkey" FOREIGN KEY ("brandSpaceId") REFERENCES "BrandSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandDna" ADD CONSTRAINT "BrandDna_brandSpaceId_fkey" FOREIGN KEY ("brandSpaceId") REFERENCES "BrandSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_brandSpaceId_fkey" FOREIGN KEY ("brandSpaceId") REFERENCES "BrandSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_brandSpaceId_fkey" FOREIGN KEY ("brandSpaceId") REFERENCES "BrandSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_brandSpaceId_fkey" FOREIGN KEY ("brandSpaceId") REFERENCES "BrandSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_brandSpaceId_fkey" FOREIGN KEY ("brandSpaceId") REFERENCES "BrandSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

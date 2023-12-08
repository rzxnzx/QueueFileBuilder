-- CreateTable
CREATE TABLE `queue_jobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa` VARCHAR(255) NOT NULL,
    `payload` TEXT NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `tipo` VARCHAR(50) NULL,
    `raw_query` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

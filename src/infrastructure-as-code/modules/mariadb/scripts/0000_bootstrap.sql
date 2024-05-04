CREATE TABLE IF NOT EXISTS `user_orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('import', 'export') NOT NULL,
  `status` ENUM('waiting', 'preparing', 'ready', 'delivered') NOT NULL DEFAULT 'waiting',
  `data` JSON,
  `created_at` DATE DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATE,
  `deleted_at` DATE,
  PRIMARY KEY (`id`)
);

-- -- Criar tabela de usuários chamada users
-- CREATE TABLE IF NOT EXISTS `users` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `username` VARCHAR(32) NOT NULL UNIQUE,
--   `created_at` DATE DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` DATE,
--   `deleted_at` DATE,
--   PRIMARY KEY (`id`)
-- );
-- Criar tabela de solicitações chamada requests
-- CREATE TABLE IF NOT EXISTS `requests` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   -- `user_id` INT NOT NULL,
--   `type` ENUM('import', 'export') NOT NULL,
--   `status` ENUM('waiting', 'preparing', 'ready', 'delivered') NOT NULL DEFAULT 'waiting',
--   `data` JSON,
--   `created_at` DATE DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` DATE,
--   `deleted_at` DATE,
--   PRIMARY KEY (`id`) -- FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
-- );
--
-- Adicionar índice para busca de requisições por user_id
-- CREATE INDEX idx_user_id ON `requests` (`user_id`);
-- Adicionar índice para busca de requisições por type
-- CREATE INDEX idx_type ON `requests` (`type`);
CREATE INDEX idx_user_orders_type ON `user_orders` (`type`);
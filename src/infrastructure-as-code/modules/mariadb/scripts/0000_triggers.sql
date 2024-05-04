/* https://www.mariadbtutorial.com/mariadb-triggers/mariadb-create-trigger */
-- Gatilho para atualização automática do campo updated_at na tabela user_orders
CREATE TRIGGER before_user_orders_update BEFORE
UPDATE
  ON `user_orders` FOR EACH ROW BEGIN
SET
  NEW.updated_at = CURRENT_TIMESTAMP;

END;

-- Criar gatilho para atualização automática do campo updated_at na tabela users
-- CREATE TRIGGER before_users_update BEFORE
-- UPDATE
--   ON `users` FOR EACH ROW BEGIN
-- SET
--   NEW.updated_at = CURRENT_TIMESTAMP;
-- END;
--
-- Criar gatilho para atualização automática do campo updated_at na tabela requests
-- CREATE TRIGGER before_requests_update BEFORE
-- UPDATE
--   ON `requests` FOR EACH ROW BEGIN
-- SET
--   NEW.updated_at = CURRENT_TIMESTAMP;
-- END;
--
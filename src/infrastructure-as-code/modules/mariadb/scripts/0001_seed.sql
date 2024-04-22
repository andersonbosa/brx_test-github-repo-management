-- INSERT INTO
--   `users` (`username`)
-- VALUES
--   ('admin'),
--   ('guest');
-- INSERT INTO
--   `requests` (`user_id`, `type`, `data`)
-- VALUES
--   (1, 'export', '{"key": "value"}'),
--   (1, 'export', '{"key": "value"}'),
--   (1, 'export', '{"key": "value"}'),
--   (2, 'import', '{"key": "value"}'),
--   (2, 'import', '{"key": "value"}'),
--   (2, 'import', '{"key": "value"}');
--
-- INSERT INTO
--   `requests` (`status`, `type`, `data`)
-- VALUES
--   ('waiting', 'export', '{"key": "value"}'),
--   ('delivered', 'export', '{"key": "value"}'),
--   ('waiting', 'export', '{"key": "value"}'),
--   ('preparing', 'import', '{"key": "value"}'),
--   ('ready', 'import', '{"key": "value"}'),
--   ('delivered', 'import', '{"key": "value"}');

INSERT INTO
  `user_orders` (`status`, `type`, `data`)
VALUES
  ('waiting', 'export', '{"key": "value"}'),
  ('delivered', 'export', '{"key": "value"}'),
  ('waiting', 'export', '{"key": "value"}'),
  ('preparing', 'import', '{"key": "value"}'),
  ('ready', 'import', '{"key": "value"}'),
  ('delivered', 'import', '{"key": "value"}');
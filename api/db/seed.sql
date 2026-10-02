INSERT INTO products (id, name, description, price, category, image_url, available)
VALUES
  (1, 'Kopi Susu Kita', 'Espresso lembut dengan susu segar dan gula aren khas Kopi Kita.', 28000, 'kopi', '/menu/coffee.svg', TRUE),
  (2, 'Americano', 'Espresso bersih dan bold untuk menemani hari yang penuh fokus.', 24000, 'kopi', '/menu/coffee.svg', TRUE),
  (3, 'Es Kopi Gula Aren', 'Kopi susu dingin dengan manis gula aren yang hangat dan familiar.', 30000, 'kopi', '/menu/coffee.svg', TRUE),
  (4, 'Matcha Latte', 'Matcha creamy yang earthy, ringan, dan dibuat untuk slow afternoons.', 35000, 'non-kopi', '/menu/non-coffee.svg', TRUE),
  (5, 'Coklat Panas', 'Coklat hangat yang rich dan comforting dengan rasa yang tidak terlalu manis.', 30000, 'non-kopi', '/menu/non-coffee.svg', TRUE),
  (6, 'Croissant', 'Croissant butter yang flaky dan fresh dari oven untuk teman ngopi.', 26000, 'pastry', '/menu/pastry.svg', TRUE),
  (7, 'Roti Bakar Keju', 'Roti panggang renyah dengan keju lumer yang gurih dan nostalgic.', 25000, 'pastry', '/menu/pastry.svg', TRUE),
  (8, 'Banana Bread', 'Banana bread moist dengan aroma rempah lembut untuk sore yang santai.', 28000, 'pastry', '/menu/pastry.svg', FALSE),
  (9, 'Espresso Tonic', 'Espresso berkilau dengan tonic citrus yang segar dan ringan.', 32000, 'kopi', '/menu/coffee.svg', TRUE),
  (10, 'Pain au Chocolat', 'Pastry butter berlapis dengan isian cokelat pekat.', 30000, 'pastry', '/menu/pastry.svg', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  available = EXCLUDED.available;

SELECT setval('products_id_seq', GREATEST((SELECT MAX(id) FROM products), 1), TRUE);

INSERT INTO admins (email, password_hash)
VALUES ('admin@kopikita.id', crypt('kopikita-admin', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

USE amigos_snacks;

-- Clear existing data
DELETE FROM product_weights;
DELETE FROM products;
DELETE FROM users;

-- Seed Users
-- admin@amigossnacks.com / admin123
INSERT INTO users (id, full_name, email, mobile_number, password, role) VALUES 
(1, 'Amigos Admin', 'admin@amigossnacks.com', '8341462856', '$2a$10$8.KclXgE.R.xM77c0c16OOdGZ4sJgM.j6H/rFwMebvHlH7G3vJjJy', 'ADMIN');

-- customer@amigossnacks.com / customer123
INSERT INTO users (id, full_name, email, mobile_number, password, role) VALUES
(2, 'Sai Kumar', 'customer@amigossnacks.com', '9876543210', '$2a$10$U5L/T3.d1gP44aN4hO3Nse60sX3YF6J1.M7Gf1388gO3kM7.0b2W.', 'USER');

-- akashnambula@gamil.com / akash123
INSERT INTO users (id, full_name, email, mobile_number, password, role) VALUES
(3, 'Akash Nambula', 'akashnambula@gamil.com', '8341462856', '$2b$12$CRmXHSnm5/AJwG.t7dKxvOkWvORWiAo5Qttlqjqt086KPfnfkyTbK', 'ADMIN');

-- Seed Products
-- 1. Murukulu
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(1, 'Murukulu', 'Crispy and crunchy traditional South Indian snack made with rice flour, urad dal flour, and flavored with ajwain (carom seeds) and sesame seeds. Perfectly deep-fried for a delicious homemade taste.', 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop', 'Savory');

-- 2. Chekkalu
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(2, 'Chekkalu', 'Traditional Andhra Rice Crackers made with rice flour, chana dal, ginger-green chili paste, and fresh curry leaves. These golden, flat disks offer a delightful crunch with every bite.', 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=600&auto=format&fit=crop', 'Savory');

-- 3. Karam Boondi
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(3, 'Karam Boondi', 'Spicy and savory snack made from tiny fried gram flour balls (boondi) mixed with roasted peanuts, cashews, garlic, curry leaves, and a perfect blend of red chili powder and salt.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop', 'Savory');

-- 4. Mixture
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(4, 'Mixture', 'A classic Indian snack containing a rich medley of sev, karam boondi, roasted peanuts, cashews, fried curry leaves, and traditional spices. The ultimate accompaniment for your evening tea.', 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop', 'Savory');

-- 5. Janthikalu
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(5, 'Janthikalu', 'A popular Andhra snack made from gram flour (besan) and rice flour, pressed into intricate patterns and deep-fried. Infused with carom seeds (vaamu) for a unique aroma and digestive benefit.', 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop', 'Savory');

-- 6. Jeedi Pappu (Cashew snack - premium)
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(6, 'Jeedi Pappu Pakodi', 'A premium, rich snack prepared with whole cashew nuts (jeedi pappu) coated in a spiced gram flour batter and deep-fried to perfection. Extremely crunchy and loaded with cashew flavor.', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop', 'Premium');


-- Seed Product Weights and Prices
-- Murukulu (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (1, '250 Grams', 120.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (1, '500 Grams', 230.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (1, '1000 Grams', 450.00);

-- Chekkalu (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (2, '250 Grams', 130.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (2, '500 Grams', 250.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (2, '1000 Grams', 480.00);

-- Karam Boondi (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (3, '250 Grams', 110.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (3, '500 Grams', 210.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (3, '1000 Grams', 400.00);

-- Mixture (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (4, '250 Grams', 120.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (4, '500 Grams', 230.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (4, '1000 Grams', 450.00);

-- Janthikalu (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (5, '250 Grams', 120.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (5, '500 Grams', 230.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (5, '1000 Grams', 450.00);

-- Jeedi Pappu Pakodi (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (6, '250 Grams', 280.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (6, '500 Grams', 540.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (6, '1000 Grams', 1050.00);

-- Seed Pickles
-- 7. Tomato Pickle
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(7, 'Tomato Pickle', 'Authentic Andhra Tomato Pickle. Ripe red tomatoes slow-cooked and pickled with traditional mustard powder, fenugreek powder, and cold-pressed oil.', '/assets/images/tomato_pickle.png', 'Veg Pickle');

-- 8. Mango Pickle
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(8, 'Mango Pickle (Avakaya)', 'Traditional Telugu Avakaya mango pickle. Spicy mango chunks coated in a rich, flavorful red chili, mustard, and fenugreek masala.', '/assets/images/mango_pickle.png', 'Veg Pickle');

-- 9. Gongura Pickle
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(9, 'Gongura Pickle', 'Authentic sorrel leaves pickle (Gongura Pachadi). Tangy green sorrel leaves fried and seasoned with red chilies, garlic cloves, and hot oil.', '/assets/images/gongura_pickle.png', 'Veg Pickle');

-- 10. Chicken Pickle
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(10, 'Chicken Pickle', 'Ultra-flavorful Andhra Chicken Pickle. Succulent chicken pieces fried to perfection and preserved in ginger-garlic paste and spices.', '/assets/images/chicken_pickle.png', 'Non-Veg Pickle');

-- 11. Mutton Pickle
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(11, 'Mutton Pickle', 'Premium Andhra Mutton Pickle. Tender mutton chunks seasoned and slow-cooked in traditional pickle spices and rich sesame oil.', '/assets/images/mutton_pickle.png', 'Non-Veg Pickle');

-- 12. Prawns Pickle
INSERT INTO products (id, product_name, description, image_url, category) VALUES
(12, 'Prawns Pickle', 'Authentic coastal prawns pickle. Juicy prawns marinated in traditional spices, fried crisp, and pickled in a fiery Andhra gravy.', '/assets/images/prawns_pickle.png', 'Non-Veg Pickle');


-- Product weights for Pickles
-- Tomato Pickle (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (7, '250 Grams', 150.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (7, '500 Grams', 280.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (7, '1000 Grams', 540.00);

-- Mango Pickle (Avakaya) (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (8, '250 Grams', 160.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (8, '500 Grams', 300.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (8, '1000 Grams', 580.00);

-- Gongura Pickle (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (9, '250 Grams', 140.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (9, '500 Grams', 260.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (9, '1000 Grams', 500.00);

-- Chicken Pickle (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (10, '250 Grams', 350.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (10, '500 Grams', 680.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (10, '1000 Grams', 1300.00);

-- Mutton Pickle (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (11, '250 Grams', 450.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (11, '500 Grams', 850.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (11, '1000 Grams', 1650.00);

-- Prawns Pickle (250g, 500g, 1000g)
INSERT INTO product_weights (product_id, weight, price) VALUES (12, '250 Grams', 400.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (12, '500 Grams', 780.00);
INSERT INTO product_weights (product_id, weight, price) VALUES (12, '1000 Grams', 1500.00);

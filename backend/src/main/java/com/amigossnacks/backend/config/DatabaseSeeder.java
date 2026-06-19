package com.amigossnacks.backend.config;

import com.amigossnacks.backend.entity.User;
import com.amigossnacks.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.amigossnacks.backend.repository.ProductRepository productRepository;

    @Autowired
    private com.amigossnacks.backend.repository.ProductWeightRepository productWeightRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(String... args) throws Exception {
        // Seed default Admin if not exists
        if (!userRepository.existsByEmail("admin@amigossnacks.com")) {
            User admin = User.builder()
                    .fullName("Amigos Admin")
                    .email("admin@amigossnacks.com")
                    .mobileNumber("8341462856")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("Seeded Default Admin: admin@amigossnacks.com / admin123");
        }

        // Seed requested Admin if not exists
        if (!userRepository.existsByEmail("akashnambula@gamil.com")) {
            User admin = User.builder()
                    .fullName("Akash Nambula")
                    .email("akashnambula@gamil.com")
                    .mobileNumber("8341462856")
                    .password(passwordEncoder.encode("akash123"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("Seeded Admin: akashnambula@gamil.com / akash123");
        }

        // Seed default User if not exists
        if (!userRepository.existsByEmail("customer@amigossnacks.com")) {
            User customer = User.builder()
                    .fullName("Sai Kumar")
                    .email("customer@amigossnacks.com")
                    .mobileNumber("9876543210")
                    .password(passwordEncoder.encode("customer123"))
                    .role("USER")
                    .build();
            userRepository.save(customer);
            System.out.println("Seeded Default Customer: customer@amigossnacks.com / customer123");
        }

        // Seed default Products if not exists
        if (productRepository.count() == 0) {
            seedProduct("Murukulu", 
                "Crispy and crunchy traditional South Indian snack made with rice flour, urad dal flour, and flavored with ajwain (carom seeds) and sesame seeds. Perfectly deep-fried for a delicious homemade taste.",
                "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop", 
                "Savory",
                120.00, 230.00, 450.00);

            seedProduct("Chekkalu", 
                "Traditional Andhra Rice Crackers made with rice flour, chana dal, ginger-green chili paste, and fresh curry leaves. These golden, flat disks offer a delightful crunch with every bite.",
                "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=600&auto=format&fit=crop", 
                "Savory",
                130.00, 250.00, 480.00);

            seedProduct("Karam Boondi", 
                "Spicy and savory snack made from tiny fried gram flour balls (boondi) mixed with roasted peanuts, cashews, garlic, curry leaves, and a perfect blend of red chili powder and salt.",
                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop", 
                "Savory",
                110.00, 210.00, 400.00);

            seedProduct("Mixture", 
                "A classic Indian snack containing a rich medley of sev, karam boondi, roasted peanuts, cashews, fried curry leaves, and traditional spices. The ultimate accompaniment for your evening tea.",
                "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop", 
                "Savory",
                120.00, 230.00, 450.00);

            seedProduct("Janthikalu", 
                "A popular Andhra snack made from gram flour (besan) and rice flour, pressed into intricate patterns and deep-fried. Infused with carom seeds (vaamu) for a unique aroma and digestive benefit.",
                "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop", 
                "Savory",
                120.00, 230.00, 450.00);

            seedProduct("Jeedi Pappu Pakodi", 
                "A premium, rich snack prepared with whole cashew nuts (jeedi pappu) coated in a spiced gram flour batter and deep-fried to perfection. Extremely crunchy and loaded with cashew flavor.",
                "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop", 
                "Premium",
                280.00, 540.00, 1050.00);

            seedProduct("Tomato Pickle", 
                "Authentic Andhra Tomato Pickle. Ripe red tomatoes slow-cooked and pickled with traditional mustard powder, fenugreek powder, and cold-pressed oil.",
                "/assets/images/tomato_pickle.png", 
                "Veg Pickle",
                150.00, 280.00, 540.00);

            seedProduct("Mango Pickle (Avakaya)", 
                "Traditional Telugu Avakaya mango pickle. Spicy mango chunks coated in a rich, flavorful red chili, mustard, and fenugreek masala.",
                "/assets/images/mango_pickle.png", 
                "Veg Pickle",
                160.00, 300.00, 580.00);

            seedProduct("Gongura Pickle", 
                "Authentic sorrel leaves pickle (Gongura Pachadi). Tangy green sorrel leaves fried and seasoned with red chilies, garlic cloves, and hot oil.",
                "/assets/images/gongura_pickle.png", 
                "Veg Pickle",
                140.00, 260.00, 500.00);

            seedProduct("Chicken Pickle", 
                "Ultra-flavorful Andhra Chicken Pickle. Succulent chicken pieces fried to perfection and preserved in ginger-garlic paste and spices.",
                "/assets/images/chicken_pickle.png", 
                "Non-Veg Pickle",
                350.00, 680.00, 1300.00);

            seedProduct("Mutton Pickle", 
                "Premium Andhra Mutton Pickle. Tender mutton chunks seasoned and slow-cooked in traditional pickle spices and rich sesame oil.",
                "/assets/images/mutton_pickle.png", 
                "Non-Veg Pickle",
                450.00, 850.00, 1650.00);

            seedProduct("Prawns Pickle", 
                "Authentic coastal prawns pickle. Juicy prawns marinated in traditional spices, fried crisp, and pickled in a fiery Andhra gravy.",
                "/assets/images/prawns_pickle.png", 
                "Non-Veg Pickle",
                400.00, 780.00, 1500.00);

            System.out.println("Seeded Default Snacks & Pickles Products and Weights Data successfully");
        }
    }

    private void seedProduct(String name, String desc, String img, String cat, double p250, double p500, double p1000) {
        com.amigossnacks.backend.entity.Product product = com.amigossnacks.backend.entity.Product.builder()
                .productName(name)
                .description(desc)
                .imageUrl(img)
                .category(cat)
                .weights(new java.util.ArrayList<>())
                .build();

        com.amigossnacks.backend.entity.Product savedProduct = productRepository.save(product);

        com.amigossnacks.backend.entity.ProductWeight w250 = com.amigossnacks.backend.entity.ProductWeight.builder()
                .product(savedProduct)
                .weight("250 Grams")
                .price(java.math.BigDecimal.valueOf(p250))
                .build();
        productWeightRepository.save(w250);
        savedProduct.getWeights().add(w250);

        com.amigossnacks.backend.entity.ProductWeight w500 = com.amigossnacks.backend.entity.ProductWeight.builder()
                .product(savedProduct)
                .weight("500 Grams")
                .price(java.math.BigDecimal.valueOf(p500))
                .build();
        productWeightRepository.save(w500);
        savedProduct.getWeights().add(w500);

        com.amigossnacks.backend.entity.ProductWeight w1000 = com.amigossnacks.backend.entity.ProductWeight.builder()
                .product(savedProduct)
                .weight("1000 Grams")
                .price(java.math.BigDecimal.valueOf(p1000))
                .build();
        productWeightRepository.save(w1000);
        savedProduct.getWeights().add(w1000);

        productRepository.save(savedProduct);
    }
}

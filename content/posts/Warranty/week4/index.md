---
title: Week 4
weight: 4
date: 2026-02-03
lastmod: 2026-03-08
---

## Week Four

**Progress:**

- Added **SendGrid API**, created class **EmailService** to handle how to send Emails.
- Created **WarrantyScheduler** that checks warranties and their expiration date.
- Created **TestClassFactory** that tests by sending an expired warranty notification to user's email.
- Created Junit test with Mockito to see if sending an email passes.

### Code snippet of EmailService

```java
public class EmailService {

    private final String apiKey;

    public EmailService(String apiKey){
        this.apiKey = apiKey;
    }

    public void sendWarrantyReminder(String toEmail, String productName, long daysLeft){
        try{
            Email from = new Email("tourwarranty@gmail.com");
            Email to = new Email(toEmail);
            String subject = "Warranty Reminder";

            String contextText = "Your Warranty For " + productName + " Expires in " + daysLeft + " Days.";

            Content content = new Content("text/plain", contextText);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            sg.api(request);
        } catch(IOException e){
            try {
                throw e;
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
    }
}
```

---

### Code snippet of WarrantyScheduler, checkWarranties method

```java
public void checkWarranties(){
        Set<Warranty> warranties = warrantyDAO.get();
        LocalDate today = LocalDate.now();

        for(Warranty warranty : warranties){
            long daysLeft = ChronoUnit.DAYS.between(today, warranty.calculateEndDate());

            if(daysLeft == 90 && !warranty.isNotified90Days()) {
            sendAndMark(warranty, 90);
            } else if(daysLeft == 60 && !warranty.isNotified60Days()){
                sendAndMark(warranty, 60);
            } else if(daysLeft == 30 && !warranty.isNotified30Days()){
                sendAndMark(warranty, 30);
            } else if(daysLeft == 0 && !warranty.isNotifiedExpired()){
                sendAndMark(warranty, 0);
            }
        }
    }
```

---

### Code snippet of TestClass

```java
public class TestClassFactory {
    static final EntityManagerFactory emf = HibernateConfig.getEntityManagerFactory();
   static final WarrantyDAO warrantyDAO = new WarrantyDAO(emf);
    static final ProductDAO productDAO = new ProductDAO(emf);
    static final UserDAO userDAO = new UserDAO(emf);

    static final EmailService emailService = new EmailService(System.getenv("SENDGRID_API_KEY"));
    static final WarrantyScheduler scheduler = new WarrantyScheduler(warrantyDAO, emailService);

    public static void testClassWarranty() {
        User testUser = new User();

        testUser.setEmail("danielhalawi22@gmail.com");
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setPassword("12345678");
        userDAO.create(testUser);

        Warranty testWarranty = new Warranty();
        testWarranty.setStartDate(LocalDate.now().minusMonths(3));
        testWarranty.setWarrantyMonths(3);
        testWarranty.calculateEndDate();

        Product product = new Product();
        product.setOwner(testUser);
        product.setProductName("Test Product");
        product.setWarranty(testWarranty);
        testWarranty.setProduct(product);
        productDAO.create(product);


        scheduler.checkWarranties();

        System.out.println("Test Sent to Email");
    }
}
```

---

**Reasoning:**

- From last discovery(XML), implementing **notification system** based on warranties suits the program.
- Used **SendGrid** because it's a familiar API that worked really well with **digitalOcean**.
- Used **Mockito** to test it out for the first time, also to not send in real data.
- Created **TestClass** to test with real data, on expiration date.
---
title: Week 3
weight: 3
date: 2026-02-03
lastmod: 2026-02-19
---

## Week Three

## Feedback
After having feedback with my teacher, I got more confirmation based on the backend setup I was building pertaining to my **ProductRegistration** and **Product**. His advice: **Remember to log more to make sure no details go lost**.

**Progress:**

- Added a **PasswordService** that hashes a user's password.
- Used **BCrypt** library to achieve hashing.
```java
public String hash(String password){
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public boolean verify(String password, String hash){
        return BCrypt.checkpw(password, hash);
    }
```
- Started working on how to use **API**
- Added a **XMLExtractor** to get data from **API**

Used our **HttpClient** made together in class but altered it to take an XML file instead of a Json file.
```java
private static final HttpClient client = HttpClient.newHttpClient();

    public static String getXml(String url) throws IOException, InterruptedException, URISyntaxException {
        HttpRequest request = HttpRequest
                .newBuilder()
                .uri(new URI(url))
                .header("Accept", "application/xml")
                .GET()
                .build();

        HttpResponse<String> response = client
                .send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return response.body();
        } else {
            System.out.println("Error in: " + response.statusCode());
        }
        return null;
    }
```
Created a new class that uses **DocumentBuilder** library to extract and parse XML files, and returns it into my **LawDataDTO** object.
```java
public static LawDataDTO extract(String xml) throws IOException, SAXException, ParserConfigurationException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(new InputSource(new StringReader(xml)));

        String title = "";
        NodeList titleNodes = doc.getElementsByTagName("DocumentTitle");
        if(titleNodes.getLength() > 0){
            title = titleNodes.item(0).getTextContent();
        }

        NodeList textNodes = doc.getElementsByTagName("Char");
        StringBuilder warrantyText = new StringBuilder();

        for(int i = 0; i < textNodes.getLength(); i++){
        String text = textNodes.item(i).getTextContent();

        if(text.toLowerCase().contains("garanti")){
            warrantyText.append(text).append("\n\n");
            }
        }
        return new LawDataDTO(title, warrantyText.toString());
    }
```

- Created an **IRetrieveDAO** interface with methods that **IRetrieveDAO** implements.

An example of one of a few IRetrieveDAO implementations that have been created.
These methods were used to get specific data out of the database using **JPQL** queries.
```java
@Override
    public Set<Warranty> getAllWarrantiesForUsers(long userId) {
        try (EntityManager em = emf.createEntityManager()) {
            TypedQuery<Warranty> query = em.createQuery("SELECT DISTINCT pr.product.warranty " +
                    "FROM ProductRegistration pr " +
                    "WHERE pr.owner.id = :userId", Warranty.class);
            query.setParameter("userId", userId);
            return new HashSet<>(query.getResultList());
        }
    }
```


**Reasoning:**
